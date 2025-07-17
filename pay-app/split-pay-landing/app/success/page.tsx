"use client"

import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export default function SuccessPage() {
  const router = useRouter()

  return (
    <div className="container">
      <h1 className="text-2xl font-bold mb-6">Payment Successful</h1>

      <div className="space-y-6">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
            <span className="text-green-600 text-2xl">✓</span>
          </div>
          <p className="text-gray-600">Your contribution has been processed</p>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-medium mb-3">Payment Summary</h3>
          <div className="space-y-3">
            <div>
              <h4 className="text-sm font-medium">Contributors:</h4>
              <div className="text-sm text-gray-600 space-y-1 mt-1">
                <div className="flex justify-between">
                  <span>You (Polygon)</span>
                  <span>$25.00</span>
                </div>
                <div className="flex justify-between">
                  <span>Alice (Ethereum)</span>
                  <span>$30.00</span>
                </div>
                <div className="flex justify-between">
                  <span>Bob (Base)</span>
                  <span>$45.00</span>
                </div>
              </div>
            </div>

            <div className="border-t pt-3">
              <div className="flex justify-between font-medium">
                <span>Total Collected:</span>
                <span>$100.00</span>
              </div>
            </div>
          </div>
        </div>

        <Button onClick={() => router.push("/")}>Done</Button>
      </div>
    </div>
  )
}
