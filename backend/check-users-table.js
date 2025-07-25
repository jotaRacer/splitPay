require('dotenv').config()
const { supabase } = require('./config/supabase')

async function checkUsersTable() {
  console.log('🔍 Verificando estructura de la tabla users...')
  
  try {
    // Intentar obtener información de la tabla
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .limit(1)
    
    if (error) {
      console.error('❌ Error al acceder a la tabla users:', error)
      return
    }
    
    console.log('✅ Tabla users accesible')
    console.log('📄 Estructura de datos:', data)
    
    // Intentar insertar un usuario de prueba
    const testUser = {
      email: 'test@example.com',
      name: 'Test User'
    }
    
    const { data: insertData, error: insertError } = await supabase
      .from('users')
      .insert(testUser)
      .select()
    
    if (insertError) {
      console.error('❌ Error al insertar usuario:', insertError)
    } else {
      console.log('✅ Usuario insertado correctamente:', insertData)
      
      // Limpiar usuario de prueba
      await supabase
        .from('users')
        .delete()
        .eq('email', 'test@example.com')
    }
    
  } catch (error) {
    console.error('❌ Error general:', error)
  }
}

checkUsersTable() 