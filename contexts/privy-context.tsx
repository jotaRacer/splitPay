"use client"

import { createContext, useContext, ReactNode } from 'react'
import { PrivyProvider, usePrivy, useWallets } from '@privy-io/react-auth'
import { ethers } from 'ethers'

interface PrivyWeb3ContextType {
  account: string | null
  isConnected: boolean
  connect: () => void
  disconnect: () => void
  isLoading: boolean
  user: any
  getProvider: () => Promise<ethers.BrowserProvider | null>
  getSigner: () => Promise<ethers.Signer | null>
  getBalance: () => Promise<string | null>
  getChainId: () => Promise<number | null>
}

const PrivyWeb3Context = createContext<PrivyWeb3ContextType | null>(null)

// Inner component that uses Privy hooks
function PrivyWeb3ProviderInner({ children }: { children: ReactNode }) {
  const { login, logout, authenticated, user, ready } = usePrivy()
  const { wallets } = useWallets()

  // Get the connected wallet
  const wallet = wallets[0] // First connected wallet
  
  // Create Web3 provider from Privy wallet
  const getProvider = async () => {
    if (!wallet) return null
    try {
      const provider = await wallet.getEthereumProvider()
      return new ethers.BrowserProvider(provider)
    } catch (error) {
      console.error('Failed to get provider:', error)
      return null
    }
  }

  const getSigner = async () => {
    const provider = await getProvider()
    if (!provider) return null
    try {
      return await provider.getSigner()
    } catch (error) {
      console.error('Failed to get signer:', error)
      return null
    }
  }

  const getBalance = async () => {
    const provider = await getProvider()
    if (!provider || !wallet?.address) return null
    try {
      const balance = await provider.getBalance(wallet.address)
      return ethers.formatEther(balance)
    } catch (error) {
      console.error('Failed to get balance:', error)
      return null
    }
  }

  const getChainId = async () => {
    const provider = await getProvider()
    if (!provider) return null
    try {
      const network = await provider.getNetwork()
      return Number(network.chainId)
    } catch (error) {
      console.error('Failed to get chain ID:', error)
      return null
    }
  }

  // Create context value with async getters
  const contextValue: PrivyWeb3ContextType = {
    account: wallet?.address || null,
    isConnected: authenticated && !!wallet,
    connect: login,
    disconnect: logout,
    isLoading: !ready,
    user,
    getProvider,
    getSigner,
    getBalance,
    getChainId,
  }

  return (
    <PrivyWeb3Context.Provider value={contextValue}>
      {children}
    </PrivyWeb3Context.Provider>
  )
}

// Main provider component - Configuración mínima
export function PrivyWeb3Provider({ children }: { children: ReactNode }) {
  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID || "your-privy-app-id"}
      config={{
        // Login methods - Solo los esenciales
        loginMethods: ['wallet'],
        // Appearance mínima
        appearance: {
          theme: 'light',
          accentColor: '#676FFF',
        },
        // Configuración mínima
        embeddedWallets: {
          createOnLogin: 'users-without-wallets'
        }
      }}
    >
      <PrivyWeb3ProviderInner>
        {children}
      </PrivyWeb3ProviderInner>
    </PrivyProvider>
  )
}

export function usePrivyWeb3() {
  const context = useContext(PrivyWeb3Context)
  if (!context) {
    throw new Error('usePrivyWeb3 must be used within a PrivyWeb3Provider')
  }
  return context
}
