"use client"

import { useState, useEffect, useCallback } from "react"
import dynamic from 'next/dynamic'
import { MobileHeader } from "@/components/mobile-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useRouter, useSearchParams } from "next/navigation"
import { apiService, Split } from "@/lib/api"
import { usePrivyWeb3 } from "@/contexts/privy-context"
import { Loader2, Users, DollarSign, Clock, CheckCircle, AlertTriangle, Wallet, Network } from "lucide-react"
import { toast } from 'sonner'

// Function to normalize backend split data to frontend format
const normalizeSplitData = (backendSplit: any): Split => {
  // Transform participants from backend format to frontend format
  const normalizedParticipants = Array.isArray(backendSplit.participantsList) 
    ? backendSplit.participantsList.map((p: any) => ({
        address: p.address || p.user?.wallet_address || p.wallet_address || '',
        chain: p.chain || '1',
        amount: p.amount || 0,
        paid: p.paid || false,
        paidAt: p.paidAt || p.paid_at || null,
        transactionHash: p.transactionHash || p.transaction_hash || null
      }))
    : []

  // Transform creator from backend format
  const creatorAddress = typeof backendSplit.creator === 'string' 
    ? backendSplit.creator 
    : backendSplit.creator?.wallet_address || ''

  return {
    ...backendSplit,
    creator: creatorAddress,
    participantsList: normalizedParticipants
  }
}

// Enhanced payment selector with optimized loading
const EnhancedPaymentSelector = dynamic(() => 
  import("@/components/enhanced-payment-selector").then(m => ({ default: m.EnhancedPaymentSelector })), 
  { 
    loading: () => (
      <div className="flex items-center justify-center p-6">
        <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
        <span className="ml-2">Loading payment system...</span>
      </div>
    ),
    ssr: false 
  }
)

interface JoinSplitState {
  step: 'input' | 'loading' | 'details' | 'payment' | 'success' | 'splitFull'
  splitInfo: Split | null
  participantId: string | null
  error: string | null
}

