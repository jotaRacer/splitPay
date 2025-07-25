"use client"

import { useState, useEffect, useCallback } from 'react'
import { usePrivyWeb3 } from '@/contexts/privy-context' 
import { ethers } from 'ethers'

interface TokenInfo {
  symbol: string
  address: string
  name: string
  decimals: number
  balance?: string
  balanceUSD?: number
}

// Popular token addresses for each network - these are the ones we'll check
const POPULAR_TOKENS_BY_NETWORK: { [chainId: number]: TokenInfo[] } = {
  1: [ // Ethereum
    { symbol: 'ETH', address: '0x0000000000000000000000000000000000000000', name: 'Ether', decimals: 18 },
    { symbol: 'USDC', address: '0xA0b86a33E6441a8C65C2D2356b6b2e9E6fB0B3D6E', name: 'USD Coin', decimals: 6 },
    { symbol: 'USDT', address: '0xdAC17F958D2ee523a2206206994597C13D831ec7', name: 'Tether USD', decimals: 6 },
    { symbol: 'DAI', address: '0x6B175474E89094C44Da98b954EedeAC495271d0F', name: 'Dai Stablecoin', decimals: 18 },
    { symbol: 'WETH', address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', name: 'Wrapped Ether', decimals: 18 },
  ],
  137: [ // Polygon
    { symbol: 'MATIC', address: '0x0000000000000000000000000000000000000000', name: 'Matic', decimals: 18 },
    { symbol: 'USDC', address: '0x2791Bca1f21C6e4c3B03F4a6Db6c7E0Cf5dC9eE5', name: 'USD Coin', decimals: 6 },
    { symbol: 'USDT', address: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F', name: 'Tether USD', decimals: 6 },
    { symbol: 'DAI', address: '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063', name: 'Dai Stablecoin', decimals: 18 },
  ],
  8453: [ // Base
    { symbol: 'ETH', address: '0x0000000000000000000000000000000000000000', name: 'Ether', decimals: 18 },
    { symbol: 'USDC', address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913', name: 'USD Coin', decimals: 6 },
    { symbol: 'DAI', address: '0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb', name: 'Dai Stablecoin', decimals: 18 },
  ],
  42161: [ // Arbitrum
    { symbol: 'ETH', address: '0x0000000000000000000000000000000000000000', name: 'Ether', decimals: 18 },
    { symbol: 'USDC', address: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831', name: 'USD Coin', decimals: 6 },
    { symbol: 'USDT', address: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9', name: 'Tether USD', decimals: 6 },
    { symbol: 'DAI', address: '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1', name: 'Dai Stablecoin', decimals: 18 },
  ],
  5000: [ // Mantle
    { symbol: 'MNT', address: '0x0000000000000000000000000000000000000000', name: 'Mantle', decimals: 18 },
    { symbol: 'USDC', address: '0x09Bc4E0D864854c6aFB6eB9A9cdF58aC190D0dF9', name: 'USD Coin', decimals: 6 },
    { symbol: 'USDT', address: '0x201EBa5CC46D216Ce6DC03F6a759e8E766e956aE', name: 'Tether USD', decimals: 6 },
  ]
}

const ERC20_ABI = [
  'function balanceOf(address) view returns (uint256)',
  'function decimals() view returns (uint8)',
  'function symbol() view returns (string)',
  'function name() view returns (string)'
]

export function useUserTokens(chainId: number | null) {
  const { account, getProvider } = usePrivyWeb3()
  const [tokens, setTokens] = useState<TokenInfo[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadUserTokens = useCallback(async () => {
    if (!account || !chainId || !getProvider) {
      setTokens([])
      return
    }

    const tokensToCheck = POPULAR_TOKENS_BY_NETWORK[chainId]
    if (!tokensToCheck) {
      setTokens([])
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const provider = await getProvider()
      if (!provider) {
        throw new Error('Could not get provider')
      }

      const tokensWithBalances: TokenInfo[] = []

      for (const token of tokensToCheck) {
        try {
          let balance = '0'
          
          if (token.address === '0x0000000000000000000000000000000000000000') {
            // Native token (ETH, MATIC, MNT, etc.)
            const balanceWei = await provider.getBalance(account)
            balance = ethers.formatUnits(balanceWei, token.decimals)
          } else {
            // ERC20 token
            const tokenContract = new ethers.Contract(token.address, ERC20_ABI, provider)
            const balanceWei = await tokenContract.balanceOf(account)
            balance = ethers.formatUnits(balanceWei, token.decimals)
          }

          // Only include tokens with balance > 0 or if balance is very close to 0 but user might want to see it
          const balanceNum = parseFloat(balance)
          if (balanceNum > 0.000001) {
            tokensWithBalances.push({
              ...token,
              balance: balance
            })
          }
        } catch (error) {
          console.warn(`Failed to load balance for ${token.symbol}:`, error)
          // Still include the token but with 0 balance, in case user wants to see it
          tokensWithBalances.push({
            ...token,
            balance: '0'
          })
        }
      }

      // Sort by balance (highest first), but put native token first
      tokensWithBalances.sort((a, b) => {
        // Native token always first
        if (a.address === '0x0000000000000000000000000000000000000000') return -1
        if (b.address === '0x0000000000000000000000000000000000000000') return 1
        
        // Then by balance
        const balanceA = parseFloat(a.balance || '0')
        const balanceB = parseFloat(b.balance || '0')
        return balanceB - balanceA
      })

      setTokens(tokensWithBalances)
    } catch (error) {
      console.error('Error loading user tokens:', error)
      setError(error instanceof Error ? error.message : 'Failed to load tokens')
      // Fallback to showing tokens without balances
      setTokens(tokensToCheck)
    } finally {
      setIsLoading(false)
    }
  }, [account, chainId, getProvider])

  useEffect(() => {
    loadUserTokens()
  }, [loadUserTokens])

  return {
    tokens,
    isLoading,
    error,
    refetch: loadUserTokens
  }
}
