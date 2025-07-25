"use client"

import React, { useState } from 'react'
import { MobileHeader } from "@/components/mobile-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ReceiverPreferences } from "@/components/receiver-preferences"
import { EnhancedPaymentSelector } from "@/components/enhanced-payment-selector"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeftRight, Coins, Star, Users, Zap, Wallet } from "lucide-react"

export default function FlexiblePaymentDemoPage() {
  const [receiverPrefs, setReceiverPrefs] = useState({
    chainId: 1,
    tokenAddress: "0x0000000000000000000000000000000000000000",
    tokenSymbol: "ETH",
    tokenDecimals: 18
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <MobileHeader />

      <main className="container mx-auto px-4 py-6 space-y-8">
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2">
            <ArrowLeftRight className="h-8 w-8 text-blue-600" />
            <h1 className="text-4xl font-bold">Ultimate Payment Flexibility</h1>
            <Badge variant="default" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
              <Star className="h-3 w-3 mr-1" />
              Revolutionary
            </Badge>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Both payers and receivers can choose their preferred tokens and networks. 
            True cross-chain flexibility for everyone in your split.
          </p>
        </div>

        {/* Key Features */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="border-2 border-blue-200">
            <CardContent className="p-6 text-center">
              <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Payer Choice</h3>
              <p className="text-muted-foreground">
                Pay with any token from any network. ETH, USDC, MATIC, DAI - you choose!
              </p>
            </CardContent>
          </Card>
          
          <Card className="border-2 border-green-200">
            <CardContent className="p-6 text-center">
              <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                <Wallet className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Receiver Choice</h3>
              <p className="text-muted-foreground">
                Receive in your preferred token on your favorite network. Set it once, get paid perfectly.
              </p>
            </CardContent>
          </Card>
          
          <Card className="border-2 border-purple-200">
            <CardContent className="p-6 text-center">
              <div className="h-16 w-16 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-4">
                <Zap className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Auto Conversion</h3>
              <p className="text-muted-foreground">
                Seamless cross-chain routing handles everything. No manual bridging or swapping needed.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Interactive Demo */}
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="text-center text-2xl">Try Both Perspectives</CardTitle>
            <p className="text-center text-muted-foreground">
              Experience how both split creators and payers interact with flexible token selection
            </p>
          </CardHeader>
          
          <CardContent>
            <Tabs defaultValue="receiver" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="receiver" className="flex items-center gap-2">
                  <Wallet className="h-4 w-4" />
                  Split Creator (Receiver)
                </TabsTrigger>
                <TabsTrigger value="payer" className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Participant (Payer)
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="receiver" className="mt-6">
                <div className="space-y-4">
                  <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                    <h3 className="font-semibold text-green-800">🎯 You're creating a split</h3>
                    <p className="text-sm text-green-700 mt-1">
                      Choose where and how you want to receive payments from your friends
                    </p>
                  </div>
                  
                  <ReceiverPreferences 
                    onPreferencesChange={setReceiverPrefs}
                    className="border-2"
                  />
                  
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h4 className="font-semibold text-blue-800 mb-2">What happens next:</h4>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• Your friends can pay from ANY network with ANY token</li>
                      <li>• You'll receive exactly {receiverPrefs.tokenSymbol} on {receiverPrefs.chainId === 1 ? 'Ethereum' : receiverPrefs.chainId === 137 ? 'Polygon' : receiverPrefs.chainId === 8453 ? 'Base' : 'Arbitrum'}</li>
                      <li>• Cross-chain conversion happens automatically</li>
                      <li>• No extra steps needed from you or your friends</li>
                    </ul>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="payer" className="mt-6">
                <div className="space-y-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h3 className="font-semibold text-blue-800">💰 You're paying a split</h3>
                    <p className="text-sm text-blue-700 mt-1">
                      Your friend wants to receive {receiverPrefs.tokenSymbol}. Choose how you want to pay!
                    </p>
                  </div>
                  
                  <EnhancedPaymentSelector
                    splitAmount="25.00"
                    creatorAddress="0x742dB4C4B2A4F5e9A4C4Baf37e4a5c35e8c1f0B8"
                    creatorChainId={receiverPrefs.chainId}
                    creatorTokenAddress={receiverPrefs.tokenAddress}
                    className="border-2"
                  />
                  
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <h4 className="font-semibold text-green-800 mb-2">The magic behind the scenes:</h4>
                    <ul className="text-sm text-green-700 space-y-1">
                      <li>• You can pay with whatever token you have</li>
                      <li>• LiFi finds the best route across 20+ bridges and DEXs</li>
                      <li>• Your friend gets exactly what they want</li>
                      <li>• Everyone's happy! 🎉</li>
                    </ul>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Real-World Scenarios */}
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Real-World Scenarios</CardTitle>
            <p className="text-center text-muted-foreground">
              See how this flexibility solves real problems
            </p>
          </CardHeader>
          
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">🍕 Group Dinner Split</h3>
                <div className="space-y-3">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm"><strong>Alice (Creator):</strong> "I want ETH on Ethereum"</p>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm"><strong>Bob:</strong> "I'll pay with MATIC from Polygon" ✅</p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <p className="text-sm"><strong>Carol:</strong> "I'll use USDC from Base" ✅</p>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <p className="text-sm"><strong>Dave:</strong> "I have DAI on Arbitrum" ✅</p>
                  </div>
                  <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                    <p className="text-sm font-medium">Result: Alice gets ETH, everyone pays with what they have!</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-lg">🏠 Vacation Rental Split</h3>
                <div className="space-y-3">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm"><strong>Mike (Creator):</strong> "I want USDC on Polygon (lower fees)"</p>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm"><strong>Sarah:</strong> "I'll pay with ETH from Ethereum" ✅</p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <p className="text-sm"><strong>Tom:</strong> "I have USDT on Arbitrum" ✅</p>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <p className="text-sm"><strong>Lisa:</strong> "I'll use USDC from Base" ✅</p>
                  </div>
                  <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                    <p className="text-sm font-medium">Result: Mike saves on fees, everyone pays conveniently!</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Technical Innovation */}
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-2">
          <CardHeader>
            <CardTitle className="text-center">Technical Innovation</CardTitle>
          </CardHeader>
          
          <CardContent>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold mb-3">🔧 How We Built This</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <Badge variant="outline" className="mt-0.5">1</Badge>
                    <span>Enhanced split creation with receiver preferences</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Badge variant="outline" className="mt-0.5">2</Badge>
                    <span>Dynamic token selection for payers with real-time balances</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Badge variant="outline" className="mt-0.5">3</Badge>
                    <span>LiFi SDK integration for optimal routing</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Badge variant="outline" className="mt-0.5">4</Badge>
                    <span>Seamless UX that hides complexity</span>
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold mb-3">🚀 What This Enables</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <Badge variant="secondary" className="mt-0.5">✨</Badge>
                    <span>First truly flexible Web3 payment splitting</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Badge variant="secondary" className="mt-0.5">🌍</Badge>
                    <span>Global accessibility across all major chains</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Badge variant="secondary" className="mt-0.5">💸</Badge>
                    <span>Optimized fees and execution times</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Badge variant="secondary" className="mt-0.5">🎯</Badge>
                    <span>Perfect for both crypto natives and newcomers</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
