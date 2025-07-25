const axios = require('axios');

const BACKEND_URL = 'https://respectful-forgiveness-production.up.railway.app';

async function testCORS() {
  console.log('🔍 Testing CORS configuration specifically...\n');
  
  const testOrigins = [
    'https://splitpay-frontend.vercel.app',
    'https://splitpay.vercel.app',
    'https://splitpay-git-main-jotaracer.vercel.app',
    'http://localhost:3000'
  ];
  
  for (const origin of testOrigins) {
    console.log(`Testing origin: ${origin}`);
    
    try {
      const response = await axios.options(`${BACKEND_URL}/health`, {
        headers: {
          'Origin': origin,
          'Access-Control-Request-Method': 'GET',
          'Access-Control-Request-Headers': 'Content-Type'
        }
      });
      
      const corsOrigin = response.headers['access-control-allow-origin'];
      console.log(`   CORS Origin: ${corsOrigin}`);
      
      if (corsOrigin === origin || corsOrigin === '*') {
        console.log(`   ✅ CORS PASSED for ${origin}`);
      } else {
        console.log(`   ❌ CORS FAILED for ${origin}`);
      }
      
    } catch (error) {
      console.log(`   ❌ Error testing ${origin}: ${error.message}`);
    }
    
    console.log('');
  }
}

testCORS(); 