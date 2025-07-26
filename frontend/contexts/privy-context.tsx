"use client"

import React, { createContext, useContext, ReactNode, useEffect, useState, useMemo, useCallback } from 'react'
import { PrivyProvider, usePrivy, useWallets } from '@privy-io/react-auth'
import { ethers } from 'ethers'

interface PrivyWeb3ContextType {
  account: string | null
  chainId: number | null // Add synchronous chainId access
  isConnected: boolean
  connect: () => void
  disconnect: () => void
  isLoading: boolean
  user: any
  getProvider: () => Promise<ethers.BrowserProvider | null>
  getSigner: () => Promise<ethers.Signer | null>
  getBalance: () => Promise<string | null>
  getChainId: () => Promise<number | null> // Keep async for backward compatibility
  getAccount: () => Promise<string | null> // Add async account method
}

const PrivyWeb3Context = createContext<PrivyWeb3ContextType | null>(null)

// Stable wrapper component to prevent hydration issues
function StableChildrenWrapper({ children }: { children: ReactNode }) {
  return <>{children}</>
}

// Inner component that uses Privy hooks
function PrivyWeb3ProviderInner({ children }: { children: ReactNode }) {
  const { login, logout, authenticated, user, ready } = usePrivy()
  const { wallets } = useWallets()
  const [forceReady, setForceReady] = useState(false)

  // Memoize the primary wallet to prevent unnecessary re-renders
  const wallet = useMemo(() => wallets?.[0] || null, [wallets])

  // Synchronous state for immediate access - this prevents slow async calls
  const [chainId, setChainId] = useState<number | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [account, setAccount] = useState<string | null>(null)

  // Initialize wallet data once when ready
  useEffect(() => {
    let mounted = true

    const initializeWalletData = async () => {
      if (!ready || !authenticated || !wallet) {
        if (mounted) {
          setIsConnected(false)
          setAccount(null)
          setChainId(null)
        }
        return
      }

      try {
        const provider = await wallet.getEthereumProvider()
        const [accounts, currentChainId] = await Promise.all([
          provider.request({ method: 'eth_accounts' }),
          provider.request({ method: 'eth_chainId' })
        ])

        if (mounted) {
          const userAccount = accounts[0] || null
          const numericChainId = parseInt(currentChainId, 16)
          
          setAccount(userAccount)
          setChainId(numericChainId)
          setIsConnected(authenticated && !!userAccount)
        }
      } catch (error) {
        console.error('Failed to initialize wallet data:', error)
        if (mounted) {
          setIsConnected(false)
          setAccount(null)
          setChainId(1) // Default to mainnet
        }
      }
    }

    initializeWalletData()

    return () => {
      mounted = false
    }
  }, [ready, authenticated, wallet])

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

  // Keep async getChainId for backward compatibility, but make it fast
  const getChainIdAsync = useCallback(async () => {
    // Return cached value immediately if available
    if (chainId !== null) return chainId
    
    // Otherwise try to get it fresh
    const provider = await getProvider()
    if (!provider) return 1 // Default to mainnet
    try {
      const network = await provider.getNetwork()
      const networkChainId = Number(network.chainId)
      setChainId(networkChainId) // Update cache
      return networkChainId
    } catch (error) {
      console.error('Failed to get chain ID:', error)
      return 1 // Default to mainnet
    }
  }, [getProvider, chainId])

  // Keep async getAccount for backward compatibility
  const getAccountAsync = useCallback(async () => {
    // Return cached value immediately if available
    if (account !== null) return account
    
    // Otherwise try to get it fresh
    if (!wallet) return null
    return wallet.address || null
  }, [account, wallet])

  // Memoize context value to prevent unnecessary re-renders of consuming components
  const contextValue = useMemo<PrivyWeb3ContextType>(() => ({
    // Provide synchronous access to wallet data - this is the key performance improvement!
    account: account,
    chainId: chainId,
    isConnected: isConnected,
    connect: login,
    disconnect: logout,
    isLoading: !ready && !forceReady,
    user,
    getProvider,
    getSigner,
    getBalance,
    // Provide both sync and async access
    getChainId: getChainIdAsync,
    getAccount: getAccountAsync,
  }), [
    account,
    chainId, 
    isConnected,
    login,
    logout,
    ready,
    forceReady,
    user,
    getProvider,
    getSigner,
    getBalance,
    getChainIdAsync,
    getAccountAsync
  ])

  return (
    <PrivyWeb3Context.Provider value={contextValue}>
      <StableChildrenWrapper>{children}</StableChildrenWrapper>
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
      <PrivyWeb3ProviderInner key="privy-inner">
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
