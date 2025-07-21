"use client"

import { createContext, useContext, ReactNode } from 'react'
import { PrivyProvider, usePrivy, useWallets } from '@privy-io/react-auth'
import { ethers } from 'ethers'
import { mainnet, polygon } from 'viem/chains'
import { SUPPORTED_NETWORKS } from '@/lib/networks'

interface PrivyWeb3ContextType {
  provider: ethers.BrowserProvider | null
  signer: ethers.Signer | null
  account: string | null
  isConnected: boolean
  chainId: number | null
  balance: string | null
  connect: () => void
  disconnect: () => void
  switchNetwork: (chainId: number) => Promise<void>
  isLoading: boolean
  user: any // Privy user object
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

  const switchNetwork = async (targetChainId: number) => {
    if (!wallet) return

    try {
      const provider = await wallet.getEthereumProvider()
      await provider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${targetChainId.toString(16)}` }],
      })
    } catch (switchError: any) {
      if (switchError.code === 4902) {
        const network = Object.values(SUPPORTED_NETWORKS).find(n => n.chainId === targetChainId)
        if (network) {
          try {
            const provider = await wallet.getEthereumProvider()
            await provider.request({
              method: 'wallet_addEthereumChain',
              params: [{
                chainId: `0x${targetChainId.toString(16)}`,
                chainName: network.name,
                rpcUrls: [network.rpcUrl],
                nativeCurrency: network.nativeCurrency,
                blockExplorerUrls: [network.blockExplorer],
              }],
            })
          } catch (addError) {
            console.error('Failed to add network:', addError)
          }
        }
      } else {
        console.error('Failed to switch network:', switchError)
      }
    }
  }

  // Create context value with async getters
  const contextValue: PrivyWeb3ContextType = {
    provider: null, // Will be fetched when needed
    signer: null,   // Will be fetched when needed  
    account: wallet?.address || null,
    isConnected: authenticated && !!wallet,
    chainId: null,  // Will be fetched when needed
    balance: null,  // Will be fetched when needed
    connect: login,
    disconnect: logout,
    switchNetwork,
    isLoading: !ready,
    user,
  }

  // Expose async getters for components that need them
  ;(contextValue as any).getProvider = getProvider
  ;(contextValue as any).getSigner = getSigner
  ;(contextValue as any).getBalance = getBalance
  ;(contextValue as any).getChainId = getChainId

  return (
    <PrivyWeb3Context.Provider value={contextValue}>
      {children}
    </PrivyWeb3Context.Provider>
  )
}

// Main provider component
export function PrivyWeb3Provider({ children }: { children: ReactNode }) {
  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID || "your-privy-app-id"}
      config={{
        // Login methods
        loginMethods: ['wallet', 'email', 'google', 'twitter'],
        // Appearance
        appearance: {
          theme: 'light',
          accentColor: '#676FFF',
          logo: '/placeholder-logo.svg'
        },
        // Default chain
        defaultChain: mainnet,
        // Supported chains - using proper chain objects
        supportedChains: [
          mainnet,
          polygon,
          // Note: Mantle networks can be added later with custom configuration
        ],
        // Enable email
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
