"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"

export default function ContributePage() {
  const router = useRouter()
  const [connected, setConnected] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    router.push("/swap")
  }

  return (
    <div className="container">
      <h1 className="text-2xl font-bold mb-6">Contribute to Split</h1>

      <div className="space-y-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-medium">Dinner with friends</h3>
          <p className="text-sm text-gray-600">Total: $100 • Your share: $25</p>
        </div>

        <Button variant={connected ? "outline" : "default"} onClick={() => setConnected(!connected)}>
          {connected ? "Wallet Connected" : "Connect Wallet"}
        </Button>

        {connected && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Choose Blockchain</label>
              <select
                className="w-full py-3 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                required
              >
                <option value="">Select blockchain</option>
                <option value="ethereum">Ethereum</option>
                <option value="polygon">Polygon</option>
                <option value="arbitrum">Arbitrum</option>
                <option value="base">Base</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Contribution Amount</label>
              <Input type="number" placeholder="25" required />
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-sm space-y-1">
                <div className="flex justify-between">
                  <span>Your contribution:</span>
                  <span>$25.00</span>
                </div>
                <div className="flex justify-between">
                  <span>Network fee:</span>
                  <span>~$2.50</span>
                </div>
                <div className="flex justify-between font-medium">
                  <span>Total:</span>
                  <span>$27.50</span>
                </div>
              </div>
            </div>

            <Button type="submit">Send Payment</Button>
          </form>
        )}
      </div>
    </div>
  )
}
