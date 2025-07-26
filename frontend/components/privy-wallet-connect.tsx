"use client"

import React, { memo, useMemo } from 'react'
import { usePrivyWeb3 } from '@/contexts/privy-context'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { SUPPORTED_NETWORKS } from '@/lib/networks'
import { Wallet, ExternalLink, RefreshCw, Mail, User } from 'lucide-react'
import { useState, useEffect, useCallback } from 'react'

export const PrivyWalletConnect = memo(function PrivyWalletConnect() {
  const { 
    account, 
    isConnected, 
    connect, 
    disconnect, 
    isLoading,
    user,
    getProvider,
    getSigner,
    getBalance,
    getChainId
  } = usePrivyWeb3() as any

  const [balance, setBalance] = useState<string | null>(null)
  const [chainId, setChainId] = useState<number | null>(null)
  const [isLoadingData, setIsLoadingData] = useState(false)
  const [hasLoadedData, setHasLoadedData] = useState(false)
  const [initializationTimeout, setInitializationTimeout] = useState(false)

  // Handle initialization timeout
  useEffect(() => {
    if (isLoading) {
      const timeout = setTimeout(() => {
        setInitializationTimeout(true)
      }, 8000) // 8 seconds timeout

      return () => clearTimeout(timeout)
    } else {
      setInitializationTimeout(false)
    }
  }, [isLoading])

  // Load wallet data when connected - with debouncing
  const loadWalletData = useCallback(async () => {
    if (!isConnected || !account || isLoadingData) return
    
    setIsLoadingData(true)
    try {
      const [balanceResult, chainIdResult] = await Promise.all([
        getBalance(),
        getChainId()
      ])
      setBalance(balanceResult)
      setChainId(chainIdResult)
      setHasLoadedData(true)
    } catch (error) {
      console.error('Failed to load wallet data:', error)
    } finally {
      setIsLoadingData(false)
    }
  }, [isConnected, account, isLoadingData, getBalance, getChainId])

  // Only load data when user is connected and we haven't loaded yet
  useEffect(() => {
    if (isConnected && account && !hasLoadedData && !isLoading) {
      // Add a small delay to avoid blocking the initial render
      const timer = setTimeout(() => {
        loadWalletData()
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [isConnected, account, hasLoadedData, isLoading, loadWalletData])

  const currentNetwork = Object.values(SUPPORTED_NETWORKS).find(n => n.chainId === chainId)

  // Network switching function
  const switchNetwork = async (targetChainId: number) => {
    const provider = await getProvider()
    if (!provider) throw new Error('No provider available')
    
    try {
      await provider.send('wallet_switchEthereumChain', [
        { chainId: `0x${targetChainId.toString(16)}` }
      ])
      // Update chain ID after successful switch
      setChainId(targetChainId)
    } catch (error: any) {
      // If the chain hasn't been added to the user's wallet, add it
      if (error.code === 4902) {
        const network = Object.values(SUPPORTED_NETWORKS).find(n => n.chainId === targetChainId)
        if (network) {
          await provider.send('wallet_addEthereumChain', [{
            chainId: `0x${targetChainId.toString(16)}`,
            chainName: network.name,
            nativeCurrency: network.nativeCurrency,
            rpcUrls: [network.rpcUrl],
            blockExplorerUrls: network.blockExplorer ? [network.blockExplorer] : undefined
          }])
          setChainId(targetChainId)
        }
      } else {
        throw error
      }
    }
  }

  const handleNetworkSwitch = async () => {
    try {
      await switchNetwork(SUPPORTED_NETWORKS.mantle.chainId)
      // Reload data after network switch
      setTimeout(() => {
        setHasLoadedData(false) // Reset to trigger reload
      }, 1000)
    } catch (error: any) {
      console.error('Error switching network:', error)
      // You might want to show a toast or error message here
    }
  }

  const formatBalance = (balance: string | null) => {
    if (!balance) return '0'
    return parseFloat(balance).toFixed(4)
  }

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  if (isLoading && !initializationTimeout) {
    return (
      <Card className="border-2">
        <CardContent className="p-4 sm:p-6">
          <div className="flex items-center justify-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            <span className="text-sm text-muted-foreground">Initializing...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Show error state if initialization timed out
  if (isLoading && initializationTimeout) {
    return (
      <Card className="border-2">
        <CardContent className="p-4 sm:p-6 text-center">
          <div className="flex flex-col items-center space-y-4">
            <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
              <Wallet className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Connection Issue</h3>
              <p className="text-sm text-muted-foreground">
                Authentication system is taking longer than expected
              </p>
            </div>
            <Button 
              onClick={() => window.location.reload()} 
              variant="outline" 
              className="w-full max-w-sm"
            >
              Refresh Page
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!isConnected) {
    return (
      <Card className="border-2">
        <CardContent className="p-4 sm:p-6 text-center">
          <div className="flex flex-col items-center space-y-4">
            <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center">
              <Wallet className="h-6 w-6 text-gray-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Connect Your Account</h3>
              <p className="text-sm text-muted-foreground">
                Connect via email, social login, or crypto wallet
              </p>
            </div>
            
            {/* Enhanced connection button */}
            <div className="space-y-3 w-full max-w-sm">
              <Button onClick={connect} className="w-full">
                <div className="flex items-center justify-center space-x-2">
                  <Wallet className="h-4 w-4" />
                  <span>Connect Account</span>
                </div>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-2">
      <CardContent className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {/* User Info */}
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              {user?.email ? (
                <Mail className="h-5 w-5 text-white" />
              ) : (
                <User className="h-5 w-5 text-white" />
              )}
            </div>
            <div>
              <p className="font-medium">
                {user?.email || formatAddress(account || '')}
              </p>
              <div className="flex items-center space-x-2">
                <Badge variant="secondary" className="text-xs">
                  {currentNetwork?.name || 'Unknown Network'}
                </Badge>
                {isLoadingData && (
                  <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600"></div>
                )}
              </div>
            </div>
          </div>

          {/* Balance and Actions */}
          <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4">
            {hasLoadedData && (
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Balance</p>
                <p className="font-semibold">{formatBalance(balance)} {currentNetwork?.nativeCurrency?.symbol || 'ETH'}</p>
              </div>
            )}
            
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleNetworkSwitch}
                disabled={isLoadingData}
              >
                Switch to Mantle
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={loadWalletData}
                disabled={isLoadingData}
              >
                <RefreshCw className={`h-4 w-4 ${isLoadingData ? 'animate-spin' : ''}`} />
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={disconnect}
              >
                Disconnect
              </Button>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-4 pt-4 border-t">
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" className="text-xs">
              <ExternalLink className="h-3 w-3 mr-1" />
              View on Explorer
            </Button>
            <Button variant="outline" size="sm" className="text-xs">
              Copy Address
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}) 