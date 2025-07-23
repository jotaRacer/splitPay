import dotenv from 'dotenv'

// Cargar variables de entorno
dotenv.config({ path: '.env.local' })

console.log('🔍 Verificando API Key de LiFi...\n')

const apiKey = process.env.NEXT_PUBLIC_LIFI_API_KEY

if (!apiKey) {
  console.log('❌ No se encontró NEXT_PUBLIC_LIFI_API_KEY en .env.local')
  console.log('💡 Asegúrate de que el archivo .env.local contenga:')
  console.log('   NEXT_PUBLIC_LIFI_API_KEY=tu-api-key-aqui')
} else {
  console.log('✅ API Key encontrada')
  console.log(`📋 Longitud: ${apiKey.length} caracteres`)
  console.log(`🔑 Primeros 10 caracteres: ${apiKey.substring(0, 10)}...`)
  console.log(`🔑 Últimos 10 caracteres: ...${apiKey.substring(apiKey.length - 10)}`)
  
  // Probar la API Key con una petición simple
  console.log('\n🧪 Probando API Key...')
  
  fetch('https://li.quest/v1/chains', {
    headers: {
      'x-lifi-api-key': apiKey
    }
  })
  .then(response => {
    if (response.ok) {
      console.log('✅ API Key válida - Petición exitosa')
    } else {
      console.log(`❌ API Key inválida - Error ${response.status}`)
    }
  })
  .catch(error => {
    console.log(`❌ Error de red: ${error.message}`)
  })
} 