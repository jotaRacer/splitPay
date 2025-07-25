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
      rpcUrl: process.env.NEXT_PUBLIC_RPC_URL_ETHEREUM || 'https://ethereum.publicnode.com',
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
    },
    mantle: {
      chainId: 5000,
      name: 'Mantle',
      symbol: 'MNT',
      rpcUrl: 'https://rpc.mantle.xyz',
      blockExplorer: 'https://explorer.mantle.xyz',
      nativeCurrency: {
        name: 'Mantle',
        symbol: 'MNT',
        decimals: 18
      }
    }
  },

  // Tokens soportados por red (direcciones verificadas)
  supportedTokens: {
    1: { // Ethereum
      native: '0x0000000000000000000000000000000000000000',
      usdc: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
      usdt: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
      dai: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
      weth: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'
    },
    137: { // Polygon
      native: '0x0000000000000000000000000000000000000000',
      usdc: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
      usdt: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
      dai: '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
      wmatic: '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270'
    },
    8453: { // Base
      native: '0x0000000000000000000000000000000000000000',
      usdc: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
      weth: '0x4200000000000000000000000000000000000006'
    },
    42161: { // Arbitrum
      native: '0x0000000000000000000000000000000000000000',
      usdc: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
      usdt: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9',
      weth: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1'
    },
    5000: { // Mantle
      native: '0x0000000000000000000000000000000000000000',
      wmnt: '0x78c1b0C915c4FAA5FffA6CAbf0219DA63d7f4cb8'
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