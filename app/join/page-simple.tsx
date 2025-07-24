"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function JoinSplitPage() {
  const [token, setToken] = useState("")

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-3">Join Split Payment</h1>
            <p className="text-lg text-gray-600">
              Enter your split token to join and pay your share
            </p>
          </div>

          <Card className="border-2">
            <CardHeader>
              <CardTitle>Enter Split Token</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <label className="block text-sm font-medium">
                  Split Token or Share URL
                </label>
                <input
                  type="text"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  placeholder="Enter split token (e.g., SPLIT-ABC123-XYZ)"
                  className="w-full px-3 py-2 border rounded-lg text-lg py-3"
                />
              </div>

              <Button 
                onClick={() => console.log("Join split with token:", token)}
                disabled={!token.trim()}
                size="lg"
                className="w-full"
              >
                Find & Join Split
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
