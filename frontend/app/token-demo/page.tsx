"use client"

import React from 'react'
import { MobileHeader } from "@/components/mobile-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { EnhancedPaymentSelector } from "@/components/enhanced-payment-selector"
import { Badge } from "@/components/ui/badge"
import { Coins, Star, Zap } from "lucide-react"

export default function PaymentDemoPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <MobileHeader />

      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2">
            <Coins className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold">Token Payment Demo</h1>
            <Badge variant="secondary" className="bg-green-100 text-green-700">
              <Star className="h-3 w-3 mr-1" />
              New Feature
            </Badge>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Choose from multiple tokens across different blockchains to pay your split. 
            Our cross-chain technology automatically handles the conversion and routing.
          </p>
        </div>

        {/* Feature Highlights */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-3">
                <Coins className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold">Multiple Tokens</h3>
              <p className="text-sm text-muted-foreground">
                Pay with ETH, USDC, USDT, DAI, MATIC and more
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-3">
                <Zap className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold">Cross-Chain</h3>
              <p className="text-sm text-muted-foreground">
                Pay from any chain to any chain seamlessly
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-3">
                <Star className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-semibold">Best Routes</h3>
              <p className="text-sm text-muted-foreground">
                Automatically finds the cheapest and fastest route
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Demo Payment Selector */}
        <div className="max-w-2xl mx-auto">
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="text-center">Try It Out - Demo Payment</CardTitle>
              <p className="text-sm text-muted-foreground text-center">
                This is a demo showing how users can select their preferred payment token
              </p>
            </CardHeader>
            <CardContent>
              <EnhancedPaymentSelector
                splitAmount="25.00"
                creatorAddress="0x742dB4C4B2A4F5e9A4C4Baf37e4a5c35e8c1f0B8"
                creatorChainId={1} // Ethereum mainnet
                creatorTokenAddress="0x0000000000000000000000000000000000000000" // ETH
                className="w-full"
              />
            </CardContent>
          </Card>
        </div>

        {/* Supported Networks */}
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="text-center">Supported Networks & Tokens</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <h4 className="font-semibold text-blue-600">Ethereum</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>ETH</span>
                    <Badge variant="outline">Native</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>USDC</span>
                    <Badge variant="outline">ERC20</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>USDT</span>
                    <Badge variant="outline">ERC20</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>DAI</span>
                    <Badge variant="outline">ERC20</Badge>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold text-purple-600">Polygon</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>MATIC</span>
                    <Badge variant="outline">Native</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>USDC</span>
                    <Badge variant="outline">ERC20</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>USDT</span>
                    <Badge variant="outline">ERC20</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>DAI</span>
                    <Badge variant="outline">ERC20</Badge>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold text-blue-500">Base</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>ETH</span>
                    <Badge variant="outline">Native</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>USDC</span>
                    <Badge variant="outline">ERC20</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>DAI</span>
                    <Badge variant="outline">ERC20</Badge>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold text-blue-400">Arbitrum</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>ETH</span>
                    <Badge variant="outline">Native</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>USDC</span>
                    <Badge variant="outline">ERC20</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>USDT</span>
                    <Badge variant="outline">ERC20</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>DAI</span>
                    <Badge variant="outline">ERC20</Badge>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* How It Works */}
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="text-center">How Token Selection Works</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div className="space-y-3">
                <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto">
                  <span className="text-2xl font-bold text-blue-600">1</span>
                </div>
                <h3 className="font-semibold">Choose Your Token</h3>
                <p className="text-sm text-muted-foreground">
                  Select from your available tokens across different networks. 
                  Real-time balance checking ensures you have enough funds.
                </p>
              </div>

              <div className="space-y-3">
                <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mx-auto">
                  <span className="text-2xl font-bold text-green-600">2</span>
                </div>
                <h3 className="font-semibold">Best Route Found</h3>
                <p className="text-sm text-muted-foreground">
                  Our system finds the optimal route with lowest fees and fastest execution 
                  across 20+ bridges and DEXs.
                </p>
              </div>

              <div className="space-y-3">
                <div className="h-16 w-16 rounded-full bg-purple-100 flex items-center justify-center mx-auto">
                  <span className="text-2xl font-bold text-purple-600">3</span>
                </div>
                <h3 className="font-semibold">Payment Executed</h3>
                <p className="text-sm text-muted-foreground">
                  Cross-chain payment is executed automatically. 
                  The recipient gets their preferred token on their chosen network.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
