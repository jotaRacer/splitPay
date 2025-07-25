"use client"

import { useState } from "react"
import { EnhancedPaymentSelector } from "@/components/enhanced-payment-selector"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { usePrivyWeb3 } from "@/contexts/privy-context"

export default function TestPaymentPage() {
  const { isConnected, account, connect, getProvider, getSigner } = usePrivyWeb3()
  const [testAmount, setTestAmount] = useState("10")

  const mockSplitData = {
    splitAmount: testAmount,
    creatorAddress: "0x742d35Cc6639C0532fCe9ff6e31C8e5F5b1e4e50", // Test address
    creatorChainId: 1, // Ethereum
    creatorTokenAddress: "0xA0b86a33E6441a8C606Bc4BD7b2cE1A6A4bB7E60", // USDC on Ethereum
    description: "Test payment for development",
    participants: ["Test Participant"]
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-md mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>🧪 Test Payment System</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-gray-600 mb-2">
                This page is for testing the payment functionality
              </p>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium mb-1">Test Amount</label>
                  <input
                    type="number"
                    value={testAmount}
                    onChange={(e) => setTestAmount(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="Enter amount to test"
                  />
                </div>
                
                <div className="text-xs text-gray-500 space-y-1">
                  <p><strong>Receiver:</strong> {mockSplitData.creatorAddress.slice(0, 8)}...</p>
                  <p><strong>Network:</strong> Ethereum (Chain ID: {mockSplitData.creatorChainId})</p>
                  <p><strong>Token:</strong> USDC</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {!isConnected ? (
          <Card>
            <CardContent className="p-6 text-center">
              <h3 className="text-lg font-semibold mb-2">Connect Your Wallet</h3>
              <p className="text-gray-600 mb-4">
                Connect your wallet to test payments
              </p>
              <Button onClick={connect} className="w-full">
                Connect Wallet
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            <Card>
              <CardContent className="p-4">
                <p className="text-sm text-green-600">
                  ✅ Wallet Connected: {account?.slice(0, 6)}...{account?.slice(-4)}
                </p>
              </CardContent>
            </Card>

            <EnhancedPaymentSelector
              splitAmount={testAmount}
              creatorAddress={mockSplitData.creatorAddress}
              creatorChainId={mockSplitData.creatorChainId}
              creatorTokenAddress={mockSplitData.creatorTokenAddress}
              className="w-full"
            />

            {/* Simple wallet test button */}
            <Card>
              <CardContent className="p-4">
                <h4 className="font-medium mb-2">🔧 Direct Wallet Test</h4>
                <Button 
                  onClick={async () => {
                    try {
                      console.log('Testing wallet connection...')
                      
                      // This should prompt the wallet
                      const provider = await getProvider()
                      const signer = await getSigner()
                      
                      if (signer) {
                        console.log('✅ Signer obtained successfully!')
                        alert('Wallet is connected and working!')
                      } else {
                        console.log('❌ Could not get signer')
                        alert('Could not get wallet signer')
                      }
                    } catch (error: any) {
                      console.error('Wallet test failed:', error)
                      alert('Wallet test failed: ' + error.message)
                    }
                  }}
                  className="w-full mb-2"
                  variant="outline"
                >
                  Test Wallet Connection
                </Button>
                <p className="text-xs text-gray-500">
                  This button tests if wallet signing works directly
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        <Card>
          <CardContent className="p-4">
            <h4 className="font-medium mb-2">🔍 Debug Instructions</h4>
            <div className="text-xs text-gray-600 space-y-1">
              <p>1. Open browser developer tools (F12)</p>
              <p>2. Go to Console tab</p>
              <p>3. Connect wallet and select payment options</p>
              <p>4. Click "Pay" - should prompt wallet for signature</p>
              <p>5. Check console for detailed logs</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
