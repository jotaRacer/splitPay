#!/usr/bin/env node

console.log('🔍 Verificando redes soportadas por LiFi...\n');

// Redes que queremos verificar
const networksToCheck = [
  { chainId: 1, name: 'Ethereum' },
  { chainId: 137, name: 'Polygon' },
  { chainId: 8453, name: 'Base' },
  { chainId: 42161, name: 'Arbitrum One' },
  { chainId: 5000, name: 'Mantle' }
];

async function checkNetworkSupport(network) {
  console.log(`🌐 Verificando ${network.name} (${network.chainId})...`);
  
  try {
    // Intentar obtener una cotización simple para verificar soporte
    const params = new URLSearchParams({
      fromChain: network.chainId.toString(),
      toChain: network.chainId === 1 ? '137' : '1', // Cambiar de red
      fromToken: '0x0000000000000000000000000000000000000000', // Token nativo
      toToken: '0x0000000000000000000000000000000000000000', // Token nativo
      fromAmount: '100000000000000000', // 0.1 token (monto más pequeño)
      fromAddress: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
      toAddress: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045'
    });

    const url = `https://li.quest/v1/quote?${params.toString()}`;
    
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        'x-lifi-api-key': 'de742b5a-ad65-40b6-885d-e7404f9bbd55.143e3128-ed1e-48e4-9964-a06893bcec17'
      }
    });

    if (response.ok) {
      const quote = await response.json();
      console.log(`  ✅ Soportado: ${quote.toolDetails?.name || quote.tool}`);
      return { supported: true, tool: quote.toolDetails?.name || quote.tool };
    } else {
      const error = await response.json();
      console.log(`  ❌ No soportado: ${error.message || response.statusText}`);
      return { supported: false, error: error.message || response.statusText };
    }
  } catch (error) {
    console.log(`  ❌ Error: ${error.message}`);
    return { supported: false, error: error.message };
  }
}

async function checkAllNetworks() {
  const results = [];
  
  for (const network of networksToCheck) {
    const result = await checkNetworkSupport(network);
    results.push({ ...network, ...result });
    console.log('');
  }
  
  // Resumen
  console.log('📊 Resumen de soporte:');
  console.log('');
  
  const supported = results.filter(r => r.supported);
  const notSupported = results.filter(r => !r.supported);
  
  if (supported.length > 0) {
    console.log('✅ Redes soportadas por LiFi:');
    supported.forEach(network => {
      console.log(`  • ${network.name} (${network.chainId}) - ${network.tool}`);
    });
  }
  
  if (notSupported.length > 0) {
    console.log('\n❌ Redes NO soportadas por LiFi:');
    notSupported.forEach(network => {
      console.log(`  • ${network.name} (${network.chainId}) - ${network.error}`);
    });
  }
  
  console.log('\n💡 Recomendaciones:');
  console.log('• Solo usar redes soportadas por LiFi en la configuración');
  console.log('• Mantle no está soportado, no agregarlo a lifi-config.ts');
  console.log('• Base y Arbitrum están soportados, agregarlos a networks.ts');
  
  return results;
}

checkAllNetworks().catch(console.error); 