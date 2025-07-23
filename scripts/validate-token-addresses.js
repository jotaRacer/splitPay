#!/usr/bin/env node

// Importar la configuración directamente
const LIFI_CONFIG = {
  supportedNetworks: {
    ethereum: {
      chainId: 1,
      name: 'Ethereum'
    },
    polygon: {
      chainId: 137,
      name: 'Polygon'
    },
    base: {
      chainId: 8453,
      name: 'Base'
    },
    arbitrum: {
      chainId: 42161,
      name: 'Arbitrum One'
    }
  },
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
    }
  }
};

console.log('🔍 Validando direcciones de tokens...\n');

// Función para validar formato de dirección Ethereum
function isValidAddress(address) {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

// Función para validar que la dirección no es la placeholder
function isNotPlaceholder(address) {
  return address !== '0x0000000000000000000000000000000000000000';
}

let allValid = true;
const errors = [];

console.log('📋 Verificando direcciones por red:\n');

Object.entries(LIFI_CONFIG.supportedTokens).forEach(([chainId, tokens]) => {
  const networkName = Object.values(LIFI_CONFIG.supportedNetworks)
    .find(network => network.chainId === parseInt(chainId))?.name || `Chain ${chainId}`;
  
  console.log(`🌐 ${networkName} (Chain ID: ${chainId}):`);
  
  Object.entries(tokens).forEach(([tokenName, address]) => {
    const isValidFormat = isValidAddress(address);
    const isNotPlaceholderAddr = isNotPlaceholder(address);
    
    if (isValidFormat && isNotPlaceholderAddr) {
      console.log(`  ✅ ${tokenName.toUpperCase()}: ${address}`);
    } else if (tokenName === 'native') {
      console.log(`  ✅ ${tokenName.toUpperCase()}: ${address} (placeholder válido)`);
    } else {
      console.log(`  ❌ ${tokenName.toUpperCase()}: ${address} (INVÁLIDO)`);
      allValid = false;
      errors.push(`${networkName} - ${tokenName}: ${address}`);
    }
  });
  console.log('');
});

// Verificar que no hay direcciones duplicadas
console.log('🔍 Verificando duplicados...');
const allAddresses = [];
Object.values(LIFI_CONFIG.supportedTokens).forEach(tokens => {
  Object.values(tokens).forEach(address => {
    if (isNotPlaceholder(address)) {
      allAddresses.push(address);
    }
  });
});

const duplicates = allAddresses.filter((address, index) => 
  allAddresses.indexOf(address) !== index
);

if (duplicates.length > 0) {
  console.log('⚠️  Direcciones duplicadas encontradas:');
  duplicates.forEach(address => {
    console.log(`  ${address}`);
  });
  allValid = false;
} else {
  console.log('✅ No se encontraron direcciones duplicadas');
}

console.log('\n📊 Resumen:');
if (allValid) {
  console.log('✅ Todas las direcciones de tokens son válidas');
  console.log('✅ Configuración lista para usar');
} else {
  console.log('❌ Se encontraron errores en las direcciones:');
  errors.forEach(error => {
    console.log(`  - ${error}`);
  });
  console.log('\n🔧 Corrige estos errores antes de continuar');
}

console.log('\n🔗 Enlaces útiles para verificar direcciones:');
console.log('  • Ethereum: https://etherscan.io/tokens');
console.log('  • Polygon: https://polygonscan.com/tokens');
console.log('  • Base: https://basescan.org/tokens');
console.log('  • Arbitrum: https://arbiscan.io/tokens'); 