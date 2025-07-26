"use client"

import React, { memo, useState } from "react"
import { MobileHeader } from "@/components/mobile-header"
import { Card, CardContent } from "@/components/ui/card"
import { ResponsiveButton } from "@/components/ui/responsive-button"
import { ReceiverPreferences } from "@/components/receiver-preferences"
import { useRouter } from "next/navigation"
import { apiService, CreateSplitData } from "@/lib/api"
import { usePrivyWeb3 } from "@/contexts/privy-context"

const CreateSplitPage = memo(function CreateSplitPage() {
  const router = useRouter()
  const { isConnected, account, connect } = usePrivyWeb3()
  
  const [formData, setFormData] = useState({
    name: "",
    amount: "",
    participants: "",
    description: ""
  })
  const [receiverPreferences, setReceiverPreferences] = useState({
    chainId: 1, // Default to Ethereum
    tokenAddress: "0x0000000000000000000000000000000000000000", // Default to native token
    tokenSymbol: "ETH",
    tokenDecimals: 18
  })
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

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
    if (!isConnected || !account) {
      setErrors({ wallet: 'Please connect your wallet first' })
      return
    }

    if (!validateForm()) {
      return
    }

    setIsLoading(true)
    setErrors({})

    try {
      const splitData: CreateSplitData = {
        name: formData.name,
        amount: parseFloat(formData.amount),
        participants: parseInt(formData.participants),
        description: formData.description,
        creator: account,
        creatorChain: receiverPreferences.chainId.toString(),
        // Add receiver preferences to the split data
        receiverTokenAddress: receiverPreferences.tokenAddress,
        receiverTokenSymbol: receiverPreferences.tokenSymbol,
        receiverTokenDecimals: receiverPreferences.tokenDecimals
      }

      const response = await apiService.createSplit(splitData)

      if (response.success && response.data) {
        // Navigate to success page with split data
        const successUrl = `/success?token=${response.data.token}&name=${encodeURIComponent(formData.name)}&amount=${formData.amount}&participants=${formData.participants}&description=${encodeURIComponent(formData.description)}`
        router.push(successUrl)
      } else {
        throw new Error(response.message || 'Failed to create split')
      }
    } catch (error: any) {
      setErrors({ submit: error.message || 'Failed to create split' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <MobileHeader />

      <main className="container-fluid py-6">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-2">Create New Split</h1>
            <p className="text-gray-600">
              Create a payment split and invite your friends to contribute
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
                      You need to connect your wallet to create a split
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
            <Card className="border-2">
              <CardContent className="p-6">
                <div className="space-y-6">
                  {/* Split Details Form */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Split Name *
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="e.g., Team Dinner, Weekend Trip"
                      />
                      {errors.name && (
                        <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Total Amount *
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={formData.amount}
                        onChange={(e) => handleInputChange('amount', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="0.00"
                      />
                      {errors.amount && (
                        <p className="text-red-500 text-sm mt-1">{errors.amount}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Number of Participants *
                      </label>
                      <input
                        type="number"
                        min="2"
                        value={formData.participants}
                        onChange={(e) => handleInputChange('participants', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="2"
                      />
                      {errors.participants && (
                        <p className="text-red-500 text-sm mt-1">{errors.participants}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Description (Optional)
                      </label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows={3}
                        placeholder="Add details about this split..."
                      />
                    </div>
                  </div>

                  {/* Receiver Preferences */}
                  <ReceiverPreferences 
                    onPreferencesChange={setReceiverPreferences}
                    className="border-2"
                  />

                  {/* Wallet Info */}
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <strong>Connected Wallet:</strong> {account?.slice(0, 6)}...{account?.slice(-4)}
                    </p>
                  </div>

                  {/* Error Display */}
                  {errors.submit && (
                    <div className="bg-red-50 p-4 rounded-lg">
                      <p className="text-red-600 text-sm">{errors.submit}</p>
                    </div>
                  )}

                  {/* Create Button */}
                  <ResponsiveButton 
                    onClick={handleCreateSplit}
                    disabled={isLoading}
                    className="w-full !bg-blue-600 !hover:bg-blue-700 !from-blue-600 !to-blue-600 hover:!from-blue-700 hover:!to-blue-700 !text-white"
                  >
                    {isLoading ? 'Creating Split...' : 'Create Split'}
                  </ResponsiveButton>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
})

export default CreateSplitPage 