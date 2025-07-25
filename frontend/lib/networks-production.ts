export const SUPPORTED_NETWORKS = {
  // PRODUCTION MAINNETS ONLY
  ethereum: {
    chainId: 1,
    name: 'Ethereum',
    rpcUrl: `https://mainnet.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_KEY}`,
    blockExplorer: 'https://etherscan.io',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18
    },
    isTestnet: false
  },
  polygon: {
    chainId: 137,
    name: 'Polygon',
    rpcUrl: 'https://polygon-rpc.com',
    blockExplorer: 'https://polygonscan.com',
    nativeCurrency: {
      name: 'Matic',
      symbol: 'MATIC',
      decimals: 18
    },
    isTestnet: false
  },
  base: {
    chainId: 8453,
    name: 'Base',
    rpcUrl: 'https://mainnet.base.org',
    blockExplorer: 'https://basescan.org',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18
    },
    isTestnet: false
  },
  arbitrum: {
    chainId: 42161,
    name: 'Arbitrum One',
    rpcUrl: 'https://arb1.arbitrum.io/rpc',
    blockExplorer: 'https://arbiscan.io',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18
    },
    isTestnet: false
  }
} as const

export type NetworkKey = keyof typeof SUPPORTED_NETWORKS
export type Network = typeof SUPPORTED_NETWORKS[NetworkKey]

// Utility functions
export const getMainnets = () => {
  return Object.entries(SUPPORTED_NETWORKS)
    .filter(([_, network]) => !network.isTestnet)
    .reduce((acc, [key, network]) => ({ ...acc, [key]: network }), {}) as Record<string, Network>
}

export const getSupportedChainIds = () => {
  return Object.values(SUPPORTED_NETWORKS).map(network => network.chainId)
}

export const getNetworkByChainId = (chainId: number): Network | undefined => {
  return Object.values(SUPPORTED_NETWORKS).find(network => network.chainId === chainId)
}

export const isValidChainId = (chainId: number): boolean => {
  return getSupportedChainIds().includes(chainId)
}
