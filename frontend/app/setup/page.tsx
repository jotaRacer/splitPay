"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import { usePrivyWeb3 } from "@/contexts/privy-context"
import { useWeb3Transactions } from "@/hooks/use-web3-transactions"
import { PrivyWalletConnect } from "@/components/privy-wallet-connect"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2 } from "lucide-react"

export default function SetupPage() {
  const router = useRouter()
  const { isConnected, account, getChainId } = usePrivyWeb3()
  const { isLoading, estimateGas } = useWeb3Transactions()
  const [recipients, setRecipients] = useState<string[]>([''])
  const [amounts, setAmounts] = useState<string[]>([''])
  const [splitName, setSplitName] = useState('')
  const [gasEstimate, setGasEstimate] = useState<string | null>(null)
  const [chainId, setChainId] = useState<number | null>(null)

  // Fetch chain ID when connected
  useEffect(() => {
    if (isConnected && getChainId) {
      getChainId().then(setChainId)
    }
  }, [isConnected, getChainId])

  const addRecipient = () => {
    setRecipients([...recipients, ''])
    setAmounts([...amounts, ''])
  }

  const removeRecipient = (index: number) => {
    setRecipients(recipients.filter((_, i) => i !== index))
    setAmounts(amounts.filter((_, i) => i !== index))
  }

  const updateRecipient = (index: number, value: string) => {
    const newRecipients = [...recipients]
    newRecipients[index] = value
    setRecipients(newRecipients)
  }

  const updateAmount = (index: number, value: string) => {
    const newAmounts = [...amounts]
    newAmounts[index] = value
    setAmounts(newAmounts)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isConnected || !account) return
    
    // For now, just navigate to share page
    // In a real app, you'd create the split transaction here
    router.push("/share")
  }

  const estimateTransactionCost = async () => {
    if (!isConnected || !recipients[0] || !amounts[0]) return
    
    const estimate = await estimateGas(recipients[0], amounts[0])
    setGasEstimate(estimate)
  }

  const totalAmount = amounts.reduce((sum, amount) => {
    return sum + (parseFloat(amount) || 0)
  }, 0)

  return (
    <div className="container">
      <h1 className="text-2xl font-bold mb-6">Setup Payment Split</h1>

      <div className="space-y-6">
        {/* Wallet Connection */}
                  <PrivyWalletConnect />

        {isConnected && (
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">Connected: {account?.slice(0, 6)}...{account?.slice(-4)}</Badge>
                  <Badge variant="secondary">Chain ID: {chainId}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {isConnected && (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="splitName" className="block text-sm font-medium mb-2">
                Split Name
              </label>
              <Input
                id="splitName"
                value={splitName}
                onChange={(e) => setSplitName(e.target.value)}
                placeholder="Enter split name (e.g., Dinner at Restaurant)"
                required
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Recipients</h3>
                <Button type="button" variant="outline" onClick={addRecipient}>
                  Add Recipient
                </Button>
              </div>

              {recipients.map((recipient, index) => (
                <div key={index} className="flex gap-2 items-center">
                  <Input
                    placeholder="Recipient wallet address (0x...)"
                    value={recipient}
                    onChange={(e) => updateRecipient(index, e.target.value)}
                    className="flex-1"
                  />
                  <Input
                    placeholder="Amount (ETH)"
                    value={amounts[index]}
                    onChange={(e) => updateAmount(index, e.target.value)}
                    type="number"
                    step="0.001"
                    min="0"
                    className="w-32"
                  />
                  {recipients.length > 1 && (
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={() => removeRecipient(index)}
                    >
                      Remove
                    </Button>
                  )}
                </div>
              ))}
            </div>

            {totalAmount > 0 && (
              <Card>
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Total Amount:</span>
                    <span className="text-lg font-bold">{totalAmount.toFixed(3)} ETH</span>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={estimateTransactionCost}
                disabled={!recipients[0] || !amounts[0]}
              >
                Estimate Gas
              </Button>
              
              {gasEstimate && (
                <Badge variant="secondary">
                  Gas: {gasEstimate} units
                </Badge>
              )}
            </div>

            <Button 
              type="submit" 
              className="w-full"
              disabled={!splitName || !recipients[0] || !amounts[0] || isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                'Create Split'
              )}
            </Button>
          </form>
        )}
      </div>
    </div>
  )
}