export default function JoinSplitPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { isConnected, account, chainId, connect } = usePrivyWeb3() // Use synchronous chainId
  
  // State management
  const [joinToken, setJoinToken] = useState("")
  const [state, setState] = useState<JoinSplitState>({
    step: 'input',
    splitInfo: null,
    participantId: null,
    error: null
  })

  // Define handleJoinSplit first (before useEffects that depend on it)
  const handleJoinSplit = useCallback(async (tokenToUse: string = joinToken) => {
    if (!tokenToUse.trim()) {
      setState(prev => ({ ...prev, error: "Please enter a valid split token" }))
      return
    }

    if (!isConnected || !account) {
      setState(prev => ({ ...prev, error: "Please connect your wallet first" }))
      return
    }

    setState(prev => ({ ...prev, step: 'loading', error: null }))

    let split: Split | null = null

    try {
      // First, get split information
      const splitResponse = await apiService.getSplitByToken(tokenToUse)
      
      if (!splitResponse.success || !splitResponse.data) {
        throw new Error(splitResponse.message || "Split not found. Please check the token and try again.")
      }

      split = normalizeSplitData(splitResponse.data)

      // Check if user is already a participant
      let existingParticipant = null
      if (Array.isArray(split.participantsList)) {
        existingParticipant = split.participantsList.find((p: any) => {
          // Now we can safely use the normalized address field
          return typeof p.address === 'string' && typeof account === 'string' &&
            p.address.toLowerCase() === account.toLowerCase()
        })
      }

      if (existingParticipant) {
        setState({
          step: 'payment',
          splitInfo: split,
          participantId: existingParticipant.address || account,
          error: null
        })
        toast.success("Welcome back! You can now complete your payment.")
        return
      }

      // Add user as a new participant
      const joinResponse = await apiService.joinSplit({
        token: tokenToUse,
        participantAddress: account,
        participantChain: "1" // Default to Ethereum - could be made dynamic
      })

      if (joinResponse.success && joinResponse.data) {
        // Normalize the join response data
        const normalizedSplit = normalizeSplitData(joinResponse.data)
        
        // Find the current user's participant ID after joining
        let newParticipantId = account
        if (Array.isArray(normalizedSplit.participantsList)) {
          const newParticipant = normalizedSplit.participantsList.find((p: any) => 
            typeof p.address === 'string' && typeof account === 'string' &&
            p.address.toLowerCase() === account.toLowerCase()
          )
          newParticipantId = newParticipant?.address || account
        }

        setState({
          step: 'payment',
          splitInfo: normalizedSplit,
          participantId: newParticipantId,
          error: null
        })
        toast.success("Successfully joined the split! You can now make your payment.")
      } else {
        throw new Error(joinResponse.message || "Failed to join split. Please try again.")
      }

    } catch (error: any) {
      const errorMessage = error.message || "Failed to join split. Please check the token and try again."
      
      // Check if the error is specifically about the split being full
      if (errorMessage.toLowerCase().includes('full') || errorMessage.toLowerCase().includes('capacity')) {
        // For split full error, show the split info but don't allow joining
        if (split) {
          setState({
            step: 'splitFull',
            splitInfo: split, // split is already normalized
            participantId: null,
            error: errorMessage
          })
          toast.error("This split is full and cannot accept new participants.")
          return
        }
      }
      
      setState(prev => ({ 
        ...prev, 
        step: 'input', 
        error: errorMessage 
      }))
      toast.error(errorMessage)
    }
  }, [isConnected, account])

  // Check URL parameters on load
  useEffect(() => {
    const urlToken = searchParams.get("token") || searchParams.get("id")
    if (urlToken) {
      setJoinToken(urlToken)
    }
  }, [searchParams])

  // Auto-join if wallet is connected and token is available - but only if not already processed
  useEffect(() => {
    if (joinToken && isConnected && account && state.step === 'input' && !state.error) {
      handleJoinSplit(joinToken)
    }
  }, [joinToken, isConnected, account, state.step, state.error, handleJoinSplit])

  const handlePaymentSuccess = (txHash: string) => {
    setState(prev => ({ ...prev, step: 'success' }))
    toast.success("Payment completed successfully!")
    
    // TODO: Update backend to mark participant as paid
    // This would involve calling an API endpoint with the transaction hash
  }

  const renderInputStep = () => (
    <>
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-3">Join Split Payment</h1>
        <p className="text-lg text-gray-600">
          Enter your split token to join and pay your share
        </p>
      </div>

      {/* Wallet Connection */}
      {!isConnected ? (
        <Card className="border-2 border-blue-200">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <Wallet className="h-6 w-6" />
              Connect Your Wallet
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-600 mb-6">
              Connect your wallet to join splits and make payments across any blockchain
            </p>
            <Button onClick={connect} size="lg" className="w-full sm:w-auto">
              Connect Wallet
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Enter Split Token
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Connected Wallet Info */}
            <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="font-medium text-green-800">Wallet Connected</span>
              </div>
              <p className="text-sm text-green-700 mt-1">
                {account?.slice(0, 8)}...{account?.slice(-6)}
              </p>
            </div>

            {/* Token Input */}
            <div className="space-y-3">
              <label className="block text-sm font-medium">
                Split Token or Share URL
              </label>
              <Input
                type="text"
                value={joinToken}
                onChange={(e) => setJoinToken(e.target.value)}
                placeholder="Enter split token (e.g., SPLIT-ABC123-XYZ) or paste share URL"
                className="text-lg py-3"
              />
              <p className="text-xs text-gray-500">
                You can paste the full share URL or just the token part
              </p>
            </div>

            {/* Error Display */}
            {state.error && (
              <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                  <span className="font-medium text-red-800">Error</span>
                </div>
                <p className="text-sm text-red-700 mt-1">{state.error}</p>
              </div>
            )}

            {/* Join Button */}
            <Button 
              onClick={() => handleJoinSplit()}
              disabled={!joinToken.trim()}
              size="lg"
              className="w-full"
            >
              Find & Join Split
            </Button>
          </CardContent>
        </Card>
      )}
    </>
  )

  const renderLoadingStep = () => (
    <Card className="border-2">
      <CardContent className="p-8 text-center">
        <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-blue-600" />
        <h3 className="text-xl font-semibold mb-2">Looking up your split...</h3>
        <p className="text-gray-600">
          Fetching split details and checking payment options
        </p>
      </CardContent>
    </Card>
  )

  const renderPaymentStep = () => {
    if (!state.splitInfo) return null

    const split = state.splitInfo
    
    // Defensive coding for creator comparison and address extraction
    let isCreator = false
    let creatorAddress = ""
    try {
      // With normalized data, creator should always be a string address
      creatorAddress = split.creator || ""
      
      if (creatorAddress && account && typeof account === 'string') {
        isCreator = creatorAddress.toLowerCase() === account.toLowerCase()
      }
    } catch (error) {
      isCreator = false
      creatorAddress = ""
    }

    return (
      <>
        {/* Split Overview */}
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-6 w-6" />
              {split.name || "Payment Split"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Split Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Amount:</span>
                  <span className="font-semibold text-lg">${split.amount}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Participants:</span>
                  <span className="font-medium">{split.participants}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Your Share:</span>
                  <Badge variant="secondary" className="text-lg font-semibold px-3 py-1">
                    ${(split.amount / split.participants).toFixed(2)}
                  </Badge>
                </div>
              </div>

              <div className="space-y-3">
                {split.receiverTokenSymbol && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Creator receives:</span>
                    <Badge variant="outline">{split.receiverTokenSymbol}</Badge>
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Network:</span>
                  <Badge variant="outline">
                    <Network className="h-3 w-3 mr-1" />
                    Chain {split.creatorChain}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Status:</span>
                  <Badge variant="secondary">
                    Participant
                  </Badge>
                </div>
              </div>
            </div>

            {/* Description */}
            {split.description && (
              <div className="border-t pt-4">
                <h4 className="font-medium mb-2">Description</h4>
                <p className="text-gray-700">{split.description}</p>
              </div>
            )}

            {/* Payment Progress */}
            {split.paymentStatus && (
              <div className="bg-gray-50 p-4 rounded-lg border-t">
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Payment Progress
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Collected:</span>
                    <span className="font-medium">${split.paymentStatus.collectedAmount}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Remaining:</span>
                    <span className="font-medium">${split.paymentStatus.remainingAmount}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${split.paymentStatus.percentage}%` }}
                    />
                  </div>
                  <div className="text-center text-sm text-gray-600">
                    {split.paymentStatus.percentage}% complete
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Payment Section */}
        <Card className="border-2 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-6 w-6" />
              Complete Your Payment
            </CardTitle>
                            <p className="text-sm text-gray-600">
                Pay your ${(split.amount / split.participants).toFixed(2)} share using any supported cryptocurrency
              </p>
          </CardHeader>
          <CardContent>
            <EnhancedPaymentSelector
              splitAmount={((split.amount / split.participants) || 0).toString()}
              creatorAddress={creatorAddress || ""}
              creatorChainId={parseInt(split.creatorChain || "1")}
              creatorTokenAddress={split.receiverTokenAddress || "0x0000000000000000000000000000000000000000"}
              className="w-full"
            />
          </CardContent>
        </Card>

      </>
    )
  }

  const renderSuccessStep = () => (
    <Card className="border-2 border-green-200">
      <CardContent className="p-8 text-center">
        <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
        <h3 className="text-2xl font-bold mb-3">Payment Successful!</h3>
        <p className="text-gray-600 mb-6">
          Your payment has been confirmed and the split creator will receive their funds.
        </p>
        <div className="space-y-3">
          <Button 
            onClick={() => router.push('/create')}
            variant="outline"
            className="w-full sm:w-auto"
          >
            Create New Split
          </Button>
        </div>
      </CardContent>
    </Card>
  )

  const renderSplitFullStep = () => {
    if (!state.splitInfo) return null

    const split = state.splitInfo

    return (
      <>
        {/* Split Overview - Read Only */}
        <Card className="border-2 border-orange-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-6 w-6" />
              {split.name || "Payment Split"}
              <Badge variant="secondary" className="ml-2 bg-orange-100 text-orange-800">
                FULL
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Split Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Amount:</span>
                  <span className="font-semibold text-lg">${split.amount}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Participants:</span>
                  <span className="font-medium">{split.participants}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Per Person:</span>
                  <Badge variant="secondary" className="text-lg font-semibold px-3 py-1">
                    ${(split.amount / split.participants).toFixed(2)}
                  </Badge>
                </div>
              </div>

              <div className="space-y-3">
                {split.receiverTokenSymbol && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Creator receives:</span>
                    <Badge variant="outline">{split.receiverTokenSymbol}</Badge>
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Network:</span>
                  <Badge variant="outline">
                    <Network className="h-3 w-3 mr-1" />
                    Chain {split.creatorChain}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Status:</span>
                  <Badge variant="destructive">
                    Split Full
                  </Badge>
                </div>
              </div>
            </div>

            {/* Description */}
            {split.description && (
              <div className="border-t pt-4">
                <h4 className="font-medium mb-2">Description</h4>
                <p className="text-gray-700">{split.description}</p>
              </div>
            )}

            {/* Full Message */}
            <div className="bg-orange-50 border border-orange-200 p-4 rounded-lg">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-600" />
                <span className="font-medium text-orange-800">Split is Full</span>
              </div>
              <p className="text-sm text-orange-700 mt-1">
                This split has reached its maximum capacity of {split.participants} participants and cannot accept new members.
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Button 
                onClick={() => router.push('/create')}
                className="flex-1"
              >
                Create New Split
              </Button>
              <Button 
                onClick={() => setState(prev => ({ ...prev, step: 'input', error: null }))}
                variant="outline"
                className="flex-1"
              >
                Try Another Split
              </Button>
            </div>
          </CardContent>
        </Card>
      </>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <MobileHeader />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto space-y-8">
          {state.step === 'input' && renderInputStep()}
          {state.step === 'loading' && renderLoadingStep()}
          {state.step === 'payment' && renderPaymentStep()}
          {state.step === 'splitFull' && renderSplitFullStep()}
          {state.step === 'success' && renderSuccessStep()}
        </div>
      </main>
    </div>
  )
}