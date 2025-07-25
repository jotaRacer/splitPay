import { NextResponse } from 'next/server'

export async function GET() {
  const envVars = {
    lifiApiKey: process.env.NEXT_PUBLIC_LIFI_API_KEY ? '✅ Set' : '❌ Missing',
    infuraKey: process.env.NEXT_PUBLIC_INFURA_KEY ? '✅ Set' : '❌ Missing',
    ethereumRpc: process.env.NEXT_PUBLIC_RPC_URL_ETHEREUM ? '✅ Set' : '❌ Missing',
    walletConnectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ? '✅ Set' : '❌ Missing'
  }
  
  return NextResponse.json({
    message: 'Environment Variables Status',
    status: envVars,
    timestamp: new Date().toISOString()
  })
}
