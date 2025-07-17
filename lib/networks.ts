export const SUPPORTED_NETWORKS = {
  mantle: {
    chainId: 5000,
    name: 'Mantle',
    rpcUrl: 'https://rpc.mantle.xyz',
    blockExplorer: 'https://explorer.mantle.xyz',
    nativeCurrency: {
      name: 'Mantle',
      symbol: 'MNT',
      decimals: 18
    }
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
    }
  },
  // Additional networks for comparison
  ethereum: {
    chainId: 1,
    name: 'Ethereum',
    rpcUrl: 'https://mainnet.infura.io/v3/YOUR_INFURA_KEY',
    blockExplorer: 'https://etherscan.io',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18
    }
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
    }
  }
} as const

export type NetworkKey = keyof typeof SUPPORTED_NETWORKS
export type Network = typeof SUPPORTED_NETWORKS[NetworkKey]
