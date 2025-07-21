#!/usr/bin/env node

// Importar node-fetch para Node.js
import fetch from 'node-fetch';

console.log('🧪 Probando API de LiFi...\n');

async function testLifiAPI() {
  try {
    // Datos de prueba con dirección válida
    const testData = {
      fromChain: 137,
      toChain: 1,
      fromToken: '0x0000000000000000000000000000000000000000',
      toToken: '0x0000000000000000000000000000000000000000',
      fromAmount: '1000000000000000000',
      fromAddress: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
      toAddress: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6'
    };

    // Usar una dirección válida conocida (Vitalik Buterin)
    testData.fromAddress = '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045';
    testData.toAddress = '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045';

    // Verificar que las direcciones sean válidas
    const isValidAddress = (address) => {
      return /^0x[a-fA-F0-9]{40}$/.test(address);
    };

    if (!isValidAddress(testData.fromAddress) || !isValidAddress(testData.toAddress)) {
      console.log('❌ Error: Direcciones inválidas');
      console.log('fromAddress válida:', isValidAddress(testData.fromAddress));
      console.log('toAddress válida:', isValidAddress(testData.toAddress));
      return;
    }

    // Construir URL con parámetros de consulta
    const params = new URLSearchParams({
      fromChain: testData.fromChain,
      toChain: testData.toChain,
      fromToken: testData.fromToken,
      toToken: testData.toToken,
      fromAmount: testData.fromAmount,
      fromAddress: testData.fromAddress,
      toAddress: testData.toAddress
    });

    const url = `https://li.quest/v1/quote?${params.toString()}`;
    console.log('📡 Enviando petición a LiFi API...');
    console.log('🔗 URL:', url);
    console.log('📋 Datos de prueba:', JSON.stringify(testData, null, 2));
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });

    console.log('📊 Status:', response.status, response.statusText);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Respuesta exitosa:');
      console.log(JSON.stringify(data, null, 2));
    } else {
      const errorData = await response.json();
      console.log('❌ Error:', errorData);
    }

  } catch (error) {
    console.error('❌ Error al probar API:', error.message);
  }
}

testLifiAPI(); 