"use client"

import { WalletConnect } from "@/components/wallet-connect"
import { PrivyWalletConnect } from "@/components/privy-wallet-connect"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

export default function PrivyDemo() {
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Split Pay - Privy Integration Demo</h1>
          <p className="text-muted-foreground">
            Compare the old Web3 connection vs new Privy integration
          </p>
          <div className="flex justify-center space-x-2">
            <Badge variant="secondary">Old: MetaMask only</Badge>
            <Badge variant="default">New: Wallet + Email + Social</Badge>
          </div>
        </div>

        <Separator />

        {/* Comparison Section */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Old Web3 Provider */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span>🔧 Old Web3 Connection</span>
                <Badge variant="outline">Current</Badge>
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Traditional MetaMask/Web3 wallet connection
              </p>
            </CardHeader>
            <CardContent>
              <WalletConnect />
              
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-sm mb-2">Limitations:</h4>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• Requires users to have crypto wallet</li>
                  <li>• Complex setup for new users</li>
                  <li>• Limited to wallet connections only</li>
                  <li>• Poor mobile experience</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* New Privy Provider */}
          <Card className="border-2 border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span>✨ New Privy Integration</span>
                <Badge variant="default">Recommended</Badge>
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Modern authentication with multiple login options
              </p>
            </CardHeader>
            <CardContent>
              <PrivyWalletConnect />
              
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-sm mb-2">Benefits:</h4>
                <ul className="text-xs text-blue-700 space-y-1">
                  <li>• Email login for non-crypto users</li>
                  <li>• Social login (Google, Twitter)</li>
                  <li>• Better mobile wallet support</li>
                  <li>• Progressive onboarding</li>
                  <li>• Embedded wallet creation</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Features Comparison */}
        <Card>
          <CardHeader>
            <CardTitle>Feature Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div>
                <h4 className="font-medium mb-2">Authentication Methods</h4>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span>Wallet Connection</span>
                    <div className="space-x-1">
                      <Badge variant="outline" className="text-xs">Old ✓</Badge>
                      <Badge variant="default" className="text-xs">New ✓</Badge>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span>Email Login</span>
                    <div className="space-x-1">
                      <Badge variant="secondary" className="text-xs">Old ✗</Badge>
                      <Badge variant="default" className="text-xs">New ✓</Badge>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span>Social Login</span>
                    <div className="space-x-1">
                      <Badge variant="secondary" className="text-xs">Old ✗</Badge>
                      <Badge variant="default" className="text-xs">New ✓</Badge>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">User Experience</h4>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span>Mobile Optimized</span>
                    <div className="space-x-1">
                      <Badge variant="secondary" className="text-xs">Old ✗</Badge>
                      <Badge variant="default" className="text-xs">New ✓</Badge>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span>Progressive Onboarding</span>
                    <div className="space-x-1">
                      <Badge variant="secondary" className="text-xs">Old ✗</Badge>
                      <Badge variant="default" className="text-xs">New ✓</Badge>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span>Error Handling</span>
                    <div className="space-x-1">
                      <Badge variant="outline" className="text-xs">Old Basic</Badge>
                      <Badge variant="default" className="text-xs">New Advanced</Badge>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Target Audience</h4>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span>Crypto Users</span>
                    <div className="space-x-1">
                      <Badge variant="default" className="text-xs">Old ✓</Badge>
                      <Badge variant="default" className="text-xs">New ✓</Badge>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span>Mainstream Users</span>
                    <div className="space-x-1">
                      <Badge variant="secondary" className="text-xs">Old ✗</Badge>
                      <Badge variant="default" className="text-xs">New ✓</Badge>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span>Mobile Users</span>
                    <div className="space-x-1">
                      <Badge variant="secondary" className="text-xs">Old Limited</Badge>
                      <Badge variant="default" className="text-xs">New ✓</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card className="bg-green-50 border-green-200">
          <CardHeader>
            <CardTitle className="text-green-800">🚀 Ready to Integrate?</CardTitle>
          </CardHeader>
          <CardContent className="text-green-700">
            <div className="space-y-2 text-sm">
              <p><strong>Step 1:</strong> Get your Privy App ID from <a href="https://dashboard.privy.io" target="_blank" className="underline">dashboard.privy.io</a></p>
              <p><strong>Step 2:</strong> Add it to your <code className="bg-green-100 px-1 rounded">.env.local</code> file</p>
              <p><strong>Step 3:</strong> Replace the old Web3Provider with PrivyWeb3Provider in layout.tsx</p>
              <p><strong>Step 4:</strong> Update components to use the new Privy context</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
