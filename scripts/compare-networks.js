#!/usr/bin/env node

console.log('🔍 Comparando configuraciones de redes...\n');

// Configuración de networks.ts
const NETWORKS_CONFIG = {
  // Testnets
  sepolia: { chainId: 11155111, name: 'Sepolia Testnet' },
  polygonMumbai: { chainId: 80001, name: 'Mumbai Testnet' },
  arbitrumSepolia: { chainId: 421614, name: 'Arbitrum Sepolia' },
  optimismSepolia: { chainId: 11155420, name: 'Optimism Sepolia' },
  mantleTestnet: { chainId: 5001, name: 'Mantle Testnet' },
  
  // Mainnets
  mantle: { chainId: 5000, name: 'Mantle' },
  ethereum: { chainId: 1, name: 'Ethereum' },
  polygon: { chainId: 137, name: 'Polygon' },
  base: { chainId: 8453, name: 'Base' },
  arbitrum: { chainId: 42161, name: 'Arbitrum One' }
};

// Configuración de lifi-config.ts
const LIFI_CONFIG = {
  ethereum: { chainId: 1, name: 'Ethereum' },
  polygon: { chainId: 137, name: 'Polygon' },
  base: { chainId: 8453, name: 'Base' },
  arbitrum: { chainId: 42161, name: 'Arbitrum One' },
  mantle: { chainId: 5000, name: 'Mantle' }
};

console.log('📋 Redes en networks.ts:');
Object.entries(NETWORKS_CONFIG).forEach(([key, network]) => {
  const isTestnet = network.chainId > 1000000 || [80001, 421614, 11155420, 5001].includes(network.chainId);
  console.log(`  ${isTestnet ? '🧪' : '🌐'} ${network.name} (${network.chainId})`);
});

console.log('\n📋 Redes en lifi-config.ts:');
Object.entries(LIFI_CONFIG).forEach(([key, network]) => {
  console.log(`  🌐 ${network.name} (${network.chainId})`);
});

// Encontrar diferencias
console.log('\n🔍 Análisis de diferencias:');

// Redes en networks.ts pero no en lifi-config.ts
const missingInLifi = Object.entries(NETWORKS_CONFIG)
  .filter(([key, network]) => !Object.values(LIFI_CONFIG).some(lifi => lifi.chainId === network.chainId))
  .filter(([key, network]) => {
    // Solo considerar mainnets, no testnets
    const isTestnet = network.chainId > 1000000 || [80001, 421614, 11155420, 5001].includes(network.chainId);
    return !isTestnet;
  });

if (missingInLifi.length > 0) {
  console.log('\n❌ Redes mainnet en networks.ts pero NO en lifi-config.ts:');
  missingInLifi.forEach(([key, network]) => {
    console.log(`  • ${network.name} (${network.chainId})`);
  });
} else {
  console.log('\n✅ Todas las mainnets de networks.ts están en lifi-config.ts');
}

// Redes en lifi-config.ts pero no en networks.ts
const missingInNetworks = Object.entries(LIFI_CONFIG)
  .filter(([key, network]) => !Object.values(NETWORKS_CONFIG).some(net => net.chainId === network.chainId));

if (missingInNetworks.length > 0) {
  console.log('\n❌ Redes en lifi-config.ts pero NO en networks.ts:');
  missingInNetworks.forEach(([key, network]) => {
    console.log(`  • ${network.name} (${network.chainId})`);
  });
} else {
  console.log('\n✅ Todas las redes de lifi-config.ts están en networks.ts');
}

// Redes comunes
const commonNetworks = Object.entries(NETWORKS_CONFIG)
  .filter(([key, network]) => Object.values(LIFI_CONFIG).some(lifi => lifi.chainId === network.chainId))
  .filter(([key, network]) => {
    const isTestnet = network.chainId > 1000000 || [80001, 421614, 11155420, 5001].includes(network.chainId);
    return !isTestnet;
  });

console.log('\n✅ Redes mainnet comunes:');
commonNetworks.forEach(([key, network]) => {
  console.log(`  • ${network.name} (${network.chainId})`);
});

// Recomendaciones
console.log('\n💡 Recomendaciones:');

if (missingInLifi.length > 0) {
  console.log('1. Agregar las siguientes redes a lifi-config.ts:');
  missingInLifi.forEach(([key, network]) => {
    console.log(`   - ${network.name} (${network.chainId})`);
  });
}

if (missingInNetworks.length > 0) {
  console.log('2. Agregar las siguientes redes a networks.ts:');
  missingInNetworks.forEach(([key, network]) => {
    console.log(`   - ${network.name} (${network.chainId})`);
  });
}

console.log('\n3. Verificar que LiFi soporte todas las redes antes de agregarlas');
console.log('4. Mantener sincronizados ambos archivos de configuración');

console.log('\n🔗 Enlaces útiles:');
console.log('  • LiFi Supported Networks: https://docs.li.fi/li.fi-api/supported-chains');
console.log('  • Chainlist: https://chainlist.org/'); 