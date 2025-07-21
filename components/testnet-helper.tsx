"use client"

import { useState } from 'react'
import { useWeb3 } from '@/contexts/web3-context'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ExternalLink, Coins, Info, Copy, CheckCircle } from 'lucide-react'
import { getNetworkByChainId, getFaucetsForChainId, isTestnetChainId } from '@/lib/networks'
import { toast } from 'sonner'

export function TestnetHelper() {
  const { chainId, account } = useWeb3()
  const [copiedAddress, setCopiedAddress] = useState(false)

  if (!chainId || !isTestnetChainId(chainId)) {
    return null // Only show on testnets
  }

  const network = getNetworkByChainId(chainId)
  const faucets = getFaucetsForChainId(chainId)

  const copyAddress = async () => {
    if (!account) return
    
    try {
      await navigator.clipboard.writeText(account)
      setCopiedAddress(true)
      toast.success('Dirección copiada al portapapeles')
      setTimeout(() => setCopiedAddress(false), 2000)
    } catch (error) {
      toast.error('Error al copiar dirección')
    }
  }

  const openFaucet = (faucetUrl: string) => {
    window.open(faucetUrl, '_blank', 'noopener,noreferrer')
  }

  return (
    <Card className="border-blue-200 bg-blue-50">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Info className="h-5 w-5 text-blue-600" />
          <CardTitle className="text-lg text-blue-800">Modo Testnet</CardTitle>
          <Badge variant="secondary" className="bg-blue-100 text-blue-700">
            {network?.name}
          </Badge>
        </div>
        <CardDescription className="text-blue-600">
          Estás en una red de prueba. Los tokens son gratuitos y no tienen valor real.
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Wallet Address */}
        {account && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-blue-800">Tu dirección de wallet:</h4>
            <div className="flex items-center gap-2 p-2 bg-white rounded border">
              <code className="text-xs flex-1 text-gray-700">
                {account.slice(0, 6)}...{account.slice(-4)}
              </code>
              <Button
                variant="ghost"
                size="sm"
                onClick={copyAddress}
                className="h-6 w-6 p-0"
              >
                {copiedAddress ? (
                  <CheckCircle className="h-3 w-3 text-green-600" />
                ) : (
                  <Copy className="h-3 w-3" />
                )}
              </Button>
            </div>
          </div>
        )}

        {/* Faucets */}
        {faucets.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-blue-800 flex items-center gap-1">
              <Coins className="h-4 w-4" />
              Obtener tokens de prueba gratis:
            </h4>
            <div className="space-y-2">
              {faucets.map((faucetUrl, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => openFaucet(faucetUrl)}
                  className="w-full justify-between text-left"
                >
                  <span>Faucet {index + 1}</span>
                  <ExternalLink className="h-3 w-3" />
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Instructions */}
        <Alert>
          <AlertDescription className="text-sm">
            <strong>Instrucciones:</strong>
            <ol className="mt-1 ml-4 list-decimal space-y-1">
              <li>Copia tu dirección de wallet</li>
              <li>Visita uno de los faucets de arriba</li>
              <li>Pega tu dirección y solicita tokens</li>
              <li>Espera unos minutos para recibir los tokens</li>
              <li>¡Ya puedes probar pagos sin costo!</li>
            </ol>
          </AlertDescription>
        </Alert>

        {/* Network Info */}
        <div className="text-xs text-blue-600 space-y-1">
          <p><strong>Chain ID:</strong> {chainId}</p>
          <p><strong>Símbolo:</strong> {network?.nativeCurrency.symbol}</p>
          {network?.blockExplorer && (
            <p>
              <strong>Explorer:</strong>{' '}
              <a 
                href={network.blockExplorer} 
                target="_blank" 
                rel="noopener noreferrer"
                className="underline hover:text-blue-800"
              >
                Ver transacciones
              </a>
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
