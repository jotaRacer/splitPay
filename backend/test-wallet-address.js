require('dotenv').config()
const { supabase } = require('./config/supabase')

async function testWalletAddress() {
  console.log('🔍 Probando columna wallet_address...')
  
  try {
    // Intentar insertar un usuario con wallet_address
    const testUser = {
      email: 'test-wallet@example.com',
      name: 'Test Wallet User',
      wallet_address: '0x1234567890123456789012345678901234567890'
    }
    
    const { data: insertData, error: insertError } = await supabase
      .from('users')
      .insert(testUser)
      .select()
    
    if (insertError) {
      console.error('❌ Error al insertar usuario con wallet:', insertError)
      return
    }
    
    console.log('✅ Usuario con wallet insertado:', insertData)
    
    // Buscar por wallet_address
    const { data: searchData, error: searchError } = await supabase
      .from('users')
      .select('*')
      .eq('wallet_address', '0x1234567890123456789012345678901234567890')
      .single()
    
    if (searchError) {
      console.error('❌ Error al buscar por wallet:', searchError)
    } else {
      console.log('✅ Búsqueda por wallet exitosa:', searchData)
    }
    
    // Limpiar datos de prueba
    await supabase
      .from('users')
      .delete()
      .eq('email', 'test-wallet@example.com')
    
    console.log('🧹 Datos de prueba limpiados')
    
  } catch (error) {
    console.error('❌ Error general:', error)
  }
}

testWalletAddress() 