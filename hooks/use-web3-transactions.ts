"use client"

import { useState } from 'react'
import { ethers } from 'ethers'
import { useWeb3 } from '@/contexts/web3-context'

export interface SplitPaymentParams {
  recipients: string[]
  amounts: string[]
  memo?: string
}

export interface Transaction {
  hash: string
  status: 'pending' | 'confirmed' | 'failed'
  timestamp: number
  amount: string
  to: string
}

export function useWeb3Transactions() {
  const { signer, account, chainId } = useWeb3()
  const [isLoading, setIsLoading] = useState(false)
  const [transactions, setTransactions] = useState<Transaction[]>([])

  const sendTransaction = async (to: string, amount: string, memo?: string) => {
    if (!signer || !account) {
      throw new Error('Wallet not connected')
    }

    setIsLoading(true)
    
    try {
      const tx = await signer.sendTransaction({
        to,
        value: ethers.parseEther(amount),
        data: memo ? ethers.hexlify(ethers.toUtf8Bytes(memo)) : undefined,
      })

      const newTransaction: Transaction = {
        hash: tx.hash,
        status: 'pending',
        timestamp: Date.now(),
        amount,
        to,
      }

      setTransactions(prev => [newTransaction, ...prev])

      // Wait for confirmation
      const receipt = await tx.wait()
      
      setTransactions(prev => 
        prev.map(transaction => 
          transaction.hash === tx.hash 
            ? { ...transaction, status: receipt?.status === 1 ? 'confirmed' : 'failed' }
            : transaction
        )
      )

      return receipt
    } catch (error) {
      console.error('Transaction failed:', error)
      setTransactions(prev => 
        prev.map(transaction => 
          transaction.hash === (error as any).hash 
            ? { ...transaction, status: 'failed' }
            : transaction
        )
      )
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const splitPayment = async ({ recipients, amounts, memo }: SplitPaymentParams) => {
    if (!signer || !account) {
      throw new Error('Wallet not connected')
    }

    if (recipients.length !== amounts.length) {
      throw new Error('Recipients and amounts arrays must have the same length')
    }

    setIsLoading(true)
    const transactions: Transaction[] = []

    try {
      // Send individual transactions to each recipient
      for (let i = 0; i < recipients.length; i++) {
        const tx = await signer.sendTransaction({
          to: recipients[i],
          value: ethers.parseEther(amounts[i]),
          data: memo ? ethers.hexlify(ethers.toUtf8Bytes(memo)) : undefined,
        })

        const newTransaction: Transaction = {
          hash: tx.hash,
          status: 'pending',
          timestamp: Date.now(),
          amount: amounts[i],
          to: recipients[i],
        }

        transactions.push(newTransaction)
        setTransactions(prev => [newTransaction, ...prev])

        // Wait for confirmation
        const receipt = await tx.wait()
        
        setTransactions(prev => 
          prev.map(transaction => 
            transaction.hash === tx.hash 
              ? { ...transaction, status: receipt?.status === 1 ? 'confirmed' : 'failed' }
              : transaction
          )
        )
      }

      return transactions
    } catch (error) {
      console.error('Split payment failed:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const getBalance = async (address?: string) => {
    if (!signer) return null
    
    try {
      const provider = signer.provider
      if (!provider) return null
      
      const balance = await provider.getBalance(address || account!)
      return ethers.formatEther(balance)
    } catch (error) {
      console.error('Failed to get balance:', error)
      return null
    }
  }

  const estimateGas = async (to: string, amount: string) => {
    if (!signer) return null

    try {
      const gasEstimate = await signer.estimateGas({
        to,
        value: ethers.parseEther(amount),
      })
      return gasEstimate.toString()
    } catch (error) {
      console.error('Failed to estimate gas:', error)
      return null
    }
  }

  return {
    sendTransaction,
    splitPayment,
    getBalance,
    estimateGas,
    transactions,
    isLoading,
  }
}
