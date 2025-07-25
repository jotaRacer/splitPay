"use client"

import { useState, useCallback } from 'react'
import { ethers } from 'ethers'

export interface PaymentRequestParams {
  to: string
  value: string // Amount in ETH/MATIC (not wei)
  chainId: number
  tokenAddress?: string // Optional ERC-20 token address
  memo?: string // Optional memo/note
}

export interface PaymentRequestState {
  isLoading: boolean
  error: string | null
  paymentUrl: string | null
  isSupported: boolean
}

export function usePaymentRequest() {
  const [state, setState] = useState<PaymentRequestState>({
    isLoading: false,
    error: null,
    paymentUrl: null,
    isSupported: false
  })

  // Verificar si el navegador soporta peticiones de pago
  const checkPaymentSupport = useCallback(() => {
    const isSupported = 'ethereum' in window || 'web3' in window
    setState(prev => ({ ...prev, isSupported }))
    return isSupported
  }, [])

  // Generar URL de pago según el estándar EIP-681
  const generatePaymentUrl = useCallback((params: PaymentRequestParams): string => {
    const { to, value, chainId, tokenAddress, memo } = params
    
    // Convertir el valor a wei
    const valueWei = ethers.parseEther(value).toString()
    
    // Construir la URL base
    let paymentUrl = `ethereum:${to}`
    
    // Agregar parámetros
    const urlParams = new URLSearchParams()
    
    if (valueWei !== '0') {
      urlParams.append('value', valueWei)
    }
    
    if (chainId !== 1) { // 1 es Ethereum mainnet por defecto
      urlParams.append('chainId', chainId.toString())
    }
    
    if (tokenAddress && tokenAddress !== ethers.ZeroAddress) {
      urlParams.append('token', tokenAddress)
    }
    
    if (memo) {
      urlParams.append('memo', memo)
    }
    
    // Agregar parámetros a la URL si existen
    if (urlParams.toString()) {
      paymentUrl += `?${urlParams.toString()}`
    }
    
    return paymentUrl
  }, [])

  // Crear petición de pago
  const createPaymentRequest = useCallback(async (params: PaymentRequestParams) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }))

    try {
      // Verificar soporte
      if (!checkPaymentSupport()) {
        throw new Error('Tu navegador no soporta peticiones de pago Ethereum')
      }

      // Generar URL de pago
      const paymentUrl = generatePaymentUrl(params)
      
      setState(prev => ({
        ...prev,
        isLoading: false,
        paymentUrl,
        error: null
      }))

      return paymentUrl
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error.message || 'Error al generar petición de pago'
      }))
      throw error
    }
  }, [checkPaymentSupport, generatePaymentUrl])

  // Ejecutar petición de pago (abrir wallet)
  const executePaymentRequest = useCallback(async (params: PaymentRequestParams) => {
    try {
      const paymentUrl = await createPaymentRequest(params)
      
      // Intentar abrir la wallet automáticamente
      if (window.ethereum) {
        // Para MetaMask y wallets compatibles
        const accounts = await (window.ethereum as any).request({ 
          method: 'eth_requestAccounts' 
        })
        
        if (accounts.length > 0) {
          // La wallet ya está conectada, mostrar la petición
          window.location.href = paymentUrl
        }
      } else {
        // Fallback: abrir URL directamente
        window.location.href = paymentUrl
      }
      
      return paymentUrl
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        error: error.message || 'Error al ejecutar petición de pago'
      }))
      throw error
    }
  }, [createPaymentRequest])

  // Limpiar estado
  const clearState = useCallback(() => {
    setState({
      isLoading: false,
      error: null,
      paymentUrl: null,
      isSupported: false
    })
  }, [])

  return {
    createPaymentRequest,
    executePaymentRequest,
    generatePaymentUrl,
    checkPaymentSupport,
    clearState,
    state
  }
} 