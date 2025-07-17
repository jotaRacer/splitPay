"use client"

import { useWeb3 } from '@/contexts/web3-context'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { SUPPORTED_NETWORKS } from '@/lib/networks'
import { Wallet, ExternalLink, RefreshCw } from 'lucide-react'

export function WalletConnect() {
  const { 
    account, 
    isConnected, 
    chainId, 
    balance, 
    connect, 
    disconnect, 
    switchNetwork, 
    isLoading 
  } = useWeb3()

  const currentNetwork = Object.values(SUPPORTED_NETWORKS).find(n => n.chainId === chainId)

  const handleNetworkSwitch = async () => {
    await switchNetwork(SUPPORTED_NETWORKS.mantle.chainId)
  }

  const formatBalance = (balance: string | null) => {
    if (!balance) return '0'
    return parseFloat(balance).toFixed(4)
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
              <h3 className="text-lg font-semibold">Connect Your Wallet</h3>
              <p className="text-sm text-muted-foreground">
                Connect your wallet to start splitting payments
              </p>
            </div>
            <Button 
              onClick={connect} 
              disabled={isLoading}
              className="w-full sm:w-auto"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Connecting...
                </>
              ) : (
                'Connect Wallet'
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-2">
      <CardContent className="p-4 sm:p-6">
        <div className="flex flex-col space-y-4">
          {/* Account Info */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                <Wallet className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium">
                  {account?.slice(0, 6)}...{account?.slice(-4)}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatBalance(balance)} {currentNetwork?.nativeCurrency.symbol}
                </p>
              </div>
            </div>
            <Button onClick={disconnect} variant="outline" size="sm">
              Disconnect
            </Button>
          </div>

          {/* Network Info */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Badge variant={currentNetwork?.name === 'Mantle' ? 'default' : 'secondary'}>
                {currentNetwork?.name || 'Unknown Network'}
              </Badge>
              {currentNetwork?.blockExplorer && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => window.open(`${currentNetwork.blockExplorer}/address/${account}`, '_blank')}
                >
                  <ExternalLink className="h-3 w-3" />
                </Button>
              )}
            </div>
            
            {currentNetwork?.name !== 'Mantle' && (
              <Button 
                onClick={handleNetworkSwitch} 
                size="sm" 
                variant="outline"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                    Switching...
                  </>
                ) : (
                  'Switch to Mantle'
                )}
              </Button>
            )}
          </div>

          {/* Warning for unsupported networks */}
          {currentNetwork?.name !== 'Mantle' && (
            <div className="text-xs text-amber-600 bg-amber-50 p-2 rounded">
              ⚠️ For optimal experience, please switch to Mantle Network
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
