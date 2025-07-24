"use client"

import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { usePrivyWeb3 } from '@/contexts/privy-context'
import { useLifiPayment } from '@/hooks/use-lifi-payment'
import { Loader2, Coins, ArrowRight, CheckCircle, AlertTriangle } from 'lucide-react'
import { toast } from 'sonner'
import { ethers } from 'ethers'

// Popular tokens across different chains
const POPULAR_TOKENS = {
  1: [ // Ethereum
    { symbol: 'ETH', address: '0x0000000000000000000000000000000000000000', name: 'Ether', decimals: 18 },
    { symbol: 'USDC', address: '0xA0b86a33E6441e627ee7E8e4E1F60a3C5c3A8C86', name: 'USD Coin', decimals: 6 },
    { symbol: 'USDT', address: '0xdAC17F958D2ee523a2206206994597C13D831ec7', name: 'Tether USD', decimals: 6 },
    { symbol: 'DAI', address: '0x6B175474E89094C44Da98b954EedeAC495271d0F', name: 'Dai Stablecoin', decimals: 18 },
  ],
  137: [ // Polygon
    { symbol: 'MATIC', address: '0x0000000000000000000000000000000000000000', name: 'Polygon', decimals: 18 },
    { symbol: 'USDC', address: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174', name: 'USD Coin', decimals: 6 },
    { symbol: 'USDT', address: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F', name: 'Tether USD', decimals: 6 },
    { symbol: 'DAI', address: '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063', name: 'Dai Stablecoin', decimals: 18 },
  ],
  8453: [ // Base
    { symbol: 'ETH', address: '0x0000000000000000000000000000000000000000', name: 'Ether', decimals: 18 },
    { symbol: 'USDC', address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913', name: 'USD Coin', decimals: 6 },
    { symbol: 'DAI', address: '0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb', name: 'Dai Stablecoin', decimals: 18 },
  ],
  42161: [ // Arbitrum
    { symbol: 'ETH', address: '0x0000000000000000000000000000000000000000', name: 'Ether', decimals: 18 },
    { symbol: 'USDC', address: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831', name: 'USD Coin', decimals: 6 },
    { symbol: 'USDT', address: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9', name: 'Tether USD', decimals: 6 },
    { symbol: 'DAI', address: '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1', name: 'Dai Stablecoin', decimals: 18 },
  ]
}

const NETWORK_NAMES = {
  1: 'Ethereum',
  137: 'Polygon', 
  8453: 'Base',
  42161: 'Arbitrum'
}

interface EnhancedPaymentSelectorProps {
  splitAmount: string
  creatorAddress: string
  creatorChainId: number
  creatorTokenAddress: string
  className?: string
}

export function EnhancedPaymentSelector({
  splitAmount,
  creatorAddress, 
  creatorChainId,
  creatorTokenAddress,
  className
}: EnhancedPaymentSelectorProps) {
  const { account, getChainId, getProvider, getSigner } = usePrivyWeb3()
  const { checkAvailableRoutes, processPayment, paymentState } = useLifiPayment()
  
  // State management
  const [currentChainId, setCurrentChainId] = useState<number | null>(null)
  const [selectedNetwork, setSelectedNetwork] = useState<number | null>(null) // New: Allow network selection
  const [selectedToken, setSelectedToken] = useState<any>(null)
  const [userBalances, setUserBalances] = useState<{ [key: string]: string }>({})
  const [isLoadingBalances, setIsLoadingBalances] = useState(false)
  const [isPaymentLoading, setIsPaymentLoading] = useState(false)
  const [availableRoutes, setAvailableRoutes] = useState<any[]>([])
  const [isCheckingRoutes, setIsCheckingRoutes] = useState(false)
  const [bestRoute, setBestRoute] = useState<any>(null)

  // Load current chain ID and set as default selected network
  useEffect(() => {
    const loadChainId = async () => {
      if (account) {
        const chainId = await getChainId()
        setCurrentChainId(chainId)
        // Set current network as default selection
        if (!selectedNetwork) {
          setSelectedNetwork(chainId)
        }
      }
    }
    loadChainId()
  }, [account, getChainId, selectedNetwork])

  // Get available tokens for selected network (not just current)
  const availableTokens = useMemo(() => {
    if (!selectedNetwork || !POPULAR_TOKENS[selectedNetwork as keyof typeof POPULAR_TOKENS]) {
      return []
    }
    return POPULAR_TOKENS[selectedNetwork as keyof typeof POPULAR_TOKENS]
  }, [selectedNetwork])

  // Get all supported networks for selection
  const supportedNetworks = useMemo(() => {
    return Object.entries(NETWORK_NAMES).map(([chainId, name]) => ({
      chainId: parseInt(chainId),
      name
    }))
  }, [])

  // Load user balances for available tokens (only works for current network)
  const loadUserBalances = useCallback(async () => {
    // Only load balances if user is on the selected network
    if (!account || !selectedNetwork || !currentChainId || selectedNetwork !== currentChainId || availableTokens.length === 0) return

    setIsLoadingBalances(true)
    const provider = await getProvider()
    if (!provider) return

    const balances: { [key: string]: string } = {}

    try {
      for (const token of availableTokens) {
        if (token.address === '0x0000000000000000000000000000000000000000') {
          // Native token (ETH, MATIC, etc.)
          const balance = await provider.getBalance(account)
          balances[token.symbol] = ethers.formatUnits(balance, token.decimals)
        } else {
          // ERC20 token
          try {
            const tokenContract = new ethers.Contract(
              token.address,
              ['function balanceOf(address) view returns (uint256)', 'function decimals() view returns (uint8)'],
              provider
            )
            const balance = await tokenContract.balanceOf(account)
            balances[token.symbol] = ethers.formatUnits(balance, token.decimals)
          } catch (error) {
            console.warn(`Failed to load balance for ${token.symbol}:`, error)
            balances[token.symbol] = '0'
          }
        }
      }
      setUserBalances(balances)
    } catch (error) {
      console.error('Error loading balances:', error)
    } finally {
      setIsLoadingBalances(false)
    }
  }, [account, selectedNetwork, currentChainId, availableTokens, getProvider])

  // Load balances when dependencies change
  useEffect(() => {
    loadUserBalances()
  }, [loadUserBalances])

  // Check routes when token is selected
  const checkPaymentRoutes = useCallback(async (token: any) => {
    if (!account || !selectedNetwork) return

    setIsCheckingRoutes(true)
    try {
      // Check if it's the same token on the same chain (direct transfer)
      if (selectedNetwork === creatorChainId && 
          token.address.toLowerCase() === creatorTokenAddress.toLowerCase()) {
        // No LiFi needed - direct transfer
        setAvailableRoutes([{
          type: 'direct',
          fromToken: token,
          toToken: token,
          fromAmount: ethers.parseUnits(splitAmount, token.decimals).toString(),
          toAmount: ethers.parseUnits(splitAmount, token.decimals).toString(),
          gasCostUSD: '2', // Estimated direct transfer cost
          tool: 'Direct Transfer'
        }])
        setBestRoute({
          type: 'direct',
          fromToken: token,
          toToken: token,
          fromAmount: ethers.parseUnits(splitAmount, token.decimals).toString(),
          toAmount: ethers.parseUnits(splitAmount, token.decimals).toString(),
          gasCostUSD: '2',
          tool: 'Direct Transfer'
        })
        setIsCheckingRoutes(false)
        return
      }

      const hasRoutes = await checkAvailableRoutes({
        fromChainId: selectedNetwork, // Use selected network instead of current
        fromTokenAddress: token.address,
        fromAmount: ethers.parseUnits(splitAmount, token.decimals).toString(),
        fromAddress: account,
        toChainId: creatorChainId,
        toTokenAddress: creatorTokenAddress,
        toAddress: creatorAddress
      })

      // Get the actual routes from payment state
      if (hasRoutes && paymentState.availableRoutes) {
        setAvailableRoutes(paymentState.availableRoutes)
        // Select the best route (lowest cost)
        const best = paymentState.availableRoutes.reduce((prev: any, current: any) => 
          (parseFloat(prev.gasCostUSD || '999')) < (parseFloat(current.gasCostUSD || '999')) ? prev : current
        )
        setBestRoute(best)
      } else {
        setAvailableRoutes([])
        setBestRoute(null)
      }
    } catch (error) {
      console.error('Error checking routes:', error)
      toast.error('Failed to find payment routes')
      setAvailableRoutes([])
      setBestRoute(null)
    } finally {
      setIsCheckingRoutes(false)
    }
  }, [account, selectedNetwork, splitAmount, creatorChainId, creatorTokenAddress, creatorAddress, checkAvailableRoutes, paymentState.availableRoutes])

  // Handle network selection
  const handleNetworkSelect = (networkId: string) => {
    const chainId = parseInt(networkId)
    setSelectedNetwork(chainId)
    // Reset token selection when network changes
    setSelectedToken(null)
    setBestRoute(null)
    setAvailableRoutes([])
    // TODO: Could also switch wallet network if user wants
  }

  // Handle token selection
  const handleTokenSelect = (tokenSymbol: string) => {
    const token = availableTokens.find(t => t.symbol === tokenSymbol)
    if (token) {
      setSelectedToken(token)
      checkPaymentRoutes(token)
    }
  }

  // Execute payment
  const handlePayment = async () => {
    if (!selectedToken || !bestRoute || !account || !selectedNetwork) return

    console.log('=== Starting Payment Process ===')
    console.log('Selected token:', selectedToken)
    console.log('Best route:', bestRoute)
    console.log('Account:', account)
    console.log('Selected network:', selectedNetwork)
    console.log('Current chain ID:', currentChainId)

    setIsPaymentLoading(true)

    try {
      // Check if user needs to switch networks first
      if (currentChainId !== selectedNetwork) {
        toast.error(`Please switch your wallet to ${NETWORK_NAMES[selectedNetwork as keyof typeof NETWORK_NAMES]} network first`)
        return
      }

      console.log('Network validation passed')

      // Handle direct transfers (same token, same chain)
      if (bestRoute.type === 'direct') {
        console.log('Executing direct transfer')
        await handleDirectTransfer()
        return
      }

      console.log('Executing cross-chain payment via LiFi')
      // Handle cross-chain/cross-token transfers via LiFi  
      await processPayment({
        fromChainId: selectedNetwork,
        fromTokenAddress: selectedToken.address,
        fromAmount: ethers.parseUnits(splitAmount, selectedToken.decimals).toString(),
        fromAddress: account,
        toChainId: creatorChainId,
        toTokenAddress: creatorTokenAddress,
        toAddress: creatorAddress
      })
      
      toast.success('Payment sent successfully!')
    } catch (error: any) {
      console.error('Payment failed:', error)
      toast.error(error.message || 'Payment failed')
    } finally {
      setIsPaymentLoading(false)
    }
  }

  // Handle direct ERC20 transfers (same chain, same token)
  const handleDirectTransfer = async () => {
    if (!selectedToken || !account) return

    try {
      console.log('Starting direct transfer...')
      console.log('Selected token:', selectedToken)
      console.log('Creator address:', creatorAddress)
      console.log('Split amount:', splitAmount)

      const provider = await getProvider()
      const signer = await getSigner()
      
      if (!provider || !signer) {
        throw new Error('Could not get provider or signer. Please make sure your wallet is connected.')
      }

      console.log('Provider and signer obtained successfully')

      const amount = ethers.parseUnits(splitAmount, selectedToken.decimals)
      console.log('Parsed amount:', amount.toString())

      let txHash = ''

      if (selectedToken.address === '0x0000000000000000000000000000000000000000') {
        // Native token transfer (ETH, MATIC, etc.)
        console.log('Sending native token transfer...')
        
        const tx = await signer.sendTransaction({
          to: creatorAddress,
          value: amount
        })
        
        console.log('Transaction sent, waiting for confirmation...')
        await tx.wait() // Wait for transaction confirmation
        
        txHash = tx.hash
        toast.success(`Payment confirmed! TX: ${tx.hash.slice(0, 10)}...`)
        console.log('Native token transfer confirmed:', tx.hash)
      } else {
        // ERC20 token transfer
        console.log('Sending ERC20 token transfer...')
        
        const tokenContract = new ethers.Contract(
          selectedToken.address,
          ['function transfer(address to, uint256 amount) returns (bool)'],
          signer
        )
        
        const tx = await tokenContract.transfer(creatorAddress, amount)
        console.log('Transaction sent, waiting for confirmation...')
        await tx.wait() // Wait for transaction confirmation
        
        txHash = tx.hash
        toast.success(`Payment confirmed! TX: ${tx.hash.slice(0, 10)}...`)
        console.log('ERC20 transfer confirmed:', tx.hash)
      }

      // TODO: Call backend to mark participant as paid
      // This would integrate with the split's join API to mark payment complete
      console.log('Payment completed with transaction:', txHash)
      
    } catch (error: any) {
      console.error('Direct transfer failed:', error)
      if (error.code === 'ACTION_REJECTED') {
        toast.error('Transaction was cancelled by user')
      } else if (error.code === 'INSUFFICIENT_FUNDS') {
        toast.error('Insufficient funds for this transaction')
      } else {
        toast.error(`Payment failed: ${error.message || 'Unknown error'}`)
      }
      throw error
    }
  }

  if (!account) {
    return (
      <Card className={className}>
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">Connect your wallet to see payment options</p>
        </CardContent>
      </Card>
    )
  }

  if (!currentChainId || availableTokens.length === 0) {
    return (
      <Card className={className}>
        <CardContent className="p-6 text-center">
          <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
          <p className="text-muted-foreground">Loading payment options...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Coins className="h-5 w-5" />
          Choose Payment Network & Token
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Pay ${splitAmount} from any supported network to {NETWORK_NAMES[creatorChainId as keyof typeof NETWORK_NAMES]}
          {/* Show what the receiver will get */}
          <br />
          <span className="text-green-600 font-medium">
            Receiver gets their preferred token automatically via cross-chain routing
          </span>
        </p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Network Selection */}
        <div className="space-y-3">
          <label className="text-sm font-medium">Select network to pay from:</label>
          <Select 
            value={selectedNetwork?.toString()} 
            onValueChange={handleNetworkSelect}
          >
            <SelectTrigger>
              <SelectValue placeholder="Choose a network..." />
            </SelectTrigger>
            <SelectContent>
              {supportedNetworks.map((network) => (
                <SelectItem key={network.chainId} value={network.chainId.toString()}>
                  <div className="flex items-center space-x-2">
                    <span>{network.name}</span>
                    {network.chainId === currentChainId && (
                      <Badge variant="secondary" className="text-xs">Current</Badge>
                    )}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {selectedNetwork && selectedNetwork !== currentChainId && (
            <div className="text-sm text-amber-600 bg-amber-50 p-3 rounded-lg border border-amber-200">
              💡 <strong>Network Switch Required:</strong> You'll need to switch your wallet to {NETWORK_NAMES[selectedNetwork as keyof typeof NETWORK_NAMES]} to see balances and complete the payment.
            </div>
          )}
        </div>

        {/* Token Selection */}
        <div className="space-y-3">
          <label className="text-sm font-medium">Select token to pay with:</label>
          <Select 
            onValueChange={handleTokenSelect}
            disabled={!selectedNetwork}
          >
            <SelectTrigger>
              <SelectValue placeholder={selectedNetwork ? "Choose a token..." : "Select network first"} />
            </SelectTrigger>
            <SelectContent>
              {availableTokens.map((token) => (
                <SelectItem key={token.symbol} value={token.symbol}>
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{token.symbol}</span>
                      <span className="text-muted-foreground">{token.name}</span>
                    </div>
                    <div className="text-right">
                      {isLoadingBalances ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Badge variant="outline">
                          {parseFloat(userBalances[token.symbol] || '0').toFixed(4)}
                        </Badge>
                      )}
                    </div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Route Information */}
        {selectedToken && (
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div className="flex items-center gap-2">
                <span className="font-medium">{selectedToken.symbol}</span>
                <ArrowRight className="h-4 w-4" />
                <span className="font-medium">
                  Creator's preferred token
                </span>
              </div>
              <Badge variant="secondary">
                {NETWORK_NAMES[selectedNetwork as keyof typeof NETWORK_NAMES]} → {NETWORK_NAMES[creatorChainId as keyof typeof NETWORK_NAMES]}
              </Badge>
            </div>

            {isCheckingRoutes && (
              <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm">Finding best payment route...</span>
              </div>
            )}

            {bestRoute && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-green-800">Best Route Found</span>
                </div>
                <div className="text-xs text-green-700 space-y-1">
                  <p>via {bestRoute.toolDetails?.name || bestRoute.tool}</p>
                  <p>Gas cost: ~${bestRoute.gasCostUSD}</p>
                  <p>Estimated time: {bestRoute.estimatedDuration}s</p>
                </div>
              </div>
            )}

            {/* Payment Button */}
            {currentChainId !== selectedNetwork ? (
              <div className="space-y-3">
                <div className="text-sm text-amber-600 bg-amber-50 p-3 rounded-lg border border-amber-200">
                  ⚠️ <strong>Network Switch Required:</strong> Switch your wallet to {NETWORK_NAMES[selectedNetwork as keyof typeof NETWORK_NAMES]} to complete the payment.
                </div>
                <Button 
                  onClick={handlePayment}
                  disabled={true}
                  className="w-full"
                >
                  Switch to {NETWORK_NAMES[selectedNetwork as keyof typeof NETWORK_NAMES]} First
                </Button>
              </div>
            ) : (
              <Button 
                onClick={handlePayment}
                disabled={!bestRoute || paymentState.isLoading || isCheckingRoutes || isPaymentLoading}
                className="w-full"
              >
                {paymentState.isLoading || isPaymentLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Processing Payment...
                  </>
                ) : (
                  `Pay ${splitAmount} ${selectedToken.symbol}`
                )}
              </Button>
            )}
          </div>
        )}

        {/* Balance Warning */}
        {selectedToken && userBalances[selectedToken.symbol] && 
         parseFloat(userBalances[selectedToken.symbol]) < parseFloat(splitAmount) && (
          <div className="flex items-center gap-2 p-3 bg-orange-50 border border-orange-200 rounded-lg">
            <AlertTriangle className="h-4 w-4 text-orange-600" />
            <span className="text-sm text-orange-800">
              Insufficient balance. You have {parseFloat(userBalances[selectedToken.symbol]).toFixed(4)} {selectedToken.symbol}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
