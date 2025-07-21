"use client"

import { usePrivyWeb3 } from '@/contexts/privy-context'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { SUPPORTED_NETWORKS } from '@/lib/networks'
import { Wallet, ExternalLink, RefreshCw, Mail, User } from 'lucide-react'
import { useState, useEffect } from 'react'

export function PrivyWalletConnect() {
  const { 
    account, 
    isConnected, 
    connect, 
    disconnect, 
    switchNetwork, 
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

  // Load wallet data when connected
  useEffect(() => {
    if (isConnected && account) {
      loadWalletData()
    }
  }, [isConnected, account])

  const loadWalletData = async () => {
    if (!isConnected) return
    
    setIsLoadingData(true)
    try {
      const [balanceResult, chainIdResult] = await Promise.all([
        getBalance(),
        getChainId()
      ])
      setBalance(balanceResult)
      setChainId(chainIdResult)
    } catch (error) {
      console.error('Failed to load wallet data:', error)
    } finally {
      setIsLoadingData(false)
    }
  }

  const currentNetwork = Object.values(SUPPORTED_NETWORKS).find(n => n.chainId === chainId)

  const handleNetworkSwitch = async () => {
    await switchNetwork(SUPPORTED_NETWORKS.mantle.chainId)
    // Reload data after network switch
    setTimeout(loadWalletData, 1000)
  }

  const formatBalance = (balance: string | null) => {
    if (!balance) return '0'
    return parseFloat(balance).toFixed(4)
  }

  const getUserDisplayInfo = () => {
    if (user?.email?.address) {
      return {
        type: 'email',
        value: user.email.address,
        icon: Mail
      }
    }
    if (user?.google?.email) {
      return {
        type: 'google',
        value: user.google.email,
        icon: User
      }
    }
    if (user?.twitter?.username) {
      return {
        type: 'twitter', 
        value: `@${user.twitter.username}`,
        icon: User
      }
    }
    return {
      type: 'wallet',
      value: account,
      icon: Wallet
    }
  }

  if (!isConnected) {
    return (
      <Card className="border-2">
        <CardContent className="p-4 sm:p-6 text-center">
          <div className="flex flex-col items-center space-y-4">
            <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
              <Wallet className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Connect to Continue</h3>
              <p className="text-sm text-muted-foreground">
                Connect with wallet, email, or social account
              </p>
            </div>
            <Button 
              onClick={connect} 
              disabled={isLoading}
              className="w-full sm:w-auto"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <Wallet className="mr-2 h-4 w-4" />
                  Connect Account
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  const userInfo = getUserDisplayInfo()
  const Icon = userInfo.icon

  return (
    <Card className="border-2">
      <CardContent className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
              <Icon className="h-5 w-5 text-green-600" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {userInfo.type === 'wallet' 
                    ? `${userInfo.value?.slice(0, 6)}...${userInfo.value?.slice(-4)}`
                    : userInfo.value
                  }
                </p>
                <Badge variant="secondary" className="text-xs">
                  {userInfo.type}
                </Badge>
              </div>
              {currentNetwork ? (
                <div className="flex items-center space-x-2 mt-1">
                  <Badge 
                    variant={currentNetwork.chainId === SUPPORTED_NETWORKS.mantle.chainId ? "default" : "destructive"}
                    className="text-xs"
                  >
                    {currentNetwork.name}
                  </Badge>
                  {balance && (
                    <span className="text-xs text-muted-foreground">
                      {formatBalance(balance)} {currentNetwork.nativeCurrency.symbol}
                    </span>
                  )}
                  {isLoadingData && (
                    <RefreshCw className="h-3 w-3 animate-spin text-muted-foreground" />
                  )}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground">Loading network...</p>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {currentNetwork && currentNetwork.chainId !== SUPPORTED_NETWORKS.mantle.chainId && (
              <Button 
                onClick={handleNetworkSwitch}
                variant="outline" 
                size="sm"
                className="text-xs"
              >
                Switch to Mantle
              </Button>
            )}
            
            {currentNetwork?.blockExplorer && account && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.open(`${currentNetwork.blockExplorer}/address/${account}`, '_blank')}
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
            )}
            
            <Button 
              onClick={disconnect}
              variant="outline" 
              size="sm"
            >
              Disconnect
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
