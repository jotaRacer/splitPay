export const SUPPORTED_NETWORKS = {
  // TESTNETS (Perfect for development)
  sepolia: {
    chainId: 11155111,
    name: 'Sepolia Testnet',
    rpcUrl: `https://sepolia.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_KEY}`,
    blockExplorer: 'https://sepolia.etherscan.io',
    nativeCurrency: {
      name: 'Sepolia Ether',
      symbol: 'SepoliaETH',
      decimals: 18
    },
    isTestnet: true,
    faucets: [
      'https://sepoliafaucet.com/',
      'https://www.alchemy.com/faucets/ethereum-sepolia'
    ]
  },
  polygonMumbai: {
    chainId: 80001,
    name: 'Mumbai Testnet',
    rpcUrl: 'https://rpc-mumbai.maticvigil.com',
    blockExplorer: 'https://mumbai.polygonscan.com',
    nativeCurrency: {
      name: 'Mumbai Matic',
      symbol: 'MATIC',
      decimals: 18
    },
    isTestnet: true,
    faucets: [
      'https://faucet.polygon.technology/',
      'https://mumbaifaucet.com/'
    ]
  },
  arbitrumSepolia: {
    chainId: 421614,
    name: 'Arbitrum Sepolia',
    rpcUrl: 'https://sepolia-rollup.arbitrum.io/rpc',
    blockExplorer: 'https://sepolia.arbiscan.io',
    nativeCurrency: {
      name: 'Arbitrum Sepolia Ether',
      symbol: 'ETH',
      decimals: 18
    },
    isTestnet: true,
    faucets: [
      'https://faucet.quicknode.com/arbitrum/sepolia'
    ]
  },
  optimismSepolia: {
    chainId: 11155420,
    name: 'Optimism Sepolia',
    rpcUrl: 'https://sepolia.optimism.io',
    blockExplorer: 'https://sepolia-optimism.etherscan.io',
    nativeCurrency: {
      name: 'Optimism Sepolia Ether',
      symbol: 'ETH',
      decimals: 18
    },
    isTestnet: true,
    faucets: [
      'https://app.optimism.io/faucet'
    ]
  },
  mantleTestnet: {
    chainId: 5001,
    name: 'Mantle Testnet',
    rpcUrl: 'https://rpc.testnet.mantle.xyz',
    blockExplorer: 'https://explorer.testnet.mantle.xyz',
    nativeCurrency: {
      name: 'Mantle',
      symbol: 'MNT',
      decimals: 18
    },
    isTestnet: true,
    faucets: [
      'https://faucet.testnet.mantle.xyz/'
    ]
  },

  // MAINNETS
  mantle: {
    chainId: 5000,
    name: 'Mantle',
    rpcUrl: 'https://rpc.mantle.xyz',
    blockExplorer: 'https://explorer.mantle.xyz',
    nativeCurrency: {
      name: 'Mantle',
      symbol: 'MNT',
      decimals: 18
    },
    isTestnet: false
  },
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

// Utility functions for testnet development
export const getTestnets = () => {
  return Object.entries(SUPPORTED_NETWORKS)
    .filter(([_, network]) => network.isTestnet)
    .reduce((acc, [key, network]) => ({ ...acc, [key]: network }), {}) as Record<string, Network>
}

export const getMainnets = () => {
  return Object.entries(SUPPORTED_NETWORKS)
    .filter(([_, network]) => !network.isTestnet)
    .reduce((acc, [key, network]) => ({ ...acc, [key]: network }), {}) as Record<string, Network>
}

export const getNetworkByChainId = (chainId: number): Network | undefined => {
  return Object.values(SUPPORTED_NETWORKS).find(network => network.chainId === chainId)
}

export const isTestnetChainId = (chainId: number): boolean => {
  const network = getNetworkByChainId(chainId)
  return network?.isTestnet || false
}

export const getFaucetsForChainId = (chainId: number): string[] => {
  const network = getNetworkByChainId(chainId)
  return (network as any)?.faucets || []
}
