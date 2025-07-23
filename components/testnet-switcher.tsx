"use client"

import { useState } from 'react'
import { usePrivyWeb3 } from '@/contexts/privy-context'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Zap, Network, ExternalLink } from 'lucide-react'
import { getTestnets, getNetworkByChainId } from '@/lib/networks'
import { toast } from 'sonner'

export function TestnetSwitcher() {
  const { chainId, switchNetwork, isConnected } = usePrivyWeb3()
  const [switching, setSwitching] = useState<number | null>(null)
  
  const testnets = getTestnets()
  const currentNetwork = chainId ? getNetworkByChainId(chainId) : null

  const handleSwitchNetwork = async (targetChainId: number) => {
    if (!isConnected || !chainId) {
      toast.error('Conecta tu wallet primero')
      return
    }

    setSwitching(targetChainId)
    try {
      toast.info('Cambiando de red... Por favor confirma en tu wallet')
      await switchNetwork(targetChainId)
      toast.success('Red cambiada exitosamente')
    } catch (error: any) {
      console.error('Error switching network:', error)
      
      // Show user-friendly error messages
      if (error.message.includes('User rejected')) {
        toast.error('Cambio de red cancelado por el usuario')
      } else if (error.message.includes('not supported')) {
        toast.error('Red no soportada')
      } else if (error.message.includes('No wallet detected')) {
        toast.error('No se detectó wallet. Instala MetaMask.')
      } else {
        toast.error(error.message || 'Error al cambiar de red')
      }
    } finally {
      setSwitching(null)
    }
  }

  const getNetworkStatus = (networkChainId: number) => {
    if (!chainId) return 'disconnected'
    if (chainId === networkChainId) return 'active'
    return 'available'
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200'
      case 'available': return 'bg-gray-100 text-gray-800 border-gray-200'
      case 'disconnected': return 'bg-gray-50 text-gray-500 border-gray-100'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Network className="h-5 w-5 text-blue-600" />
          <CardTitle className="text-lg">Testnets Disponibles</CardTitle>
        </div>
        <CardDescription>
          Cambia entre diferentes redes de prueba para testing
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="grid gap-3">
          {Object.entries(testnets).map(([key, network]) => {
            const status = getNetworkStatus(network.chainId)
            const isActive = status === 'active'
            const isSwitching = switching === network.chainId

            return (
              <div
                key={key}
                className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
                  isActive ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                }`}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-sm">{network.name}</h4>
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${getStatusColor(status)}`}
                    >
                      {isActive ? 'Conectado' : 'Disponible'}
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground space-y-1">
                    <p>Chain ID: {network.chainId}</p>
                    <p>Token: {network.nativeCurrency.symbol}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {network.blockExplorer && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => window.open(network.blockExplorer, '_blank')}
                      className="h-8 w-8 p-0"
                      title="Ver explorador"
                    >
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                  )}
                  
                  {!isActive && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSwitchNetwork(network.chainId)}
                      disabled={isSwitching || !isConnected}
                      className={`text-xs transition-all ${
                        isSwitching ? 'opacity-50' : 'hover:bg-blue-50 hover:border-blue-300'
                      }`}
                    >
                      {isSwitching ? (
                        <>
                          <Zap className="h-3 w-3 mr-1 animate-spin" />
                          Cambiando...
                        </>
                      ) : (
                        <>
                          <Zap className="h-3 w-3 mr-1" />
                          Conectar
                        </>
                      )}
                    </Button>
                  )}

                  {isActive && (
                    <Badge className="bg-green-100 text-green-800 border-green-200">
                      ✓ Activo
                    </Badge>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {!isConnected && (
          <p className="text-sm text-muted-foreground text-center mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
            Conecta tu wallet primero para cambiar de red
          </p>
        )}

        {currentNetwork && !currentNetwork.isTestnet && (
          <p className="text-sm text-blue-600 text-center mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            Actualmente estás en {currentNetwork.name} (Mainnet). 
            Cambia a una testnet para desarrollo seguro.
          </p>
        )}
      </CardContent>
    </Card>
  )
}
