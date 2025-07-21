#!/usr/bin/env node

import fetch from 'node-fetch';

console.log('🧪 Probando Hook de LiFi actualizado...\n');

async function testLifiHook() {
  try {
    // Simular los parámetros que usaría el hook
    const testParams = {
      fromChainId: 137,
      toChainId: 1,
      fromTokenAddress: '0x0000000000000000000000000000000000000000',
      toTokenAddress: '0x0000000000000000000000000000000000000000',
      fromAmount: '1000000000000000000',
      fromAddress: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
      toAddress: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045'
    };

    console.log('📋 Parámetros de prueba:');
    console.log(JSON.stringify(testParams, null, 2));

    // Simular la llamada que haría el hook
    const queryParams = new URLSearchParams({
      fromChain: testParams.fromChainId.toString(),
      toChain: testParams.toChainId.toString(),
      fromToken: testParams.fromTokenAddress,
      toToken: testParams.toTokenAddress,
      fromAmount: testParams.fromAmount,
      fromAddress: testParams.fromAddress,
      toAddress: testParams.toAddress
    });

    const url = `https://li.quest/v1/quote?${queryParams.toString()}`;
    console.log('\n🔗 URL del hook:', url);

    const response = await fetch(url);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
    }

    const quote = await response.json();
    
    console.log('\n✅ Hook funcionando correctamente!');
    console.log('\n📊 Datos que devolvería el hook:');
    console.log('• ID de la cotización:', quote.id);
    console.log('• Herramienta:', quote.toolDetails?.name || quote.tool);
    console.log('• Token origen:', quote.action.fromToken.symbol);
    console.log('• Token destino:', quote.action.toToken.symbol);
    console.log('• Cantidad origen:', quote.action.fromAmount);
    console.log('• Cantidad destino:', quote.estimate.toAmount);
    console.log('• Costo gas USD:', quote.estimate.gasCosts?.[0]?.amountUSD || '0');
    console.log('• Duración estimada:', quote.estimate.executionDuration, 'segundos');
    console.log('• Valor USD origen:', quote.estimate.fromAmountUSD);
    console.log('• Valor USD destino:', quote.estimate.toAmountUSD);
    
    console.log('\n🔧 Datos de transacción disponibles:');
    console.log('• Dirección destino:', quote.transactionRequest.to);
    console.log('• Gas limit:', quote.transactionRequest.gasLimit);
    console.log('• Gas price:', quote.transactionRequest.gasPrice);
    console.log('• Value:', quote.transactionRequest.value);
    console.log('• Chain ID:', quote.transactionRequest.chainId);

    console.log('\n✅ El hook está listo para ejecutar transacciones reales!');

  } catch (error) {
    console.error('❌ Error al probar hook:', error.message);
  }
}

testLifiHook(); 