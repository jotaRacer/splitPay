"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"

export default function SetupPage() {
  const router = useRouter()
  const [connected, setConnected] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    router.push("/share")
  }

  return (
    <div className="container">
      <h1 className="text-2xl font-bold mb-6">Payment Setup</h1>

      <div className="space-y-6">
        <Button variant={connected ? "outline" : "default"} onClick={() => setConnected(!connected)}>
          {connected ? "Wallet Connected" : "Connect Wallet"}
        </Button>

        {connected && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Split Name</label>
              <Input placeholder="Dinner with friends" required />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <Input placeholder="Italian restaurant bill" />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Total Amount</label>
              <Input type="number" placeholder="100" required />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Recipient Address</label>
              <Input placeholder="0x..." required />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Preferred Blockchain</label>
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

            <Button type="submit">Create Split</Button>
          </form>
        )}
      </div>
    </div>
  )
}
