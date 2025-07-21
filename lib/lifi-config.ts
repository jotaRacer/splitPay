export const LIFI_CONFIG = {
  // Configuración de la API de LiFi
  apiKey: process.env.NEXT_PUBLIC_LIFI_API_KEY || '',
  apiUrl: 'https://li.quest',
  
  // Redes soportadas por LiFi
  supportedNetworks: {
    ethereum: {
      chainId: 1,
      name: 'Ethereum',
      symbol: 'ETH',
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
      symbol: 'MATIC',
      rpcUrl: 'https://polygon-rpc.com',
      blockExplorer: 'https://polygonscan.com',
      nativeCurrency: {
        name: 'Matic',
        symbol: 'MATIC',
        decimals: 18
      }
    },
    base: {
      chainId: 8453,
      name: 'Base',
      symbol: 'ETH',
      rpcUrl: 'https://mainnet.base.org',
      blockExplorer: 'https://basescan.org',
      nativeCurrency: {
        name: 'Ether',
        symbol: 'ETH',
        decimals: 18
      }
    },
    arbitrum: {
      chainId: 42161,
      name: 'Arbitrum One',
      symbol: 'ETH',
      rpcUrl: 'https://arb1.arbitrum.io/rpc',
      blockExplorer: 'https://arbiscan.io',
      nativeCurrency: {
        name: 'Ether',
        symbol: 'ETH',
        decimals: 18
      }
    }
  },

  // Tokens soportados por red
  supportedTokens: {
    1: { // Ethereum
      native: '0x0000000000000000000000000000000000000000',
      usdc: '0xA0b86a33E6441b8c4C8C8C8C8C8C8C8C8C8C8C8',
      usdt: '0xdAC17F958D2ee523a2206206994597C13D831ec7'
    },
    137: { // Polygon
      native: '0x0000000000000000000000000000000000000000',
      usdc: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
      usdt: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F'
    },
    8453: { // Base
      native: '0x0000000000000000000000000000000000000000',
      usdc: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913'
    },
    42161: { // Arbitrum
      native: '0x0000000000000000000000000000000000000000',
      usdc: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
      usdt: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9'
    }
  },

  // Configuración de opciones por defecto
  defaultOptions: {
    allowSwitchChain: false,
    maxResults: 5,
    infiniteApproval: false
  }
}

export type SupportedNetwork = keyof typeof LIFI_CONFIG.supportedNetworks
export type NetworkConfig = typeof LIFI_CONFIG.supportedNetworks[SupportedNetwork] 