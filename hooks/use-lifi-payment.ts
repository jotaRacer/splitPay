"use client"

import { useState, useCallback, useMemo } from 'react'
import { ethers } from 'ethers'
import { usePrivyWeb3 } from '@/contexts/privy-context'
import { LIFI_CONFIG } from '@/lib/lifi-config'

export interface PaymentParams {
  fromChainId: number
  fromTokenAddress: string
  fromAmount: string
  fromAddress: string
  toChainId: number
  toTokenAddress: string
  toAddress: string
}

export interface PaymentState {
  isLoading: boolean
  isCheckingRoutes: boolean
  error: string | null
  txHash: string | null
  estimatedGas: string | null
  estimatedTime: number | null
  availableRoutes: any[] | null
  quote: any | null
}

// Tipos para la respuesta de LiFi API
interface LifiQuote {
  type: string
  id: string
  tool: string
  toolDetails: {
    key: string
    name: string
    logoURI: string
  }
  action: {
    fromToken: {
      address: string
      chainId: number
      symbol: string
      decimals: number
      name: string
      priceUSD: string
    }
    toToken: {
      address: string
      chainId: number
      symbol: string
      decimals: number
      name: string
      priceUSD: string
    }
    fromAmount: string
    toAmount: string
    fromChainId: number
    toChainId: number
    fromAddress: string
    toAddress: string
  }
  estimate: {
    toAmount: string
    toAmountMin: string
    fromAmount: string
    feeCosts: any[]
    gasCosts: any[]
    executionDuration: number
    fromAmountUSD: string
    toAmountUSD: string
  }
  transactionRequest: {
    value: string
    to: string
    data: string
    from: string
    chainId: number
    gasPrice: string
    gasLimit: string
  }
}

