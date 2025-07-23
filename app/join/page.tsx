"use client"

import { useState, useEffect } from "react"
import { MobileHeader } from "@/components/mobile-header"
import { Card, CardContent } from "@/components/ui/card"
import { ResponsiveButton } from "@/components/ui/responsive-button"
import { useRouter, useSearchParams } from "next/navigation"
import { apiService, Split } from "@/lib/api"
import { usePrivyWeb3 } from "@/contexts/privy-context"

export default function JoinSplitPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { isConnected, account, connect } = usePrivyWeb3()
  
  const [token, setToken] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [splitInfo, setSplitInfo] = useState<Split | null>(null)
  const [error, setError] = useState("")

  useEffect(() => {
    // Check if token is provided in URL
    const urlToken = searchParams.get("token")
    if (urlToken) {
      setToken(urlToken)
      handleJoinSplit(urlToken)
    }
  }, [searchParams])

  const handleJoinSplit = async (tokenToUse: string = token) => {
    if (!tokenToUse.trim()) {
      setError("Please enter a valid token")
      return
    }

    if (!isConnected || !account) {
      setError("Please connect your wallet first")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      console.log("Joining split with token:", tokenToUse)
      console.log("Wallet address:", account)
      
      // Get split information
      const splitResponse = await apiService.getSplitByToken(tokenToUse)
      console.log("Split response:", splitResponse)
      
      if (!splitResponse.success || !splitResponse.data) {
        throw new Error("Split not found")
      }

      const split = splitResponse.data
      console.log("Split found:", split)
      
      // Join the split
      const joinResponse = await apiService.joinSplit({
        token: tokenToUse,
        participantAddress: account,
        participantChain: "1" // Default to Ethereum mainnet
      })

      console.log("Join response:", joinResponse)

      if (joinResponse.success && joinResponse.data) {
        setSplitInfo(joinResponse.data)
      } else {
        throw new Error(joinResponse.message || "Failed to join split")
      }
    } catch (error: any) {
      console.error("Error joining split:", error)
      setError(error.message || "Failed to join split")
    } finally {
      setIsLoading(false)
    }
  }

  const handlePayment = async () => {
    if (!splitInfo || !account) return

    try {
      // For now, just navigate to swap page
      // In a real implementation, you'd handle the payment here
      router.push("/swap")
    } catch (error: any) {
      console.error("Error processing payment:", error)
      setError(error.message || "Failed to process payment")
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <MobileHeader />

      <main className="container-fluid py-6">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-2">Join Split</h1>
            <p className="text-gray-600">
              Enter the token to join an existing payment split
            </p>
          </div>

          {/* Wallet Connection */}
          {!isConnected ? (
            <Card className="border-2">
              <CardContent className="p-6 text-center">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold">Connect Your Wallet</h3>
                    <p className="text-sm text-gray-600">
                      You need to connect your wallet to join a split
                    </p>
                  </div>
                  <ResponsiveButton 
                    onClick={connect}
                    className="w-full sm:w-auto"
                  >
                    Connect Wallet
                  </ResponsiveButton>
                </div>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Token Input */}
              <Card className="border-2">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Split Token
                      </label>
                      <input
                        type="text"
                        value={token}
                        onChange={(e) => setToken(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter the split token..."
                      />
                    </div>

                    {/* Wallet Info */}
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="text-sm text-blue-800">
                        <strong>Connected Wallet:</strong> {account?.slice(0, 6)}...{account?.slice(-4)}
                      </p>
                    </div>

                    {/* Error Display */}
                    {error && (
                      <div className="bg-red-50 p-4 rounded-lg">
                        <p className="text-red-600 text-sm">{error}</p>
                      </div>
                    )}

                    {/* Join Button */}
                    <ResponsiveButton 
                      onClick={() => handleJoinSplit()}
                      disabled={isLoading || !token.trim()}
                      className="w-full !bg-blue-600 !hover:bg-blue-700 !from-blue-600 !to-blue-600 hover:!from-blue-700 hover:!to-blue-700 !text-white"
                    >
                      {isLoading ? 'Joining Split...' : 'Join Split'}
                    </ResponsiveButton>
                  </div>
                </CardContent>
              </Card>

              {/* Split Information */}
              {splitInfo && (
                <Card className="border-2">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <h3 className="text-xl font-semibold">Split Details</h3>
                      
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Name:</span>
                          <span className="font-medium">{splitInfo.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Total Amount:</span>
                          <span className="font-medium">${splitInfo.amount}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Participants:</span>
                          <span className="font-medium">{splitInfo.participants}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Your Share:</span>
                          <span className="font-medium">${splitInfo.amountPerPerson}</span>
                        </div>
                        {splitInfo.description && (
                          <div className="pt-3 border-t">
                            <span className="text-gray-600">Description:</span>
                            <p className="text-sm mt-1">{splitInfo.description}</p>
                          </div>
                        )}
                      </div>

                      {/* Payment Status */}
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-medium mb-2">Payment Status</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Collected:</span>
                            <span>${splitInfo.paymentStatus.collectedAmount}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Remaining:</span>
                            <span>${splitInfo.paymentStatus.remainingAmount}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Progress:</span>
                            <span>{splitInfo.paymentStatus.percentage}%</span>
                          </div>
                        </div>
                      </div>

                      {/* Payment Button */}
                      <ResponsiveButton 
                        onClick={handlePayment}
                        className="w-full !bg-green-600 !hover:bg-green-700 !from-green-600 !to-green-600 hover:!from-green-700 hover:!to-green-700 !text-white"
                      >
                        Pay ${splitInfo.amountPerPerson}
                      </ResponsiveButton>
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  )
} 