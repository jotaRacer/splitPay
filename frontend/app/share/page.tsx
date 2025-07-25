"use client"

import { Button } from "@/components/ui/button"

export default function SharePage() {
  const paymentLink = "https://splitpay.app/pay/abc123"

  const copyLink = () => {
    navigator.clipboard.writeText(paymentLink)
  }

  return (
    <div className="container">
      <h1 className="text-2xl font-bold mb-6">Share Split</h1>

      <div className="space-y-6">
        <div className="text-center">
          <div className="w-48 h-48 mx-auto bg-gray-100 rounded-lg flex items-center justify-center mb-4">
            <span className="text-gray-500">QR Code</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Payment Link</label>
          <div className="flex gap-2">
            <input
              value={paymentLink}
              readOnly
              className="flex-1 py-3 px-4 border border-gray-300 rounded-lg bg-gray-50"
            />
            <Button onClick={copyLink} className="px-6">
              Copy
            </Button>
          </div>
        </div>

        <div>
          <h3 className="font-medium mb-3">How to invite friends:</h3>
          <ol className="text-sm text-gray-600 space-y-1">
            <li>1. Share the payment link above</li>
            <li>2. Friends can pay from any supported network</li>
            <li>3. Funds will be automatically converted</li>
          </ol>
        </div>

        <div>
          <h3 className="font-medium mb-3">Supported Networks:</h3>
          <div className="text-sm text-gray-600 space-y-1">
            <div>• Ethereum (ETH, USDC, USDT)</div>
            <div>• Polygon (MATIC, USDC, USDT)</div>
            <div>• Arbitrum (ETH, USDC, USDT)</div>
            <div>• Base (ETH, USDC)</div>
          </div>
        </div>
      </div>
    </div>
  )
}
