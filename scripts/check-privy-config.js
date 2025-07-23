#!/usr/bin/env node

console.log('🔍 Verificando configuración de Privy...\n');

// Verificar variables de entorno
const privyAppId = process.env.NEXT_PUBLIC_PRIVY_APP_ID;

console.log('📋 Configuración actual:');
console.log(`• NEXT_PUBLIC_PRIVY_APP_ID: ${privyAppId || 'NO CONFIGURADO'}`);

if (!privyAppId) {
  console.log('\n❌ PROBLEMA: No hay Privy App ID configurado');
  console.log('\n🔧 SOLUCIÓN:');
  console.log('1. Ve a https://dashboard.privy.io');
  console.log('2. Crea una nueva aplicación o usa una existente');
  console.log('3. Copia tu App ID');
  console.log('4. Crea un archivo .env.local en la raíz del proyecto con:');
  console.log('   NEXT_PUBLIC_PRIVY_APP_ID=tu-app-id-real-aqui');
  console.log('\n📝 Ejemplo de .env.local:');
  console.log('NEXT_PUBLIC_PRIVY_APP_ID=clt_abc123def456...');
  console.log('NEXT_PUBLIC_LIFI_API_KEY=tu-lifi-api-key');
  console.log('NEXT_PUBLIC_BACKEND_URL=http://localhost:3001');
} else if (privyAppId === 'your-privy-app-id' || privyAppId === 'your-privy-app-id-here') {
  console.log('\n❌ PROBLEMA: Privy App ID es un placeholder');
  console.log('\n🔧 SOLUCIÓN:');
  console.log('1. Ve a https://dashboard.privy.io');
  console.log('2. Crea una nueva aplicación o usa una existente');
  console.log('3. Copia tu App ID real');
  console.log('4. Actualiza el archivo .env.local');
} else {
  console.log('\n✅ Privy App ID configurado correctamente');
  console.log('• ID:', privyAppId);
  
  // Verificar formato básico
  if (privyAppId.startsWith('clt_')) {
    console.log('✅ Formato de ID válido (empieza con clt_)');
  } else {
    console.log('⚠️  Formato de ID inusual, verifica que sea correcto');
  }
}

console.log('\n📚 Recursos útiles:');
console.log('• Privy Dashboard: https://dashboard.privy.io');
console.log('• Privy Docs: https://docs.privy.io');
console.log('• Demo Page: http://localhost:3000/privy-demo (cuando esté configurado)'); 