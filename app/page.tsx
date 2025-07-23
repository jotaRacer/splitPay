"use client"

import { MobileHeader } from "@/components/mobile-header"
import { Card, CardContent } from "@/components/ui/card"
import { ResponsiveButton } from "@/components/ui/responsive-button"
import { useRouter } from "next/navigation"
import { Suspense, lazy, useState } from "react"

// Lazy load ONLY essential components
const PrivyWalletConnect = lazy(() => import("@/components/privy-wallet-connect").then(module => ({ default: module.PrivyWalletConnect })))

// Ultra-light loading component
function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center p-4">
      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
    </div>
  )
}

export default function HomePage() {
  const router = useRouter()
  const [showAdvanced, setShowAdvanced] = useState(false)

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
          
          {/* Wallet Connection - Lazy loaded */}
          <Suspense fallback={<LoadingSpinner />}>
            <PrivyWalletConnect />
          </Suspense>
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
                  onClick={() => router.push("/create")}
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
                  onClick={() => router.push("/join")}
                >
                  Join Existing Split
                </ResponsiveButton>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Advanced Features Toggle */}
        <section className="text-center">
          <ResponsiveButton 
            variant="outline"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="w-full sm:w-auto"
          >
            {showAdvanced ? 'Hide' : 'Show'} Advanced Features
          </ResponsiveButton>
        </section>

        {/* Advanced Features - Loaded only when needed */}
        {showAdvanced && (
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-center">🔗 Advanced Features</h2>
            <Card className="border-2">
              <CardContent className="p-4 sm:p-6 text-center">
                <div className="flex flex-col items-center space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold">Test & Development</h3>
                    <p className="text-sm text-muted-foreground">
                      Access advanced features for testing and development
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <ResponsiveButton 
                      size="sm"
                      variant="outline"
                      onClick={() => router.push("/wallet-test")}
                    >
                      Wallet Test
                    </ResponsiveButton>
                    <ResponsiveButton 
                      size="sm"
                      variant="outline"
                      onClick={() => router.push("/testnet")}
                    >
                      Testnet
                    </ResponsiveButton>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>
        )}
      </main>
    </div>
  )
}
