"use client"

import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { usePrivyWeb3 } from '@/contexts/privy-context'
import { Loader2, Wallet, ArrowDown, CheckCircle } from 'lucide-react'
import { ethers } from 'ethers'

// Popular tokens across different chains for receiving
const RECEIVER_TOKENS = {
  1: [ // Ethereum
    { symbol: 'ETH', address: '0x0000000000000000000000000000000000000000', name: 'Ether', decimals: 18, popular: true },
    { symbol: 'USDC', address: '0xA0b86a33E6441e627ee7E8e4E1F60a3C5c3A8C86', name: 'USD Coin', decimals: 6, popular: true },
    { symbol: 'USDT', address: '0xdAC17F958D2ee523a2206206994597C13D831ec7', name: 'Tether USD', decimals: 6, popular: true },
    { symbol: 'DAI', address: '0x6B175474E89094C44Da98b954EedeAC495271d0F', name: 'Dai Stablecoin', decimals: 18, popular: false },
  ],
  137: [ // Polygon
    { symbol: 'MATIC', address: '0x0000000000000000000000000000000000000000', name: 'Polygon', decimals: 18, popular: true },
    { symbol: 'USDC', address: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174', name: 'USD Coin', decimals: 6, popular: true },
    { symbol: 'USDT', address: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F', name: 'Tether USD', decimals: 6, popular: true },
    { symbol: 'DAI', address: '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063', name: 'Dai Stablecoin', decimals: 18, popular: false },
  ],
  8453: [ // Base
    { symbol: 'ETH', address: '0x0000000000000000000000000000000000000000', name: 'Ether', decimals: 18, popular: true },
    { symbol: 'USDC', address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913', name: 'USD Coin', decimals: 6, popular: true },
    { symbol: 'DAI', address: '0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb', name: 'Dai Stablecoin', decimals: 18, popular: false },
  ],
  42161: [ // Arbitrum
    { symbol: 'ETH', address: '0x0000000000000000000000000000000000000000', name: 'Ether', decimals: 18, popular: true },
    { symbol: 'USDC', address: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831', name: 'USD Coin', decimals: 6, popular: true },
    { symbol: 'USDT', address: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9', name: 'Tether USD', decimals: 6, popular: true },
    { symbol: 'DAI', address: '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1', name: 'Dai Stablecoin', decimals: 18, popular: false },
  ]
}

const NETWORK_INFO = {
  1: { name: 'Ethereum', symbol: 'ETH', color: 'bg-blue-500', fees: 'High', speed: 'Medium' },
  137: { name: 'Polygon', symbol: 'MATIC', color: 'bg-purple-500', fees: 'Low', speed: 'Fast' },
  8453: { name: 'Base', symbol: 'ETH', color: 'bg-blue-400', fees: 'Low', speed: 'Fast' },
  42161: { name: 'Arbitrum', symbol: 'ETH', color: 'bg-blue-600', fees: 'Low', speed: 'Fast' }
}

interface ReceiverPreferencesProps {
  onPreferencesChange: (preferences: {
    chainId: number
    tokenAddress: string
    tokenSymbol: string
    tokenDecimals: number
  }) => void
  className?: string
}

export function ReceiverPreferences({ onPreferencesChange, className }: ReceiverPreferencesProps) {
  const { account, getChainId } = usePrivyWeb3()
  
  // State management
  const [currentChainId, setCurrentChainId] = useState<number | null>(null)
  const [selectedChainId, setSelectedChainId] = useState<number>(1) // Default to Ethereum
  const [selectedToken, setSelectedToken] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Load current chain ID
  useEffect(() => {
    const loadChainId = async () => {
      if (account) {
        const chainId = await getChainId()
        setCurrentChainId(chainId)
        // Default to current chain if supported, otherwise Ethereum
        if (chainId && RECEIVER_TOKENS[chainId as keyof typeof RECEIVER_TOKENS]) {
          setSelectedChainId(chainId)
        }
      }
      setIsLoading(false)
    }
    loadChainId()
  }, [account, getChainId])

  // Get available tokens for selected chain
  const availableTokens = useMemo(() => {
    if (!RECEIVER_TOKENS[selectedChainId as keyof typeof RECEIVER_TOKENS]) {
      return []
    }
    return RECEIVER_TOKENS[selectedChainId as keyof typeof RECEIVER_TOKENS]
  }, [selectedChainId])

  // Auto-select first popular token when chain changes
  useEffect(() => {
    if (availableTokens.length > 0 && !selectedToken) {
      const defaultToken = availableTokens.find(t => t.popular) || availableTokens[0]
      setSelectedToken(defaultToken)
    }
  }, [availableTokens, selectedToken])

  // Notify parent when preferences change
  useEffect(() => {
    if (selectedToken && selectedChainId) {
      onPreferencesChange({
        chainId: selectedChainId,
        tokenAddress: selectedToken.address,
        tokenSymbol: selectedToken.symbol,
        tokenDecimals: selectedToken.decimals
      })
    }
  }, [selectedChainId, selectedToken, onPreferencesChange])

  // Handle chain selection
  const handleChainSelect = (chainId: string) => {
    const newChainId = parseInt(chainId)
    setSelectedChainId(newChainId)
    setSelectedToken(null) // Reset token selection
  }

  // Handle token selection
  const handleTokenSelect = (tokenSymbol: string) => {
    const token = availableTokens.find(t => t.symbol === tokenSymbol)
    if (token) {
      setSelectedToken(token)
    }
  }

  if (isLoading) {
    return (
      <Card className={className}>
        <CardContent className="p-6 text-center">
          <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
          <p className="text-muted-foreground">Loading preferences...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet className="h-5 w-5" />
          Where do you want to receive payments?
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Choose your preferred network and token. Payers can pay from any network, and funds will be converted automatically.
        </p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Current Wallet Info */}
        {currentChainId && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <div className={`w-3 h-3 rounded-full ${NETWORK_INFO[currentChainId as keyof typeof NETWORK_INFO]?.color || 'bg-gray-400'}`} />
              <span className="text-sm font-medium">
                Currently connected to {NETWORK_INFO[currentChainId as keyof typeof NETWORK_INFO]?.name || `Chain ${currentChainId}`}
              </span>
            </div>
            <p className="text-xs text-blue-700">
              You can receive on any network, not just your current one
            </p>
          </div>
        )}

        {/* Network Selection */}
        <div className="space-y-3">
          <label className="text-sm font-medium">Choose receiving network:</label>
          <Select value={selectedChainId.toString()} onValueChange={handleChainSelect}>
            <SelectTrigger>
              <SelectValue placeholder="Select network..." />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(NETWORK_INFO).map(([chainId, info]) => (
                <SelectItem key={chainId} value={chainId}>
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${info.color}`} />
                      <span className="font-medium">{info.name}</span>
                    </div>
                    <div className="flex gap-1">
                      <Badge variant="outline" className="text-xs">
                        {info.fees} fees
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {info.speed}
                      </Badge>
                    </div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Token Selection */}
        {availableTokens.length > 0 && (
          <div className="space-y-3">
            <label className="text-sm font-medium">Choose receiving token:</label>
            <Select 
              value={selectedToken?.symbol || ''} 
              onValueChange={handleTokenSelect}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select token..." />
              </SelectTrigger>
              <SelectContent>
                {availableTokens.map((token) => (
                  <SelectItem key={token.symbol} value={token.symbol}>
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{token.symbol}</span>
                        <span className="text-muted-foreground text-sm">{token.name}</span>
                      </div>
                      {token.popular && (
                        <Badge variant="secondary" className="text-xs">
                          Popular
                        </Badge>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Selection Summary */}
        {selectedToken && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium text-green-800">Receiving Preferences Set</span>
            </div>
            <div className="space-y-1 text-sm text-green-700">
              <div className="flex items-center justify-between">
                <span>Network:</span>
                <div className="flex items-center gap-1">
                  <div className={`w-2 h-2 rounded-full ${NETWORK_INFO[selectedChainId as keyof typeof NETWORK_INFO]?.color}`} />
                  <span className="font-medium">
                    {NETWORK_INFO[selectedChainId as keyof typeof NETWORK_INFO]?.name}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span>Token:</span>
                <span className="font-medium">{selectedToken.symbol}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Fees:</span>
                <Badge variant="outline" className="text-xs">
                  {NETWORK_INFO[selectedChainId as keyof typeof NETWORK_INFO]?.fees}
                </Badge>
              </div>
            </div>
          </div>
        )}

        {/* How it works */}
        <div className="p-3 bg-gray-50 rounded-lg text-xs text-gray-600">
          <p className="font-medium mb-1">💡 How this works:</p>
          <ul className="space-y-1 ml-2">
            <li>• Payers can use any token from any network</li>
            <li>• LiFi automatically converts and routes to your choice</li>
            <li>• You receive exactly what you want, where you want it</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
