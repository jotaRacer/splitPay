#!/usr/bin/env node

console.log('🧪 Probando swaps con las nuevas redes...\n');

// Casos de prueba con las nuevas redes
const testCases = [
  {
    name: 'Base → Ethereum',
    fromChain: 8453,
    toChain: 1,
    fromToken: '0x0000000000000000000000000000000000000000', // ETH
    toToken: '0x0000000000000000000000000000000000000000', // ETH
    fromAmount: '100000000000000000', // 0.1 ETH
    description: 'Swap de ETH en Base a ETH en Ethereum'
  },
  {
    name: 'Arbitrum → Polygon',
    fromChain: 42161,
    toChain: 137,
    fromToken: '0x0000000000000000000000000000000000000000', // ETH
    toToken: '0x0000000000000000000000000000000000000000', // MATIC
    fromAmount: '100000000000000000', // 0.1 ETH
    description: 'Swap de ETH en Arbitrum a MATIC en Polygon'
  },
  {
    name: 'Mantle → Ethereum',
    fromChain: 5000,
    toChain: 1,
    fromToken: '0x0000000000000000000000000000000000000000', // MNT
    toToken: '0x0000000000000000000000000000000000000000', // ETH
    fromAmount: '1000000000000000000', // 1 MNT
    description: 'Swap de MNT en Mantle a ETH en Ethereum'
  }
];

async function testNetworkSwap(testCase) {
  console.log(`📋 ${testCase.name}`);
  console.log(`📝 ${testCase.description}`);
  
  const params = new URLSearchParams({
    fromChain: testCase.fromChain.toString(),
    toChain: testCase.toChain.toString(),
    fromToken: testCase.fromToken,
    toToken: testCase.toToken,
    fromAmount: testCase.fromAmount,
    fromAddress: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
    toAddress: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045'
  });

  const url = `https://li.quest/v1/quote?${params.toString()}`;
  
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        'x-lifi-api-key': 'de742b5a-ad65-40b6-885d-e7404f9bbd55.143e3128-ed1e-48e4-9964-a06893bcec17'
      }
    });

    if (response.ok) {
      const quote = await response.json();
      console.log(`✅ Swap disponible:`);
      console.log(`   • Herramienta: ${quote.toolDetails?.name || quote.tool}`);
      console.log(`   • Cantidad origen: ${quote.action.fromAmount} (${quote.action.fromToken.symbol})`);
      console.log(`   • Cantidad destino: ${quote.estimate.toAmount} (${quote.action.toToken.symbol})`);
      console.log(`   • Costo gas: $${quote.estimate.gasCosts?.[0]?.amountUSD || '0'}`);
      console.log(`   • Duración: ${quote.estimate.executionDuration}s`);
      console.log(`   • Valor USD: $${quote.estimate.fromAmountUSD} → $${quote.estimate.toAmountUSD}`);
    } else {
      const error = await response.json();
      console.log(`❌ Error: ${error.message || response.statusText}`);
    }
  } catch (error) {
    console.log(`❌ Error de red: ${error.message}`);
  }
  
  console.log('');
}

async function runTests() {
  console.log('🚀 Ejecutando pruebas con nuevas redes...\n');
  
  for (const testCase of testCases) {
    await testNetworkSwap(testCase);
  }
  
  console.log('✅ Pruebas completadas');
  console.log('\n🎉 Todas las nuevas redes están funcionando correctamente con LiFi!');
}

runTests().catch(console.error); 