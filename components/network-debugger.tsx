"use client"

import { useWeb3 } from '@/contexts/web3-context'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { RefreshCw, Wifi, WifiOff } from 'lucide-react'
import { getNetworkByChainId, isTestnetChainId } from '@/lib/networks'
import { useState } from 'react'

export function NetworkDebugger() {
  const { chainId, account, isConnected, provider, switchNetwork, isLoading } = useWeb3()
  const [refreshing, setRefreshing] = useState(false)
  
  const network = chainId ? getNetworkByChainId(chainId) : null
  const isTestnet = chainId ? isTestnetChainId(chainId) : false

  const refreshConnection = async () => {
    setRefreshing(true)
    try {
      if (provider) {
        const network = await provider.getNetwork()
        console.log('Current network:', network)
      }
    } catch (error) {
      console.error('Error refreshing:', error)
    } finally {
      setRefreshing(false)
    }
  }

  const testSwitchToSepolia = async () => {
    try {
      await switchNetwork(11155111) // Sepolia testnet
    } catch (error) {
      console.error('Test switch failed:', error)
    }
  }

  return (
    <Card className="border-orange-200 bg-orange-50">
      <CardHeader>
        <CardTitle className="text-sm flex items-center gap-2">
          <RefreshCw className="h-4 w-4" />
          Network Debug Info
        </CardTitle>
        <CardDescription className="text-xs">
          Debug information for network switching testing
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <strong>Connected:</strong>
            <div className="flex items-center gap-1">
              {isConnected ? <Wifi className="h-3 w-3 text-green-600" /> : <WifiOff className="h-3 w-3 text-red-600" />}
              <span>{isConnected ? 'Yes' : 'No'}</span>
            </div>
          </div>
          
          <div>
            <strong>Loading:</strong> {isLoading ? 'Yes' : 'No'}
          </div>
          
          <div>
            <strong>Chain ID:</strong> {chainId || 'None'}
          </div>
          
          <div>
            <strong>Network:</strong> {network?.name || 'Unknown'}
          </div>
          
          <div>
            <strong>Type:</strong>
            {chainId && (
              <Badge variant="outline" className={`ml-1 text-xs ${isTestnet ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}>
                {isTestnet ? 'Testnet' : 'Mainnet'}
              </Badge>
            )}
          </div>
          
          <div>
            <strong>Account:</strong> 
            <div className="text-xs text-muted-foreground">
              {account ? `${account.slice(0, 6)}...${account.slice(-4)}` : 'None'}
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={refreshConnection}
            disabled={refreshing}
            className="text-xs"
          >
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </Button>
          
          {isConnected && (
            <Button
              variant="outline"
              size="sm"
              onClick={testSwitchToSepolia}
              className="text-xs"
            >
              Test Switch to Sepolia
            </Button>
          )}
        </div>

        {chainId && (
          <div className="text-xs text-muted-foreground p-2 bg-white rounded border">
            <strong>Raw Chain ID:</strong> {chainId}<br />
            <strong>Hex:</strong> 0x{chainId.toString(16)}<br />
            <strong>Provider:</strong> {provider ? 'Available' : 'None'}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
