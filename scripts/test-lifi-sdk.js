#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🧪 Probando SDK de LiFi...\n');

// Simular el entorno de navegador para el SDK
global.fetch = require('node-fetch');

async function testLifiSDK() {
  try {
    // Importar el SDK de LiFi
    const { getRoutes } = await import('@lifi/sdk');
    
    console.log('✅ SDK de LiFi importado correctamente');
    
    // Datos de prueba
    const testParams = {
      fromChainId: 137, // Polygon
      toChainId: 1, // Ethereum
      fromToken: '0x0000000000000000000000000000000000000000', // MATIC
      toToken: '0x0000000000000000000000000000000000000000', // ETH
      fromAmount: '1000000000000000000', // 1 MATIC
      fromAddress: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
      toAddress: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6'
    };

    console.log('📡 Probando getRoutes...');
    console.log('📋 Parámetros:', JSON.stringify(testParams, null, 2));
    
    const routes = await getRoutes(testParams);
    
    console.log('✅ getRoutes ejecutado correctamente');
    console.log(`📈 Rutas encontradas: ${routes.routes?.length || 0}`);
    
    if (routes.routes && routes.routes.length > 0) {
      console.log('🔍 Primera ruta:');
      console.log(JSON.stringify(routes.routes[0], null, 2));
    }

  } catch (error) {
    console.error('❌ Error al probar SDK:', error.message);
    console.error('📋 Stack:', error.stack);
  }
}

testLifiSDK(); 