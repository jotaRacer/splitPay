"use client"

import { useState, useEffect } from "react"
import { MobileHeader } from "@/components/mobile-header"
import { Card, CardContent } from "@/components/ui/card"
import { ResponsiveButton } from "@/components/ui/responsive-button"
import { useRouter, useSearchParams } from "next/navigation"
import { Copy, Share2, Check } from "lucide-react"

export default function SuccessPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [copied, setCopied] = useState(false)
  const [token, setToken] = useState("")
  const [splitData, setSplitData] = useState({
    name: "",
    amount: "",
    participants: "",
    description: ""
  })

  useEffect(() => {
    console.log("Success page loaded, URL params:", searchParams.toString())
    
    // Generate a random token (in real app, this would come from backend)
    const generatedToken = generateToken()
    console.log("Generated token:", generatedToken)
    setToken(generatedToken)
    
    // Get split data from URL params (in real app, this would come from backend)
    const name = searchParams.get("name") || "Team Dinner"
    const amount = searchParams.get("amount") || "100.00"
    const participants = searchParams.get("participants") || "4"
    const description = searchParams.get("description") || ""
    
    console.log("Split data from URL:", { name, amount, participants, description })
    setSplitData({ name, amount, participants, description })
    
    console.log("Success page state set, token should be visible")
  }, [searchParams])

  const generateToken = () => {
    // Generate a random 12-character token
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
    let result = ""
    for (let i = 0; i < 12; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(token)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy: ", err)
    }
  }

  const shareToken = () => {
    const shareText = `Join my SplitPay expense: ${splitData.name}\n\nToken: ${token}\n\nAmount per person: $${(parseFloat(splitData.amount) / parseInt(splitData.participants)).toFixed(2)}`
    
    if (navigator.share) {
      navigator.share({
        title: "SplitPay Invitation",
        text: shareText,
        url: `${window.location.origin}/join?token=${token}`
      })
    } else {
      copyToClipboard()
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <MobileHeader />

      <main className="container-fluid py-6 space-y-8">
        {/* Success Header */}
        <section className="text-center space-y-4">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <div>
              <h1 className="text-responsive-3xl font-bold mb-2">Split Created Successfully!</h1>
              <p className="text-responsive-base text-muted-foreground">
                Your payment has been processed and the split token has been generated
              </p>
            </div>
          </div>
        </section>

        {/* Token Display */}
        <section className="space-y-6">
          <Card className="border-2">
            <CardContent className="p-6">
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="text-xl font-semibold mb-2">Share Your Split Token</h3>
                  <p className="text-sm text-muted-foreground">
                    Share this token with others so they can join and pay their share
                  </p>
                </div>

                {/* Token */}
                <div className="space-y-3">
                  <label className="text-sm font-medium">Split Token</label>
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 bg-gray-100 p-4 rounded-lg font-mono text-lg text-center">
                      {token ? (
                        <span className="text-blue-600 font-bold">{token}</span>
                      ) : (
                        <span className="text-gray-500">Generating token...</span>
                      )}
                    </div>
                    <ResponsiveButton
                      size="sm"
                      onClick={copyToClipboard}
                      disabled={!token}
                      className="!bg-gray-600 !hover:bg-gray-700 !from-gray-600 !to-gray-600 hover:!from-gray-700 hover:!to-gray-700 !text-white"
                    >
                      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </ResponsiveButton>
                  </div>
                  {copied && (
                    <p className="text-sm text-green-600 text-center">Token copied to clipboard!</p>
                  )}
                  {!token && (
                    <p className="text-sm text-gray-500 text-center">Please wait while we generate your unique token...</p>
                  )}
                </div>

                {/* Split Details */}
                <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                  <h4 className="font-medium text-gray-900">Split Details</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Expense:</span>
                      <span className="font-medium">{splitData.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Amount:</span>
                      <span className="font-medium">${parseFloat(splitData.amount).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">People:</span>
                      <span className="font-medium">{splitData.participants}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Each Person Pays:</span>
                      <span className="font-medium">
                        ${((parseFloat(splitData.amount) / parseInt(splitData.participants)) || 0).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <ResponsiveButton
                    size="lg"
                    onClick={shareToken}
                    className="w-full !bg-blue-600 !hover:bg-blue-700 !from-blue-600 !to-blue-600 hover:!from-blue-700 hover:!to-blue-700 !text-white"
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    Share Token
                  </ResponsiveButton>
                  
                  <ResponsiveButton
                    size="lg"
                    onClick={() => router.push("/")}
                    className="w-full !bg-gray-600 !hover:bg-gray-700 !from-gray-600 !to-gray-600 hover:!from-gray-700 hover:!to-gray-700 !text-white"
                  >
                    Back to Home
                  </ResponsiveButton>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  )
}
