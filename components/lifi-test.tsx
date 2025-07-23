"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useLifiPayment } from '@/hooks/use-lifi-payment'
import { usePrivyWeb3 } from '@/contexts/privy-context'
import { ethers } from 'ethers'
import { toast } from 'sonner'

export function LifiTest() {
  const { account, chainId, signer } = usePrivyWeb3()
  const { checkAvailableRoutes, paymentState } = useLifiPayment()
  const [isTesting, setIsTesting] = useState(false)

  const testLifiConnection = async () => {
    if (!account || !chainId || !signer) {
      toast.error('Por favor conecta tu wallet primero')
      return
    }

    setIsTesting(true)

    try {
      // Probar con una ruta simple: Polygon a Ethereum
      const testParams = {
        fromChainId: 137, // Polygon
        toChainId: 1, // Ethereum
        fromTokenAddress: '0x0000000000000000000000000000000000000000', // MATIC
        toTokenAddress: '0x0000000000000000000000000000000000000000', // ETH
        fromAmount: '1000000000000000000', // 1 MATIC (18 decimales)
        fromAddress: account,
        toAddress: account
      }

      const hasRoutes = await checkAvailableRoutes(testParams)
      
      if (hasRoutes) {
        toast.success('✅ LiFi está funcionando correctamente!')
        console.log('Rutas disponibles:', paymentState.availableRoutes)
        console.log('Cotización completa:', paymentState.quote)
      } else {
        toast.error('❌ No se encontraron rutas disponibles')
      }
    } catch (error: any) {
      console.error('Error al probar LiFi:', error)
      toast.error(`Error: ${error.message}`)
    } finally {
      setIsTesting(false)
    }
  }

  const formatAmount = (amount: string, decimals: number = 18) => {
    try {
      return ethers.formatUnits(amount, decimals)
    } catch {
      return amount
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>🧪 Prueba de LiFi</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-gray-600">
          <p>• API Key configurada: {process.env.NEXT_PUBLIC_LIFI_API_KEY ? '✅' : '❌'}</p>
          <p>• Wallet conectada: {account ? '✅' : '❌'}</p>
          <p>• Red actual: {chainId || 'No conectado'}</p>
        </div>

        <Button 
          onClick={testLifiConnection}
          disabled={!account || isTesting}
          className="w-full"
        >
          {isTesting ? 'Probando...' : 'Probar Conexión LiFi'}
        </Button>

        {paymentState.error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">Error: {paymentState.error}</p>
          </div>
        )}

        {paymentState.quote && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg space-y-2">
            <h4 className="font-semibold text-blue-800">📊 Cotización LiFi</h4>
            <div className="text-sm space-y-1">
              <p><strong>Herramienta:</strong> {paymentState.quote.toolDetails?.name || paymentState.quote.tool}</p>
              <p><strong>Desde:</strong> {formatAmount(paymentState.quote.action.fromAmount)} {paymentState.quote.action.fromToken.symbol}</p>
              <p><strong>Hacia:</strong> {formatAmount(paymentState.quote.estimate.toAmount)} {paymentState.quote.action.toToken.symbol}</p>
              <p><strong>Costo Gas:</strong> ${paymentState.quote.estimate.gasCosts?.[0]?.amountUSD || '0'}</p>
              <p><strong>Duración:</strong> {paymentState.quote.estimate.executionDuration}s</p>
              <p><strong>Valor USD:</strong> ${paymentState.quote.estimate.fromAmountUSD} → ${paymentState.quote.estimate.toAmountUSD}</p>
            </div>
          </div>
        )}

        {paymentState.availableRoutes && paymentState.availableRoutes.length > 0 && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-600">
              ✅ {paymentState.availableRoutes.length} rutas disponibles
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
} 