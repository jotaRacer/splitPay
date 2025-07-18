"use client"

import { useState, useEffect } from "react"
import { MobileHeader } from "@/components/mobile-header"
import { Card, CardContent } from "@/components/ui/card"
import { ResponsiveButton } from "@/components/ui/responsive-button"
import { useRouter } from "next/navigation"
import { apiService, CreateSplitData } from "@/lib/api"
import { ethers } from "ethers"

export default function CreateSplitPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    amount: "",
    participants: "",
    description: ""
  })
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
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
        setErrors({ wallet: 'Failed to connect wallet' })
      }
    } else {
      setErrors({ wallet: 'Please install MetaMask or another Web3 wallet' })
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

  // Verificar conexión al cargar la página
  useEffect(() => {
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
  }, [])

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = "Split name is required"
    }

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = "Valid amount is required"
    }

    if (!formData.participants || parseInt(formData.participants) < 2) {
      newErrors.participants = "At least 2 participants required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleCreateSplit = async () => {
    console.log("=== handleCreateSplit called ===")
    console.log("Form data:", formData)
    console.log("Wallet address:", walletAddress)
    console.log("Is wallet connected:", isWalletConnected)
    console.log("Errors:", errors)
    
    if (!validateForm()) {
      console.log("Form validation failed")
      return
    }

    if (!isWalletConnected || !walletAddress) {
      console.log("Wallet not connected or no address")
      setErrors({ wallet: "Please connect your wallet first" })
      return
    }

    console.log("All validations passed, proceeding with split creation")
    setIsLoading(true)
    try {
      // Crear el split usando el backend
      const splitData: CreateSplitData = {
        name: formData.name,
        amount: parseFloat(formData.amount),
        participants: parseInt(formData.participants),
        description: formData.description,
        creator: walletAddress,
        creatorChain: "1" // Default to Ethereum mainnet
      }

      console.log("Creating split with data:", splitData)
      console.log("Wallet address being sent:", walletAddress)
      console.log("Is wallet connected:", isWalletConnected)
      
      let response
      try {
        response = await apiService.createSplit(splitData)
        console.log("API Response:", response)
      } catch (apiError) {
        console.error("API Error details:", apiError)
        throw apiError
      }
      
      if (response.success && response.data) {
        // Navigate to success page with split data
        const params = new URLSearchParams({
          token: response.data.token,
          name: formData.name,
          amount: formData.amount,
          participants: formData.participants,
          description: formData.description
        })
        const successUrl = `/success?${params.toString()}`
        console.log("About to navigate to:", successUrl)
        
        router.push(successUrl)
      } else {
        throw new Error(response.message || "Failed to create split")
      }
    } catch (error) {
      console.error("Error creating split:", error)
      setErrors({ api: error instanceof Error ? error.message : "Failed to create split" })
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
                <h1 className="text-responsive-3xl font-bold mb-2">Create New Split</h1>
                <p className="text-responsive-base text-muted-foreground">
                  Pay for the entire expense and generate a unique token to share with others
                </p>
              </div>
          </div>
        </section>

        {/* Create Split Form */}
        <section className="space-y-6">
          <Card className="border-2">
            <CardContent className="p-6">
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="text-xl font-semibold mb-2">Expense Details</h3>
                  <p className="text-sm text-muted-foreground">
                    Enter the expense details and pay the full amount
                  </p>
                </div>

                {/* Expense Name */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Expense Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="e.g., Team Dinner, Weekend Trip, Concert Tickets"
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.name ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.name && (
                    <p className="text-sm text-red-500">{errors.name}</p>
                  )}
                </div>

                {/* Total Amount */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Total Amount (USD)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                    <input
                      type="number"
                      value={formData.amount}
                      onChange={(e) => handleInputChange("amount", e.target.value)}
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                      className={`w-full pl-8 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.amount ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                  </div>
                  <p className="text-xs text-gray-500">This is the amount you'll pay upfront</p>
                  {errors.amount && (
                    <p className="text-sm text-red-500">{errors.amount}</p>
                  )}
                </div>

                {/* Number of Participants */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Number of People to Split With</label>
                  <input
                    type="number"
                    value={formData.participants}
                    onChange={(e) => handleInputChange("participants", e.target.value)}
                    placeholder="2"
                    min="2"
                    max="50"
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.participants ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  <p className="text-xs text-gray-500">Including yourself</p>
                  {errors.participants && (
                    <p className="text-sm text-red-500">{errors.participants}</p>
                  )}
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Description (Optional)</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    placeholder="Add details about the expense (location, date, etc.)"
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
                </div>

                {/* Expense Summary */}
                {formData.name && formData.amount && formData.participants && (
                  <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                    <h4 className="font-medium text-gray-900">Expense Summary</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Expense:</span>
                        <span className="font-medium">{formData.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Amount:</span>
                        <span className="font-medium">${parseFloat(formData.amount || "0").toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">People:</span>
                        <span className="font-medium">{formData.participants}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Each Person Pays:</span>
                        <span className="font-medium">
                          ${((parseFloat(formData.amount || "0") / parseInt(formData.participants || "1")) || 0).toFixed(2)}
                        </span>
                      </div>
                      <div className="pt-2 border-t border-gray-200">
                        <div className="flex justify-between text-green-600 font-medium">
                          <span>You'll Pay:</span>
                          <span>${parseFloat(formData.amount || "0").toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

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
                        Please connect your wallet to create a split
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

                {/* Error Messages */}
                {(errors.wallet || errors.api) && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-sm text-red-600">
                      {errors.wallet || errors.api}
                    </p>
                  </div>
                )}

                {/* Create Button */}
                <div className="pt-4">
                  <ResponsiveButton 
                    size="lg" 
                    className={`w-full ${
                      !isWalletConnected 
                        ? '!bg-gray-400 !hover:bg-gray-400 !from-gray-400 !to-gray-400 !text-white cursor-not-allowed' 
                        : '!bg-blue-600 !hover:bg-blue-700 !from-blue-600 !to-blue-600 hover:!from-blue-700 hover:!to-blue-700 !text-white'
                    }`}
                    onClick={handleCreateSplit}
                    disabled={isLoading || !isWalletConnected}
                  >
                    {!isWalletConnected 
                      ? "Connect Wallet First" 
                      : isLoading 
                        ? "Processing Payment..." 
                        : "Pay & Generate Token"
                    }
                  </ResponsiveButton>
                </div>
              </div>
            </CardContent>
          </Card>

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