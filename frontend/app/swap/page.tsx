"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function SwapPage() {
  const router = useRouter()

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/success")
    }, 3000)
    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className="container">
      <h1 className="text-2xl font-bold mb-6">Processing Payment</h1>

      <div className="space-y-6">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600">Cross-chain swap in progress...</p>
        </div>

        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium mb-2">Swap Details</h3>
            <div className="text-sm space-y-1">
              <div className="flex justify-between">
                <span>From:</span>
                <span>25 USDC (Polygon)</span>
              </div>
              <div className="flex justify-between">
                <span>To:</span>
                <span>25 USDC (Ethereum)</span>
              </div>
              <div className="flex justify-between">
                <span>Exchange rate:</span>
                <span>1:1</span>
              </div>
              <div className="flex justify-between">
                <span>Bridge fee:</span>
                <span>$1.50</span>
              </div>
            </div>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-green-800 text-sm">✓ Payment confirmed on Polygon</p>
            <p className="text-gray-600 text-sm">⏳ Bridging to Ethereum...</p>
          </div>
        </div>
      </div>
    </div>
  )
}