export function useLifiPayment() {
  const { account, getSigner, getProvider } = usePrivyWeb3()
  const [paymentState, setPaymentState] = useState<PaymentState>({
    isLoading: false,
    isCheckingRoutes: false,
    error: null,
    txHash: null,
    estimatedGas: null,
    estimatedTime: null,
    availableRoutes: null,
    quote: null
  })

  // Memoize the API key to avoid unnecessary re-renders
  const apiKey = useMemo(() => {
    // Usar la API Key del archivo de configuración o de las variables de entorno
    return process.env.NEXT_PUBLIC_LIFI_API_KEY || LIFI_CONFIG.apiKey
  }, [])

  // Obtener cotización de LiFi API - memoized to avoid unnecessary calls
  const getLifiQuote = useCallback(async (params: PaymentParams): Promise<LifiQuote> => {
    // Validar parámetros antes de hacer la petición
    if (!params.fromChainId || !params.toChainId) {
      throw new Error('Chain IDs son requeridos')
    }
    
    if (!params.fromTokenAddress || !params.toTokenAddress) {
      throw new Error('Direcciones de tokens son requeridas')
    }
    
    if (!params.fromAmount || parseFloat(params.fromAmount) <= 0) {
      throw new Error('Monto debe ser mayor a 0')
    }
    
    if (!params.fromAddress || !params.toAddress) {
      throw new Error('Direcciones de origen y destino son requeridas')
    }

    const queryParams = new URLSearchParams({
      fromChain: params.fromChainId.toString(),
      toChain: params.toChainId.toString(),
      fromToken: params.fromTokenAddress,
      toToken: params.toTokenAddress,
      fromAmount: params.fromAmount,
      fromAddress: params.fromAddress,
      toAddress: params.toAddress
    })

    const response = await fetch(`https://li.quest/v1/quote?${queryParams.toString()}`, {
      headers: {
        'Content-Type': 'application/json',
        'x-lifi-api-key': apiKey
      }
    })
    
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`)
    }

    return await response.json()
  }, [apiKey])

  // Verificar si hay rutas disponibles usando la API real
  const checkAvailableRoutes = useCallback(async (params: PaymentParams) => {
    if (!account) {
      throw new Error('Wallet no conectada')
    }

    const signer = await getSigner()
    if (!signer) {
      throw new Error('No se pudo obtener el signer')
    }

    setPaymentState(prev => ({ ...prev, isCheckingRoutes: true, error: null }))

    try {
      // Obtener cotización real de LiFi
      const quote = await getLifiQuote(params)
      
      setPaymentState(prev => ({
        ...prev,
        isCheckingRoutes: false,
        availableRoutes: [{
          id: quote.id,
          fromChain: params.fromChainId,
          toChain: params.toChainId,
          fromToken: params.fromTokenAddress,
          toToken: params.toTokenAddress,
          fromAmount: params.fromAmount,
          toAmount: quote.estimate.toAmount,
          gasCostUSD: quote.estimate.gasCosts?.[0]?.amountUSD || '0',
          estimatedDuration: quote.estimate.executionDuration,
          tool: quote.tool,
          toolDetails: quote.toolDetails
        }],
        quote: quote,
        error: null
      }))

      return true
    } catch (error: any) {
      console.error('Error al verificar rutas:', error)
      setPaymentState(prev => ({
        ...prev,
        isCheckingRoutes: false,
        error: error.message || 'Error al verificar rutas disponibles'
      }))
      return false
    }
  }, [account, getSigner, getLifiQuote])

  // Verificar saldo del usuario - memoized to avoid unnecessary calls
  const checkBalance = useCallback(async (tokenAddress: string, amount: string, chainId: number) => {
    if (!account) return false

    try {
      const signer = await getSigner()
      if (!signer) return false

      const provider = await getProvider()
      if (!provider) return false

      if (tokenAddress === ethers.ZeroAddress) {
        // Token nativo (ETH, MATIC, etc.)
        const balance = await provider.getBalance(account!)
        return balance >= ethers.parseEther(amount)
      } else {
        // Token ERC-20
        const tokenContract = new ethers.Contract(
          tokenAddress,
          ['function balanceOf(address) view returns (uint256)', 'function decimals() view returns (uint8)'],
          provider
        )
        const balance = await tokenContract.balanceOf(account!)
        const decimals = await tokenContract.decimals()
        return balance >= ethers.parseUnits(amount, decimals)
      }
    } catch (error) {
      console.error('Error al verificar saldo:', error)
      return false
    }
  }, [account, getSigner, getProvider])

  // Ejecutar el pago usando la transacción real de LiFi
  const executePayment = useCallback(async (params: PaymentParams) => {
    if (!account) {
      throw new Error('Wallet no conectada')
    }

    const signer = await getSigner()
    if (!signer) {
      throw new Error('No se pudo obtener el signer')
    }

    // Verificar que estamos en la red correcta
    const provider = await getProvider()
    if (provider) {
      const currentChainId = await provider.getNetwork().then(network => network.chainId)
      if (currentChainId !== BigInt(params.fromChainId)) {
        throw new Error(`Debes estar en la red ${params.fromChainId} para realizar este pago`)
      }
    }

    // Verificar saldo
    const hasBalance = await checkBalance(params.fromTokenAddress, params.fromAmount, params.fromChainId)
    if (!hasBalance) {
      throw new Error('Saldo insuficiente para realizar el pago')
    }

    setPaymentState(prev => ({ 
      ...prev, 
      isLoading: true, 
      error: null, 
      txHash: null 
    }))

    try {
      // Obtener cotización actualizada
      const quote = await getLifiQuote(params)
      
      setPaymentState(prev => ({
        ...prev,
        estimatedGas: quote.estimate.gasCosts?.[0]?.amountUSD || '0',
        estimatedTime: quote.estimate.executionDuration,
        quote: quote
      }))

      // Ejecutar la transacción usando los datos de LiFi
      const txRequest = quote.transactionRequest
      
      const tx = await signer.sendTransaction({
        to: txRequest.to,
        data: txRequest.data,
        value: txRequest.value,
        gasLimit: ethers.parseUnits(txRequest.gasLimit, 0),
        gasPrice: ethers.parseUnits(txRequest.gasPrice, 0)
      })

      // Esperar confirmación
      const receipt = await tx.wait()
      
      if (!receipt) {
        throw new Error('La transacción no fue confirmada')
      }
      
      setPaymentState(prev => ({
        ...prev,
        isLoading: false,
        txHash: receipt.hash
      }))

      return { txHash: receipt.hash }
    } catch (error: any) {
      console.error('Error al ejecutar pago:', error)
      setPaymentState(prev => ({
        ...prev,
        isLoading: false,
        error: error.message || 'Error al ejecutar el pago'
      }))
      throw error
    }
  }, [account, getSigner, checkBalance, getLifiQuote])

  // Función principal que combina verificación y ejecución
  const processPayment = useCallback(async (params: PaymentParams) => {
    try {
      // Primero verificar rutas disponibles
      const hasRoutes = await checkAvailableRoutes(params)
      if (!hasRoutes) {
        throw new Error('No hay rutas disponibles para este pago')
      }

      // Luego ejecutar el pago
      const result = await executePayment(params)
      return result
    } catch (error) {
      throw error
    }
  }, [checkAvailableRoutes, executePayment])

  // Limpiar estado
  const clearPaymentState = useCallback(() => {
    setPaymentState({
      isLoading: false,
      isCheckingRoutes: false,
      error: null,
      txHash: null,
      estimatedGas: null,
      estimatedTime: null,
      availableRoutes: null,
      quote: null
    })
  }, [])

  return {
    processPayment,
    checkAvailableRoutes,
    checkBalance,
    clearPaymentState,
    paymentState
  }
} 