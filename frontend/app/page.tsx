"use client"

import React, { memo, useCallback } from "react"
import { MobileHeader } from "@/components/mobile-header"
import { Card, CardContent } from "@/components/ui/card"
import { ResponsiveButton } from "@/components/ui/responsive-button"
import { PrivyWalletConnect } from "@/components/privy-wallet-connect"
import { useRouter } from "next/navigation"

// Memoize the entire page component for better performance
const HomePage = memo(function HomePage() {
  const router = useRouter()

  // Memoize navigation callbacks to prevent unnecessary re-renders
  const navigateToCreate = useCallback(() => router.push("/create"), [router])
  const navigateToJoin = useCallback(() => router.push("/join"), [router])

  return (
    <div className="min-h-screen bg-gray-50">
      <MobileHeader />

      <main className="container-fluid py-6 space-y-6">
        {/* Welcome Section */}
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-responsive-3xl font-bold mb-2">Welcome back!</h1>
              <p className="text-responsive-base text-muted-foreground">
                Manage your splits and contributions across chains
              </p>
            </div>
          </div>
          
          {/* Wallet Connection - Direct import for speed */}
          <PrivyWalletConnect />
        </section>

        {/* Core Actions */}
        <section className="text-center space-y-4">
          <Card className="border-2">
            <CardContent className="p-4 sm:p-6 text-center">
              <div className="flex flex-col items-center space-y-4">
                <div>
                  <h3 className="text-lg font-semibold">Ready to split a new payment?</h3>
                  <p className="text-sm text-muted-foreground">
                    Create a split in seconds and invite your friends to contribute
                  </p>
                </div>
                <ResponsiveButton 
                  className="w-full sm:w-auto !bg-blue-600 !hover:bg-blue-700 !from-blue-600 !to-blue-600 hover:!from-blue-700 hover:!to-blue-700 !text-white"
                  onClick={navigateToCreate}
                >
                  Create New Split
                </ResponsiveButton>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardContent className="p-4 sm:p-6 text-center">
              <div className="flex flex-col items-center space-y-4">
                <div>
                  <h3 className="text-lg font-semibold">Want to join an existing split?</h3>
                  <p className="text-sm text-muted-foreground">
                    Contribute to a payment split that someone else created
                  </p>
                </div>
                <ResponsiveButton 
                  className="w-full sm:w-auto !bg-blue-600 !hover:bg-blue-700 !from-blue-600 !to-blue-600 hover:!from-blue-700 hover:!to-blue-700 !text-white"
                  onClick={navigateToJoin}
                >
                  Join Existing Split
                </ResponsiveButton>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  )
})

export default HomePage
