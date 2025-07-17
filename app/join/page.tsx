"use client"

import { useState, useEffect } from "react"
import { MobileHeader } from "@/components/mobile-header"
import { Card, CardContent } from "@/components/ui/card"
import { ResponsiveButton } from "@/components/ui/responsive-button"
import { useRouter, useSearchParams } from "next/navigation"

export default function JoinSplitPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [token, setToken] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [splitInfo, setSplitInfo] = useState<any>(null)
  const [error, setError] = useState("")

  useEffect(() => {
    // Check if token is provided in URL
    const urlToken = searchParams.get("token")
    if (urlToken) {
      setToken(urlToken)
      handleJoinSplit(urlToken)
    }
  }, [searchParams])

  const handleJoinSplit = async (tokenToUse: string = token) => {
    if (!tokenToUse.trim()) {
      setError("Please enter a valid token")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      // TODO: Implement token validation logic
      console.log("Joining split with token:", tokenToUse)
      
      // Simulate API call to validate token and get split info
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Mock split data (in real app, this would come from backend)
      const mockSplitInfo = {
        name: "Team Dinner",
        amount: "120.00",
        participants: "4",
        description: "Dinner at the new restaurant downtown",
        amountPerPerson: "30.00",
        creator: "0x1234...5678",
        participantsList: [
          { address: "0x1234...5678", paid: true, amount: "30.00" },
          { address: "0xabcd...efgh", paid: false, amount: "30.00" },
          { address: "0xijkl...mnop", paid: false, amount: "30.00" },
          { address: "You", paid: false, amount: "30.00" }
        ]
      }
      
      setSplitInfo(mockSplitInfo)
    } catch (error) {
      console.error("Error joining split:", error)
      setError("Invalid token or split not found")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <MobileHeader />

      <main className="container-fluid py-6 space-y-8">
        {/* Welcome Section */}
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-responsive-3xl font-bold mb-2">Join Existing Split</h1>
              <p className="text-responsive-base text-muted-foreground">
                Enter the split token to contribute your share
              </p>
            </div>
          </div>
        </section>

        {/* Join Split Form */}
        <section className="space-y-6">
          <Card className="border-2">
            <CardContent className="p-6">
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="text-xl font-semibold mb-2">Enter Split Token</h3>
                  <p className="text-sm text-muted-foreground">
                    Enter the token provided by the split creator
                  </p>
                </div>

                {/* Token Input */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Split Token</label>
                  <input
                    type="text"
                    value={token}
                    onChange={(e) => setToken(e.target.value.toUpperCase())}
                    placeholder="e.g., ABC123DEF456"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center font-mono"
                    disabled={isLoading}
                  />
                  {error && (
                    <p className="text-sm text-red-500 text-center">{error}</p>
                  )}
                </div>

                {/* Join Button */}
                <div className="pt-4">
                  <ResponsiveButton 
                    size="lg" 
                    className="w-full !bg-blue-600 !hover:bg-blue-700 !from-blue-600 !to-blue-600 hover:!from-blue-700 hover:!to-blue-700 !text-white"
                    onClick={() => handleJoinSplit()}
                    disabled={isLoading}
                  >
                    {isLoading ? "Validating Token..." : "Join Split"}
                  </ResponsiveButton>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Split Information Display */}
          {splitInfo && (
            <Card className="border-2">
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div className="text-center">
                    <h3 className="text-xl font-semibold mb-2">Split Details</h3>
                    <p className="text-sm text-muted-foreground">
                      Review the split information before contributing
                    </p>
                  </div>

                  {/* Split Info */}
                  <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                    <h4 className="font-medium text-gray-900">Expense Information</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Expense:</span>
                        <span className="font-medium">{splitInfo.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Amount:</span>
                        <span className="font-medium">${splitInfo.amount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">People:</span>
                        <span className="font-medium">{splitInfo.participants}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Your Share:</span>
                        <span className="font-medium text-green-600">${splitInfo.amountPerPerson}</span>
                      </div>
                    </div>
                  </div>

                  {/* Participants List */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-gray-900">Participants</h4>
                    <div className="space-y-2">
                      {splitInfo.participantsList.map((participant: any, index: number) => (
                        <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                          <span className="text-sm">{participant.address}</span>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium">${participant.amount}</span>
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              participant.paid 
                                ? "bg-green-100 text-green-700" 
                                : "bg-yellow-100 text-yellow-700"
                            }`}>
                              {participant.paid ? "Paid" : "Pending"}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Pay Button */}
                  <div className="pt-4">
                    <ResponsiveButton 
                      size="lg" 
                      className="w-full !bg-green-600 !hover:bg-green-700 !from-green-600 !to-green-600 hover:!from-green-700 hover:!to-green-700 !text-white"
                    >
                      Pay ${splitInfo.amountPerPerson}
                    </ResponsiveButton>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Card className="border-2">
            <CardContent className="p-4 sm:p-6 text-center">
              <div className="flex flex-col items-center space-y-4">
                <div>
                  <h3 className="text-lg font-semibold">Back to Home</h3>
                  <p className="text-sm text-muted-foreground">
                    Return to the main dashboard
                  </p>
                </div>
                <ResponsiveButton 
                  size="lg" 
                  className="w-full sm:w-auto !bg-gray-600 !hover:bg-gray-700 !from-gray-600 !to-gray-600 hover:!from-gray-700 hover:!to-gray-700 !text-white"
                  onClick={() => router.push("/")}
                >
                  Go Back
                </ResponsiveButton>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  )
} 