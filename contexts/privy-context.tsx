"use client"

import { createContext, useContext, ReactNode, useEffect, useState } from 'react'
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
  const [forceReady, setForceReady] = useState(false)

  // Debug logging
  useEffect(() => {
    console.log('Privy state:', { ready, authenticated, user: !!user, wallets: wallets.length })
  }, [ready, authenticated, user, wallets])

  // Force ready state after timeout to prevent infinite loading
  useEffect(() => {
    if (!ready) {
      const timeout = setTimeout(() => {
        console.warn('Privy initialization timeout - forcing ready state')
        setForceReady(true)
      }, 10000) // 10 seconds timeout

      return () => clearTimeout(timeout)
    } else {
      setForceReady(false)
    }
  }, [ready])

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
    isLoading: !ready && !forceReady,
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

// Main provider component - Enhanced with social login
export function PrivyWeb3Provider({ children }: { children: ReactNode }) {
  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID || "your-privy-app-id"}
      config={{
        // Login methods - Enable social login options
        loginMethods: ['wallet', 'email', 'google', 'twitter'],
        // Enhanced appearance
        appearance: {
          theme: 'light',
          accentColor: '#2563eb', // Blue to match your testnet theme
          logo: undefined,
        },
        // Enhanced embedded wallet configuration
        embeddedWallets: {
          createOnLogin: 'users-without-wallets'
        },
        // Legal settings
        legal: {
          termsAndConditionsUrl: undefined,
          privacyPolicyUrl: undefined
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
