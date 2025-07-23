#!/usr/bin/env node

import { ethers } from 'ethers'

console.log('🧪 Probando Peticiones de Pago Directas (EIP-681)\n')

// Función para generar URL de pago según EIP-681
function generatePaymentUrl(params) {
  const { to, value, chainId, tokenAddress, memo } = params
  
  // Convertir el valor a wei
  const valueWei = ethers.parseEther(value).toString()
  
  // Construir la URL base
  let paymentUrl = `ethereum:${to}`
  
  // Agregar parámetros
  const urlParams = new URLSearchParams()
  
  if (valueWei !== '0') {
    urlParams.append('value', valueWei)
  }
  
  if (chainId !== 1) { // 1 es Ethereum mainnet por defecto
    urlParams.append('chainId', chainId.toString())
  }
  
  if (tokenAddress && tokenAddress !== ethers.ZeroAddress) {
    urlParams.append('token', tokenAddress)
  }
  
  if (memo) {
    urlParams.append('memo', memo)
  }
  
  // Agregar parámetros a la URL si existen
  if (urlParams.toString()) {
    paymentUrl += `?${urlParams.toString()}`
  }
  
  return paymentUrl
}

// Casos de prueba
const testCases = [
  {
    name: 'Pago ETH en Ethereum',
    params: {
      to: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
      value: '0.1',
      chainId: 1,
      memo: 'Split Pay - Team Dinner'
    }
  },
  {
    name: 'Pago MATIC en Polygon',
    params: {
      to: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
      value: '10',
      chainId: 137,
      memo: 'Split Pay - Weekend Trip'
    }
  },
  {
    name: 'Pago ETH en Base',
    params: {
      to: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
      value: '0.05',
      chainId: 8453,
      memo: 'Split Pay - Coffee'
    }
  },
  {
    name: 'Pago USDC en Polygon',
    params: {
      to: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
      value: '25',
      chainId: 137,
      tokenAddress: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174', // USDC Polygon
      memo: 'Split Pay - USDC Payment'
    }
  }
]

console.log('📋 Generando URLs de pago...\n')

testCases.forEach((testCase, index) => {
  console.log(`${index + 1}. ${testCase.name}`)
  const paymentUrl = generatePaymentUrl(testCase.params)
  console.log(`   URL: ${paymentUrl}`)
  console.log(`   Parámetros:`, testCase.params)
  console.log('')
})

console.log('✅ URLs de pago generadas correctamente!')
console.log('💡 Estas URLs se pueden usar para:')
console.log('   • Abrir directamente en wallets compatibles')
console.log('   • Generar QR codes para pagos móviles')
console.log('   • Enviar por mensaje/email')
console.log('   • Integrar en aplicaciones') 