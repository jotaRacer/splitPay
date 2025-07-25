"use client"

import { useState, useCallback } from 'react'
import { ethers } from 'ethers'
import { useWeb3 } from '@/contexts/web3-context'

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
}

export function useLifiPayment() {
  const { signer, account, chainId } = useWeb3()
  const [paymentState, setPaymentState] = useState<PaymentState>({
    isLoading: false,
    isCheckingRoutes: false,
    error: null,
    txHash: null,
    estimatedGas: null,
    estimatedTime: null,
    availableRoutes: null
  })

  // Verificar si hay rutas disponibles (simulado)
  const checkAvailableRoutes = useCallback(async (params: PaymentParams) => {
    if (!signer) {
      throw new Error('Wallet no conectada')
    }

    setPaymentState(prev => ({ ...prev, isCheckingRoutes: true, error: null }))

    try {
      // Simular verificación de rutas
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Simular rutas disponibles
      const mockRoutes = [{
        id: 'mock-route-1',
        gasCostUSD: '5.00',
        estimatedDuration: 300000 // 5 minutos
      }]

      setPaymentState(prev => ({
        ...prev,
        isCheckingRoutes: false,
        availableRoutes: mockRoutes,
        error: null
      }))

      return true
    } catch (error) {
      console.error('Error al verificar rutas:', error)
      setPaymentState(prev => ({
        ...prev,
        isCheckingRoutes: false,
        error: 'Error al verificar rutas disponibles'
      }))
      return false
    }
  }, [signer])

  // Verificar saldo del usuario
  const checkBalance = useCallback(async (tokenAddress: string, amount: string, chainId: number) => {
    if (!signer) return false

    try {
      const provider = signer.provider
      if (!provider) return false

      if (tokenAddress === ethers.ZeroAddress) {
        // Token nativo (ETH, MATIC, etc.)
        const balance = await provider.getBalance(account!)
        return balance >= ethers.parseEther(amount)
      } else {
        // Token ERC-20
        const tokenContract = new ethers.Contract(
          tokenAddress,
          ['function balanceOf(address) view returns (uint256)'],
          provider
        )
        const balance = await tokenContract.balanceOf(account!)
        return balance >= ethers.parseUnits(amount, 18) // Asumiendo 18 decimales
      }
    } catch (error) {
      console.error('Error al verificar saldo:', error)
      return false
    }
  }, [signer, account])

  // Ejecutar el pago (simulado)
  const executePayment = useCallback(async (params: PaymentParams) => {
    if (!signer) {
      throw new Error('Wallet no conectada')
    }

    // Verificar que estamos en la red correcta
    if (chainId !== params.fromChainId) {
      throw new Error(`Debes estar en la red ${params.fromChainId} para realizar este pago`)
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
      // Simular transacción
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Generar hash simulado
      const mockTxHash = '0x' + Math.random().toString(16).substring(2, 66)

      setPaymentState(prev => ({
        ...prev,
        isLoading: false,
        txHash: mockTxHash,
        estimatedGas: '5.00',
        estimatedTime: 300000
      }))

      return { txHash: mockTxHash }
    } catch (error: any) {
      console.error('Error al ejecutar pago:', error)
      setPaymentState(prev => ({
        ...prev,
        isLoading: false,
        error: error.message || 'Error al ejecutar el pago'
      }))
      throw error
    }
  }, [signer, chainId, checkBalance])

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
      availableRoutes: null
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