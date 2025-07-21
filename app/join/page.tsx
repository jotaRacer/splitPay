"use client"

import { useState, useEffect } from "react"
import { MobileHeader } from "@/components/mobile-header"
import { Card, CardContent } from "@/components/ui/card"
import { ResponsiveButton } from "@/components/ui/responsive-button"
import { LifiPaymentButton } from "@/components/lifi-payment-button"
import { useRouter, useSearchParams } from "next/navigation"
import { apiService, Split } from "@/lib/api"
import { ethers } from "ethers"

export default function JoinSplitPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [token, setToken] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [splitInfo, setSplitInfo] = useState<Split | null>(null)
  const [error, setError] = useState("")
  const [walletAddress, setWalletAddress] = useState<string | null>(null)
  const [isWalletConnected, setIsWalletConnected] = useState(false)

  // Función para conectar wallet
  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum)
        const accounts = await provider.send('eth_requestAccounts', [])
        const network = await provider.getNetwork()
        
        setWalletAddress(accounts[0])
        setIsWalletConnected(true)
        
        console.log('Wallet connected:', accounts[0])
        console.log('Chain ID:', network.chainId)
      } catch (error) {
        console.error('Failed to connect wallet:', error)
        setError('Failed to connect wallet')
      }
    } else {
      setError('Please install MetaMask or another Web3 wallet')
    }
  }

  // Verificar si ya hay una wallet conectada al cargar la página
  const checkWalletConnection = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum)
        const accounts = await provider.listAccounts()
        console.log('Checking wallet connection - Accounts found:', accounts.length)
        
        if (accounts.length > 0) {
          const network = await provider.getNetwork()
          const address = accounts[0].address
          setWalletAddress(address)
          setIsWalletConnected(true)
          console.log('Wallet already connected:', address)
          console.log('Chain ID:', network.chainId)
        } else {
          console.log('No accounts found - wallet not connected')
          setWalletAddress(null)
          setIsWalletConnected(false)
        }
      } catch (error) {
        console.error('Error checking wallet connection:', error)
        setWalletAddress(null)
        setIsWalletConnected(false)
      }
    } else {
      console.log('No ethereum provider found')
      setWalletAddress(null)
      setIsWalletConnected(false)
    }
  }

  useEffect(() => {
    // Verificar conexión de wallet al cargar la página
    checkWalletConnection()
    
    // Escuchar cambios en la wallet
    if (typeof window.ethereum !== 'undefined') {
      const handleAccountsChanged = (accounts: string[]) => {
        console.log('Accounts changed:', accounts)
        if (accounts.length > 0) {
          setWalletAddress(accounts[0])
          setIsWalletConnected(true)
        } else {
          setWalletAddress(null)
          setIsWalletConnected(false)
        }
      }

      const handleChainChanged = (chainId: string) => {
        console.log('Chain changed:', chainId)
        // Recargar la página cuando cambie la red
        window.location.reload()
      }

      window.ethereum.on('accountsChanged', handleAccountsChanged)
      window.ethereum.on('chainChanged', handleChainChanged)

      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged)
        window.ethereum.removeListener('chainChanged', handleChainChanged)
      }
    }
    
    // Check if token is provided in URL
    const urlToken = searchParams.get("token")
    if (urlToken) {
      setToken(urlToken)
      handleJoinSplit(urlToken)
    }
  }, [searchParams])

  const handleJoinSplit = async (tokenToUse: string = token) => {
    console.log("=== handleJoinSplit called ===")
    console.log("Token to use:", tokenToUse)
    console.log("Token length:", tokenToUse.length)
    console.log("Token trimmed:", tokenToUse.trim())
    
    if (!tokenToUse.trim()) {
      console.log("Token is empty after trim")
      setError("Please enter a valid token")
      return
    }

    if (!isWalletConnected || !walletAddress) {
      console.log("Wallet not connected or no address")
      setError("Please connect your wallet first")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      console.log("Joining split with token:", tokenToUse)
      console.log("Wallet address:", walletAddress)
      console.log("Is wallet connected:", isWalletConnected)
      
      // Obtener información del split
      console.log("Calling getSplitByToken with token:", tokenToUse)
      const splitResponse = await apiService.getSplitByToken(tokenToUse)
      console.log("Split response:", splitResponse)
      
      if (!splitResponse.success || !splitResponse.data) {
        console.log("Split not found in response")
        throw new Error("Split not found")
      }

      const split = splitResponse.data
      console.log("Split found:", split)
      
      // Unirse al split
      console.log("Calling joinSplit with data:", {
        token: tokenToUse,
        participantAddress: walletAddress,
        participantChain: "1"
      })
      
      const joinResponse = await apiService.joinSplit({
        token: tokenToUse,
        participantAddress: walletAddress,
        participantChain: "1" // Default to Ethereum mainnet
      })

      console.log("Join response:", joinResponse)

      if (joinResponse.success && joinResponse.data) {
        setSplitInfo(joinResponse.data)
      } else {
        throw new Error(joinResponse.message || "Failed to join split")
      }
    } catch (error) {
      console.error("Error joining split:", error)
      setError(error instanceof Error ? error.message : "Invalid token or split not found")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <MobileHeader />

      <main className="container-fluid py-6 space-y-8">
        {/* Welcome Section */}
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-responsive-3xl font-bold mb-2">Join Existing Split</h1>
              <p className="text-responsive-base text-muted-foreground">
                Enter the split token to contribute your share
              </p>
            </div>
          </div>
        </section>

        {/* Join Split Form */}
        <section className="space-y-6">
          <Card className="border-2">
            <CardContent className="p-6">
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="text-xl font-semibold mb-2">Enter Split Token</h3>
                  <p className="text-sm text-muted-foreground">
                    Enter the token provided by the split creator
                  </p>
                </div>

                {/* Token Input */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Split Token</label>
                  <input
                    type="text"
                    value={token}
                    onChange={(e) => setToken(e.target.value.toUpperCase())}
                    placeholder="e.g., ABC123DEF456"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center font-mono"
                    disabled={isLoading}
                  />
                  {error && (
                    <p className="text-sm text-red-500 text-center">{error}</p>
                  )}
                </div>

                {/* Wallet Status */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2">
                    <div className={`h-2 w-2 rounded-full ${isWalletConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <span className="text-sm font-medium">
                      {isWalletConnected ? 'Wallet Connected' : 'Wallet Not Connected'}
                    </span>
                  </div>
                  {walletAddress && (
                    <p className="text-xs text-blue-600 mt-1 font-mono">
                      {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                    </p>
                  )}
                  {!isWalletConnected && (
                    <div className="mt-2">
                      <p className="text-xs text-blue-600 mb-2">
                        Please connect your wallet to join a split
                      </p>
                      <button
                        onClick={connectWallet}
                        className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
                      >
                        Connect Wallet
                      </button>
                    </div>
                  )}
                </div>

                {/* Join Button */}
                <div className="pt-4">
                  <ResponsiveButton 
                    size="lg" 
                    className={`w-full ${
                      !isWalletConnected 
                        ? '!bg-gray-400 !hover:bg-gray-400 !from-gray-400 !to-gray-400 !text-white cursor-not-allowed' 
                        : '!bg-blue-600 !hover:bg-blue-700 !from-blue-600 !to-blue-600 hover:!from-blue-700 hover:!to-blue-700 !text-white'
                    }`}
                    onClick={() => handleJoinSplit()}
                    disabled={isLoading || !isWalletConnected}
                  >
                    {!isWalletConnected 
                      ? "Connect Wallet First" 
                      : isLoading 
                        ? "Validating Token..." 
                        : "Join Split"
                    }
                  </ResponsiveButton>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Split Information Display */}
          {splitInfo && (
            <Card className="border-2">
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div className="text-center">
                    <h3 className="text-xl font-semibold mb-2">Split Details</h3>
                    <p className="text-sm text-muted-foreground">
                      Review the split information before contributing
                    </p>
                  </div>

                  {/* Split Info */}
                  <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                    <h4 className="font-medium text-gray-900">Expense Information</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Expense:</span>
                        <span className="font-medium">{splitInfo.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Amount:</span>
                        <span className="font-medium">${splitInfo.amount.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">People:</span>
                        <span className="font-medium">{splitInfo.participants}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Your Share:</span>
                        <span className="font-medium text-green-600">${splitInfo.amountPerPerson.toFixed(2)}</span>
                      </div>
                      {splitInfo.description && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Description:</span>
                          <span className="font-medium">{splitInfo.description}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Participants List */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-gray-900">Participants</h4>
                    <div className="space-y-2">
                      {splitInfo.participantsList.map((participant, index) => (
                        <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                          <span className="text-sm font-mono">
                            {participant.address === walletAddress ? "You" : `${participant.address.slice(0, 6)}...${participant.address.slice(-4)}`}
                          </span>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium">${participant.amount.toFixed(2)}</span>
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              participant.paid 
                                ? "bg-green-100 text-green-700" 
                                : "bg-yellow-100 text-yellow-700"
                            }`}>
                              {participant.paid ? "Paid" : "Pending"}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Payment Status */}
                  <div className="bg-blue-50 p-4 rounded-lg space-y-2">
                    <h4 className="font-medium text-blue-900">Payment Progress</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-blue-700">Collected:</span>
                        <span className="font-medium">${splitInfo.paymentStatus.collectedAmount.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-700">Remaining:</span>
                        <span className="font-medium">${splitInfo.paymentStatus.remainingAmount.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-700">Progress:</span>
                        <span className="font-medium">{splitInfo.paymentStatus.percentage.toFixed(1)}%</span>
                      </div>
                    </div>
                  </div>

                  {/* Pay Button */}
                  <div className="pt-4">
                    <LifiPaymentButton
                      splitAmount={splitInfo.amountPerPerson.toString()}
                      creatorAddress={splitInfo.creator}
                      creatorChainId={parseInt(splitInfo.creatorChain)}
                      creatorTokenAddress={ethers.ZeroAddress} // Token nativo por defecto
                      className="w-full"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Card className="border-2">
            <CardContent className="p-4 sm:p-6 text-center">
              <div className="flex flex-col items-center space-y-4">
                <div>
                  <h3 className="text-lg font-semibold">Back to Home</h3>
                  <p className="text-sm text-muted-foreground">
                    Return to the main dashboard
                  </p>
                </div>
                <ResponsiveButton 
                  size="lg" 
                  className="w-full sm:w-auto !bg-gray-600 !hover:bg-gray-700 !from-gray-600 !to-gray-600 hover:!from-gray-700 hover:!to-gray-700 !text-white"
                  onClick={() => router.push("/")}
                >
                  Go Back
                </ResponsiveButton>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  )
} 