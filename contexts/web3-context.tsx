"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { ethers } from 'ethers'
import { SUPPORTED_NETWORKS } from '@/lib/networks'

interface Web3ContextType {
  provider: ethers.BrowserProvider | null
  signer: ethers.Signer | null
  account: string | null
  isConnected: boolean
  chainId: number | null
  balance: string | null
  connect: () => Promise<void>
  disconnect: () => void
  switchNetwork: (chainId: number) => Promise<void>
  isLoading: boolean
}

const Web3Context = createContext<Web3ContextType | null>(null)

export function Web3Provider({ children }: { children: ReactNode }) {
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null)
  const [signer, setSigner] = useState<ethers.Signer | null>(null)
  const [account, setAccount] = useState<string | null>(null)
  const [chainId, setChainId] = useState<number | null>(null)
  const [balance, setBalance] = useState<string | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const connect = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        setIsLoading(true)
        const browserProvider = new ethers.BrowserProvider(window.ethereum)
        const accounts = await browserProvider.send('eth_requestAccounts', [])
        const signer = await browserProvider.getSigner()
        const network = await browserProvider.getNetwork()
        const balance = await browserProvider.getBalance(accounts[0])

        setProvider(browserProvider)
        setSigner(signer)
        setAccount(accounts[0])
        setChainId(Number(network.chainId))
        setBalance(ethers.formatEther(balance))
        setIsConnected(true)
      } catch (error) {
        console.error('Failed to connect wallet:', error)
      } finally {
        setIsLoading(false)
      }
    } else {
      alert('Please install MetaMask or another Web3 wallet')
    }
  }

  const disconnect = () => {
    setProvider(null)
    setSigner(null)
    setAccount(null)
    setChainId(null)
    setBalance(null)
    setIsConnected(false)
  }

  const switchNetwork = async (targetChainId: number) => {
    if (!window.ethereum) {
      throw new Error('No wallet detected. Please install MetaMask or another Web3 wallet.')
    }

    try {
      setIsLoading(true)
      
      // First try to switch to the network
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${targetChainId.toString(16)}` }],
      })
      
      // Wait a bit for the network change to be processed
      await new Promise(resolve => setTimeout(resolve, 500))
      
    } catch (switchError: any) {
      console.error('Switch network error:', switchError)
      
      // If the network doesn't exist in wallet (error 4902), try to add it
      if (switchError.code === 4902) {
        const network = Object.values(SUPPORTED_NETWORKS).find(n => n.chainId === targetChainId)
        if (!network) {
          throw new Error(`Network with chain ID ${targetChainId} is not supported`)
        }
        
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: `0x${targetChainId.toString(16)}`,
              chainName: network.name,
              rpcUrls: [network.rpcUrl],
              nativeCurrency: network.nativeCurrency,
              blockExplorerUrls: network.blockExplorer ? [network.blockExplorer] : [],
            }],
          })
          
          // After adding, try to switch again
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: `0x${targetChainId.toString(16)}` }],
          })
          
        } catch (addError: any) {
          console.error('Failed to add network:', addError)
          throw new Error(`Failed to add network ${network.name}: ${addError.message || 'Unknown error'}`)
        }
      } else if (switchError.code === 4001) {
        // User rejected the request
        throw new Error('User rejected network switch request')
      } else {
        // Other errors
        throw new Error(`Failed to switch network: ${switchError.message || 'Unknown error'}`)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const updateBalance = async () => {
    if (provider && account) {
      try {
        const balance = await provider.getBalance(account)
        setBalance(ethers.formatEther(balance))
      } catch (error) {
        console.error('Failed to update balance:', error)
      }
    }
  }

  useEffect(() => {
    if (typeof window.ethereum !== 'undefined') {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
          disconnect()
        } else {
          setAccount(accounts[0])
          updateBalance()
        }
      }

      const handleChainChanged = (chainId: string) => {
        setChainId(parseInt(chainId, 16))
        updateBalance()
      }

      window.ethereum.on('accountsChanged', handleAccountsChanged)
      window.ethereum.on('chainChanged', handleChainChanged)

      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged)
        window.ethereum.removeListener('chainChanged', handleChainChanged)
      }
    }
  }, [provider, account])

  return (
    <Web3Context.Provider value={{
      provider,
      signer,
      account,
      isConnected,
      chainId,
      balance,
      connect,
      disconnect,
      switchNetwork,
      isLoading
    }}>
      {children}
    </Web3Context.Provider>
  )
}

export function useWeb3() {
  const context = useContext(Web3Context)
  if (!context) {
    throw new Error('useWeb3 must be used within a Web3Provider')
  }
  return context
}

// Type declaration for window.ethereum
declare global {
  interface Window {
    ethereum?: any
  }
}
