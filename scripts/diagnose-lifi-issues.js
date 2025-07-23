import dotenv from 'dotenv'

// Configuración de LiFi (simulada para el script)
const LIFI_CONFIG = {
  apiKey: process.env.NEXT_PUBLIC_LIFI_API_KEY || 'your-api-key-here'
}

const API_KEY = process.env.NEXT_PUBLIC_LIFI_API_KEY || LIFI_CONFIG.apiKey

console.log('🔍 Diagnóstico de problemas con LiFi...\n')

// Casos de prueba para diagnosticar problemas
const testCases = [
  {
    name: 'USDC Polygon → USDT Ethereum',
    params: {
      fromChain: 137,
      toChain: 1,
      fromToken: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174', // USDC Polygon
      toToken: '0xdAC17F958D2ee523a2206206994597C13D831ec7', // USDT Ethereum
      fromAmount: '1000000', // 1 USDC (6 decimales)
      fromAddress: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
      toAddress: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045'
    }
  },
  {
    name: 'ETH Base → ETH Ethereum',
    params: {
      fromChain: 8453,
      toChain: 1,
      fromToken: '0x0000000000000000000000000000000000000000',
      toToken: '0x0000000000000000000000000000000000000000',
      fromAmount: '100000000000000000', // 0.1 ETH
      fromAddress: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
      toAddress: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045'
    }
  },
  {
    name: 'USDC Arbitrum → USDT Polygon',
    params: {
      fromChain: 42161,
      toChain: 137,
      fromToken: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831', // USDC Arbitrum
      toToken: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F', // USDT Polygon
      fromAmount: '1000000', // 1 USDC
      fromAddress: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
      toAddress: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045'
    }
  },
  {
    name: 'MNT Mantle → ETH Ethereum',
    params: {
      fromChain: 5000,
      toChain: 1,
      fromToken: '0xDeadDeAddeAddEAddeadDEaDDEAdDeaDDeAD0000', // MNT Mantle
      toToken: '0x0000000000000000000000000000000000000000',
      fromAmount: '1000000000000000000', // 1 MNT
      fromAddress: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
      toAddress: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045'
    }
  }
]

async function testLifiQuote(params, testName) {
  console.log(`📋 ${testName}`)
  
  const queryParams = new URLSearchParams({
    fromChain: params.fromChain.toString(),
    toChain: params.toChain.toString(),
    fromToken: params.fromToken,
    toToken: params.toToken,
    fromAmount: params.fromAmount,
    fromAddress: params.fromAddress,
    toAddress: params.toAddress
  })

  const url = `https://li.quest/v1/quote?${queryParams.toString()}`
  
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        'x-lifi-api-key': API_KEY
      }
    })

    if (response.ok) {
      const data = await response.json()
      console.log(`  ✅ Funciona: ${data.toolDetails?.name || data.tool}`)
      console.log(`     • Cantidad origen: ${data.action.fromAmount} (${data.action.fromToken.symbol})`)
      console.log(`     • Cantidad destino: ${data.estimate.toAmount} (${data.action.toToken.symbol})`)
      console.log(`     • Costo gas: $${data.estimate.gasCosts?.[0]?.amountUSD || '0'}`)
      console.log(`     • Duración: ${data.estimate.executionDuration}s`)
      console.log(`     • Valor USD: $${data.estimate.fromAmountUSD} → $${data.estimate.toAmountUSD}`)
      return { success: true, data }
    } else {
      const errorData = await response.json()
      console.log(`  ❌ Error ${response.status}: ${errorData.message}`)
      
      // Mostrar detalles del error si están disponibles
      if (errorData.errors) {
        if (errorData.errors.filteredOut) {
          console.log(`     • Rutas filtradas: ${errorData.errors.filteredOut.length}`)
        }
        if (errorData.errors.failed) {
          console.log(`     • Rutas fallidas: ${errorData.errors.failed.length}`)
          // Mostrar algunos errores específicos
          errorData.errors.failed.slice(0, 3).forEach((error, index) => {
            console.log(`       ${index + 1}. ${error.message || 'Error desconocido'}`)
          })
        }
      }
      
      return { success: false, error: errorData }
    }
  } catch (error) {
    console.log(`  ❌ Error de red: ${error.message}`)
    return { success: false, error: error.message }
  }
}

async function diagnoseIssues() {
  console.log('🔧 Probando diferentes escenarios de LiFi...\n')
  
  let successCount = 0
  let totalTests = testCases.length
  
  for (const testCase of testCases) {
    const result = await testLifiQuote(testCase.params, testCase.name)
    if (result.success) {
      successCount++
    }
    console.log('') // Línea en blanco entre pruebas
  }
  
  console.log('📊 Resumen del diagnóstico:')
  console.log(`✅ Casos exitosos: ${successCount}/${totalTests}`)
  console.log(`❌ Casos fallidos: ${totalTests - successCount}/${totalTests}`)
  
  if (successCount === 0) {
    console.log('\n🚨 PROBLEMAS CRÍTICOS DETECTADOS:')
    console.log('• Ninguna ruta funciona - posible problema con:')
    console.log('  - API Key inválida o expirada')
    console.log('  - Configuración de tokens incorrecta')
    console.log('  - Redes no soportadas')
    console.log('  - Montos muy pequeños o muy grandes')
  } else if (successCount < totalTests) {
    console.log('\n⚠️ PROBLEMAS PARCIALES DETECTADOS:')
    console.log('• Algunas rutas funcionan, otras no')
    console.log('• Posibles causas:')
    console.log('  - Tokens específicos no soportados')
    console.log('  - Redes con liquidez limitada')
    console.log('  - Montos fuera del rango aceptable')
  } else {
    console.log('\n🎉 TODAS LAS PRUEBAS EXITOSAS!')
    console.log('• La integración de LiFi está funcionando correctamente')
  }
  
  console.log('\n💡 Recomendaciones:')
  console.log('• Verificar que la API Key sea válida y tenga permisos suficientes')
  console.log('• Revisar las direcciones de tokens en la configuración')
  console.log('• Probar con montos diferentes si las rutas fallan')
  console.log('• Consultar la documentación de LiFi para casos específicos')
}

// Ejecutar diagnóstico
diagnoseIssues().catch(console.error) 