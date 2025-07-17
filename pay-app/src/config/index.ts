export const config = {
  app: {
    name: "Split Pay",
    version: "1.0.0",
    description: "Split payments across different blockchains with your friends"
  },
  networks: {
    ethereum: {
      name: "Ethereum",
      chainId: 1,
      symbol: "ETH"
    },
    polygon: {
      name: "Polygon",
      chainId: 137,
      symbol: "MATIC"
    },
    base: {
      name: "Base",
      chainId: 8453,
      symbol: "ETH"
    }
  },
  api: {
    baseUrl: process.env.REACT_APP_API_URL || "http://localhost:3001",
    timeout: 10000
  }
} 