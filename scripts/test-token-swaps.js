#!/usr/bin/env node

console.log('🧪 Probando swaps con diferentes tokens...\n');

// Configuración de tokens
const TOKENS = {
  1: { // Ethereum
    usdc: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    usdt: '0xdAC17F958D2ee523a2206206994597C13D831ec7'
  },
  137: { // Polygon
    usdc: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
    usdt: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F'
  }
};

// Casos de prueba
const testCases = [
  {
    name: 'USDC Polygon → USDT Ethereum',
    fromChain: 137,
    toChain: 1,
    fromToken: TOKENS[137].usdc,
    toToken: TOKENS[1].usdt,
    fromAmount: '1000000', // 1 USDC (6 decimales)
    description: 'Swap de USDC en Polygon a USDT en Ethereum'
  },
  {
    name: 'USDT Ethereum → USDC Polygon',
    fromChain: 1,
    toChain: 137,
    fromToken: TOKENS[1].usdt,
    toToken: TOKENS[137].usdc,
    fromAmount: '1000000', // 1 USDT (6 decimales)
    description: 'Swap de USDT en Ethereum a USDC en Polygon'
  }
];

async function testTokenSwap(testCase) {
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
  console.log('🚀 Ejecutando pruebas de swaps de tokens...\n');
  
  for (const testCase of testCases) {
    await testTokenSwap(testCase);
  }
  
  console.log('✅ Pruebas completadas');
}

runTests().catch(console.error); 