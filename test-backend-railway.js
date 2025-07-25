const axios = require('axios');

const BACKEND_URL = 'https://respectful-forgiveness-production.up.railway.app';

async function testBackend() {
  console.log('🧪 Testing SplitPay Backend on Railway...\n');
  
  try {
    // Test 1: Health Check
    console.log('1️⃣ Testing Health Check...');
    const healthResponse = await axios.get(`${BACKEND_URL}/health`);
    
    if (healthResponse.status === 200) {
      console.log('✅ Health Check PASSED');
      console.log('   Response:', healthResponse.data);
    } else {
      console.log('❌ Health Check FAILED');
      console.log('   Status:', healthResponse.status);
      console.log('   Response:', healthResponse.data);
    }
    
    console.log('');
    
    // Test 2: API Base URL
    console.log('2️⃣ Testing API Base URL...');
    try {
      const apiResponse = await axios.get(`${BACKEND_URL}/api/splits`);
      console.log('✅ API Base URL PASSED');
      console.log('   Response:', apiResponse.data);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        console.log('✅ API Base URL PASSED (404 expected for GET without parameters)');
      } else {
        console.log('❌ API Base URL FAILED');
        console.log('   Status:', error.response?.status);
        console.log('   Error:', error.message);
      }
    }
    
    console.log('');
    
    // Test 3: CORS Headers
    console.log('3️⃣ Testing CORS Headers...');
    try {
      const corsResponse = await axios.options(`${BACKEND_URL}/health`, {
        headers: {
          'Origin': 'https://splitpay-frontend.vercel.app',
          'Access-Control-Request-Method': 'GET',
          'Access-Control-Request-Headers': 'Content-Type'
        }
      });
      
      const corsHeaders = corsResponse.headers;
      const hasCors = corsHeaders['access-control-allow-origin'];
      
      if (hasCors) {
        console.log('✅ CORS Headers PASSED');
        console.log('   Access-Control-Allow-Origin:', hasCors);
      } else {
        console.log('❌ CORS Headers FAILED');
        console.log('   No CORS headers found');
      }
    } catch (error) {
      console.log('❌ CORS Headers FAILED');
      console.log('   Error:', error.message);
    }
    
    console.log('');
    
    // Test 4: Create Split (should fail without proper data)
    console.log('4️⃣ Testing Create Split (expected to fail without data)...');
    try {
      const createResponse = await axios.post(`${BACKEND_URL}/api/splits/create`, {});
      console.log('❌ Create Split FAILED (should have rejected empty data)');
      console.log('   Status:', createResponse.status);
    } catch (error) {
      if (error.response && (error.response.status === 400 || error.response.status === 422)) {
        console.log('✅ Create Split PASSED (properly rejected invalid data)');
        console.log('   Response:', error.response.data);
      } else {
        console.log('❌ Create Split FAILED');
        console.log('   Status:', error.response?.status);
        console.log('   Error:', error.message);
      }
    }
    
    console.log('');
    console.log('🎉 Backend testing completed!');
    
  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
    console.error('   This might indicate the backend is not running or not accessible');
  }
}

// Run the test
testBackend(); 