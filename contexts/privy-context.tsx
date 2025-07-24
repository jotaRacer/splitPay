"use client"

import { createContext, useContext, ReactNode, useEffect, useState, useMemo, useCallback } from 'react'
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

  // Memoize the primary wallet to prevent unnecessary re-renders
  const wallet = useMemo(() => wallets?.[0] || null, [wallets])

  // Optimize debug logging - only log when values actually change
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('Privy state:', { ready, authenticated, user: !!user, wallets: wallets?.length || 0 })
    }
  }, [ready, authenticated, user, wallets?.length])

  // Optimize force ready timeout - only run if actually needed
  useEffect(() => {
    if (!ready && !forceReady) {
      const timeout = setTimeout(() => {
        console.warn('Privy initialization timeout - forcing ready state')
        setForceReady(true)
      }, 5000) // Reduced from 10s to 5s

      return () => clearTimeout(timeout)
    }
  }, [ready, forceReady])

  // Memoize Web3 provider functions to prevent re-creation on every render
  const getProvider = useCallback(async () => {
    if (!wallet) return null
    try {
      const provider = await wallet.getEthereumProvider()
      return new ethers.BrowserProvider(provider)
    } catch (error) {
      console.error('Failed to get provider:', error)
      return null
    }
  }, [wallet])

  const getSigner = useCallback(async () => {
    const provider = await getProvider()
    if (!provider) return null
    try {
      return await provider.getSigner()
    } catch (error) {
      console.error('Failed to get signer:', error)
      return null
    }
  }, [getProvider])

  const getBalance = useCallback(async () => {
    const provider = await getProvider()
    if (!provider || !wallet?.address) return null
    try {
      const balance = await provider.getBalance(wallet.address)
      return ethers.formatEther(balance)
    } catch (error) {
      console.error('Failed to get balance:', error)
      return null
    }
  }, [getProvider, wallet?.address])

  const getChainId = useCallback(async () => {
    const provider = await getProvider()
    if (!provider) return null
    try {
      const network = await provider.getNetwork()
      return Number(network.chainId)
    } catch (error) {
      console.error('Failed to get chain ID:', error)
      return null
    }
  }, [getProvider])

  // Memoize context value to prevent unnecessary re-renders of consuming components
  const contextValue = useMemo<PrivyWeb3ContextType>(() => ({
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
  }), [
    wallet?.address,
    authenticated,
    wallet,
    login,
    logout,
    ready,
    forceReady,
    user,
    getProvider,
    getSigner,
    getBalance,
    getChainId
  ])

  return (
    <PrivyWeb3Context.Provider value={contextValue}>
      {children}
    </PrivyWeb3Context.Provider>
  )
}

// Main provider component - Simplified for performance
export function PrivyWeb3Provider({ children }: { children: ReactNode }) {
  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID || "your-privy-app-id"}
      config={{
        // Minimal login methods for faster loading
        loginMethods: ['wallet', 'email'],
        // Simplified appearance
        appearance: {
          theme: 'light',
          accentColor: '#2563eb',
        },
        // Minimal embedded wallet config
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
