"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { useLifiPayment, PaymentParams } from '@/hooks/use-lifi-payment'
import { usePaymentRequest, PaymentRequestParams } from '@/hooks/use-payment-request'
import { usePrivyWeb3 } from '@/contexts/privy-context'
import { useNetworkValidator } from '@/components/network-validator'
import { ethers } from 'ethers'
import { Loader2, CheckCircle, XCircle, AlertTriangle, Wallet } from 'lucide-react'
import { toast } from 'sonner'
import { isTestnetChainId } from '@/lib/networks'

interface LifiPaymentButtonProps {
  splitAmount: string
  creatorAddress: string
  creatorChainId: number
  creatorTokenAddress: string
  className?: string
}

export function LifiPaymentButton({
  splitAmount,
  creatorAddress,
  creatorChainId,
  creatorTokenAddress,
  className
}: LifiPaymentButtonProps) {
  const { account, getSigner, getProvider } = usePrivyWeb3()
  const { processPayment, paymentState, clearPaymentState } = useLifiPayment()
  const { executePaymentRequest, state: paymentRequestState } = usePaymentRequest()
  const { validateAndSwitchNetwork, isNetworkSupported } = useNetworkValidator()
  const [isProcessing, setIsProcessing] = useState(false)
  const [balance, setBalance] = useState<string>('0')
  const [hasInsufficientBalance, setHasInsufficientBalance] = useState(false)
  const [currentChainId, setCurrentChainId] = useState<number | null>(null)

  // Check balance when account or chainId changes
  useEffect(() => {
    const checkBalance = async () => {
      if (!account) {
        setBalance('0')
        return
      }

      try {
        const provider = await getProvider()
        const signer = await getSigner()
        
        if (!provider || !signer) {
          setBalance('0')
          return
        }

        // Obtener chainId actual
        const network = await provider.getNetwork()
        setCurrentChainId(Number(network.chainId))

        const balanceWei = await provider.getBalance(account)
        const balanceEth = ethers.formatEther(balanceWei)
        setBalance(balanceEth)

        // Check if balance is sufficient for the transaction
        const requiredAmount = parseFloat(splitAmount)
        const currentBalance = parseFloat(balanceEth)
        setHasInsufficientBalance(currentBalance < requiredAmount)
      } catch (error) {
        console.error('Error checking balance:', error)
        setBalance('0')
      }
    }

    checkBalance()
  }, [account, getProvider, getSigner, splitAmount])

  const handlePayment = async () => {
    if (!account || !currentChainId) {
      toast.error('Por favor conecta tu wallet primero')
      return
    }

    // Check balance first
    if (hasInsufficientBalance) {
      const isTestnet = isTestnetChainId(currentChainId)
      if (isTestnet) {
        toast.error('Saldo insuficiente. Usa un faucet para obtener tokens de prueba gratuitos.')
      } else {
        toast.error('Saldo insuficiente para realizar el pago')
      }
      return
    }

    // Validate amount
    try {
      const amountWei = ethers.parseEther(splitAmount)
      if (amountWei <= 0) {
        toast.error('Monto inválido')
        return
      }
    } catch (error) {
      toast.error('Formato de monto inválido')
      return
    }

    // Validar que la red de destino sea soportada
    if (!isNetworkSupported(creatorChainId)) {
      toast.error('Red de destino no soportada por LiFi')
      return
    }

    setIsProcessing(true)
    clearPaymentState()

    try {
      // Check if it's a same-network transfer
      const isSameNetwork = currentChainId === creatorChainId
      
      if (isSameNetwork) {
        // Generar petición de pago directa en la wallet
        toast.info('Generando petición de pago en tu wallet...')
        
        const paymentRequestParams: PaymentRequestParams = {
          to: creatorAddress,
          value: splitAmount,
          chainId: currentChainId,
          memo: `Split Pay - ${splitAmount} ${getNetworkSymbol(currentChainId)}`
        }

        await executePaymentRequest(paymentRequestParams)
        toast.success('Petición de pago enviada a tu wallet!')
        setIsProcessing(false)
        return
      }

      // For cross-chain transfers, continue with Li.Fi
      // Validar y cambiar de red si es necesario
      const networkValid = await validateAndSwitchNetwork(currentChainId)
      if (!networkValid) {
        setIsProcessing(false)
        return
      }

      const paymentParams: PaymentParams = {
        fromChainId: currentChainId,
        fromTokenAddress: ethers.ZeroAddress, // Token nativo por defecto
        fromAmount: ethers.parseEther(splitAmount).toString(), // Convert to wei
        fromAddress: account,
        toChainId: creatorChainId,
        toTokenAddress: creatorTokenAddress,
        toAddress: creatorAddress
      }

      const result = await processPayment(paymentParams)
      
      toast.success(`Pago procesado exitosamente! Hash: ${result.txHash}`)
      console.log('Resultado del pago:', result)
      
    } catch (error: any) {
      console.error('Error en el pago:', error)
      toast.error(error.message || 'Error al procesar el pago')
    } finally {
      setIsProcessing(false)
    }
  }

  // Función helper para obtener el símbolo de la red
  const getNetworkSymbol = (chainId: number): string => {
    switch (chainId) {
      case 1: return 'ETH'
      case 137: return 'MATIC'
      case 8453: return 'ETH'
      case 42161: return 'ETH'
      case 5000: return 'MNT'
      default: return 'ETH'
    }
  }

  const getButtonContent = () => {
    if (paymentState.isLoading || isProcessing || paymentRequestState.isLoading) {
      return (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Procesando pago...
        </>
      )
    }

    if (paymentState.txHash) {
      return (
        <>
          <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
          Pago completado
        </>
      )
    }

    if (paymentState.error || paymentRequestState.error) {
      return (
        <>
          <XCircle className="mr-2 h-4 w-4 text-red-500" />
          Error en pago
        </>
      )
    }

    if (hasInsufficientBalance) {
      return (
        <>
          <AlertTriangle className="mr-2 h-4 w-4 text-yellow-500" />
          Saldo insuficiente
        </>
      )
    }

    // Check if same network or cross-chain
    const isSameNetwork = currentChainId === creatorChainId
    return isSameNetwork ? (
      <>
        <Wallet className="mr-2 h-4 w-4" />
        Pagar en Wallet
      </>
    ) : (
      <>
        <Wallet className="mr-2 h-4 w-4" />
        Pagar con LI.FI
      </>
    )
  }

  const getButtonVariant = () => {
    if (paymentState.txHash) return 'outline'
    if (paymentState.error || hasInsufficientBalance) return 'destructive'
    return 'default'
  }

  const isDisabled = () => {
    return !account || paymentState.isLoading || isProcessing || paymentState.isCheckingRoutes || paymentRequestState.isLoading || hasInsufficientBalance
  }

  return (
    <div className="space-y-2">
      <Button
        onClick={handlePayment}
        disabled={isDisabled()}
        variant={getButtonVariant()}
        className={className}
      >
        {getButtonContent()}
      </Button>

      {/* Balance display */}
      {account && currentChainId && (
        <div className="text-sm text-muted-foreground">
          Balance: {parseFloat(balance).toFixed(4)} {isTestnetChainId(currentChainId) ? '(Testnet)' : ''} 
          {hasInsufficientBalance && (
            <span className="text-red-600 ml-2">
              (Insuficiente - Necesitas {splitAmount})
            </span>
          )}
        </div>
      )}

      {/* Mostrar información adicional */}
      {paymentState.estimatedGas && (
        <p className="text-sm text-muted-foreground">
          Gas estimado: ${paymentState.estimatedGas}
        </p>
      )}

      {paymentState.estimatedTime && (
        <p className="text-sm text-muted-foreground">
          Tiempo estimado: {Math.round(paymentState.estimatedTime / 60)} minutos
        </p>
      )}

      {paymentState.txHash && (
        <p className="text-sm text-green-600">
          Transacción: {paymentState.txHash.slice(0, 10)}...{paymentState.txHash.slice(-8)}
        </p>
      )}

      {paymentState.error && (
        <p className="text-sm text-red-600">
          Error: {paymentState.error}
        </p>
      )}
    </div>
  )
} 