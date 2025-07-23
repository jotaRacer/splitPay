#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 Verificando configuración de LiFi...\n');

// Verificar si existe .env.local
const envPath = path.join(process.cwd(), '.env.local');
if (!fs.existsSync(envPath)) {
  console.log('❌ No se encontró archivo .env.local');
console.log('📝 Crea un archivo .env.local con la siguiente configuración:\n');
console.log('# LiFi Configuration');
console.log('NEXT_PUBLIC_LIFI_API_KEY=tu_api_key_aqui');
console.log('NEXT_PUBLIC_LIFI_API_URL=https://li.quest\n');
console.log('# Web3 Configuration');
console.log('NEXT_PUBLIC_RPC_URL_ETHEREUM=https://mainnet.infura.io/v3/TU_INFURA_KEY');
console.log('NEXT_PUBLIC_RPC_URL_POLYGON=https://polygon-rpc.com');
console.log('NEXT_PUBLIC_RPC_URL_BASE=https://mainnet.base.org');
console.log('NEXT_PUBLIC_RPC_URL_ARBITRUM=https://arb1.arbitrum.io/rpc\n');
console.log('📖 Para obtener tu API Key de LiFi, sigue las instrucciones en:');
console.log('   scripts/get-lifi-api-key.md\n');
process.exit(1);
}

// Leer y verificar variables de entorno
const envContent = fs.readFileSync(envPath, 'utf8');
const envVars = envContent.split('\n').filter(line => line.trim() && !line.startsWith('#'));

console.log('✅ Archivo .env.local encontrado');
console.log('📋 Variables de entorno configuradas:\n');

envVars.forEach(line => {
  const [key, value] = line.split('=');
  if (key && value) {
    const maskedValue = value.length > 10 ? value.substring(0, 10) + '...' : value;
    console.log(`  ${key}=${maskedValue}`);
  }
});

console.log('\n🔗 Enlaces útiles:');
console.log('  • LiFi Dashboard: https://li.quest/');
console.log('  • LiFi Documentation: https://docs.li.fi/');
console.log('  • LiFi SDK: https://docs.li.fi/products/li.fi-api/sdk');
console.log('  • Infura (para RPC): https://infura.io/');

console.log('\n✅ Verificación completada'); 