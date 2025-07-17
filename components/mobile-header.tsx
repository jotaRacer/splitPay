"use client"

import { Wallet } from "lucide-react"
import { useWeb3 } from "@/contexts/web3-context"

export function MobileHeader() {
  const { isConnected, isLoading } = useWeb3()

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container-fluid">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <Wallet className="h-5 w-5 text-white" />
              </div>
              <span className="text-responsive-xl font-bold">Split Pay</span>
            </div>

            {/* Wallet Connection Status */}
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-2">
                <div className={`h-2 w-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className="text-sm text-muted-foreground">
                  {isLoading ? 'Connecting...' : (isConnected ? 'Connected' : 'Disconnected')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  )
}
