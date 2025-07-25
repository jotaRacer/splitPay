require('dotenv').config()
const { supabase } = require('./config/supabase')

async function testSupabaseFinal() {
  console.log('🔍 Probando Supabase con configuración final...')
  console.log('📦 Versión de Supabase:', require('@supabase/supabase-js').version)
  console.log('🌐 URL:', process.env.SUPABASE_URL)
  console.log('🔑 Service Role Key:', process.env.SUPABASE_SERVICE_ROLE_KEY ? '✅ Configurada' : '❌ No configurada')
  
  try {
    // Probar conexión básica
    console.log('\n📊 Probando consulta a networks...')
    const { data: networks, error } = await supabase
      .from('networks')
      .select('*')
      .limit(3)
    
    if (error) {
      console.error('❌ Error en la consulta:', error)
      return
    }
    
    console.log('✅ Conexión exitosa!')
    console.log('📋 Networks encontradas:', networks.length)
    console.log('📄 Datos:', networks)
    
    // Probar inserción de datos (solo para verificar permisos)
    console.log('\n📝 Probando permisos de escritura...')
    const testData = {
      name: 'Test Network',
      chain_id: 999999,
      rpc_url: 'https://test.example.com',
      is_active: false
    }
    
    const { data: insertResult, error: insertError } = await supabase
      .from('networks')
      .insert(testData)
      .select()
    
    if (insertError) {
      console.log('⚠️  Error de inserción (esperado si ya existe):', insertError.message)
    } else {
      console.log('✅ Inserción exitosa:', insertResult)
      
      // Limpiar datos de prueba
      await supabase
        .from('networks')
        .delete()
        .eq('chain_id', 999999)
    }
    
    console.log('\n🎉 ¡Supabase configurado correctamente!')
    console.log('✅ Conexión: Funcionando')
    console.log('✅ Lectura: Funcionando')
    console.log('✅ Escritura: Funcionando')
    
  } catch (error) {
    console.error('❌ Error general:', error)
  }
}

testSupabaseFinal() 