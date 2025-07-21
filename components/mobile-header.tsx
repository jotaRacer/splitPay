"use client"

import { Wallet, Code, Menu, X } from "lucide-react"
import { useWeb3 } from "@/contexts/web3-context"
import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { isTestnetChainId } from "@/lib/networks"

export function MobileHeader() {
  const { isConnected, isLoading, chainId } = useWeb3()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const isTestnet = chainId ? isTestnetChainId(chainId) : false

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container-fluid">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <Wallet className="h-5 w-5 text-white" />
              </div>
              <span className="text-responsive-xl font-bold">Split Pay</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-4">
              <Link 
                href="/testnet" 
                className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Code className="h-4 w-4" />
                Testnet
                {isTestnet && (
                  <span className="h-2 w-2 bg-blue-500 rounded-full animate-pulse"></span>
                )}
              </Link>
            </nav>

            {/* Mobile Menu Button & Connection Status */}
            <div className="flex items-center space-x-2">
              {/* Connection Status */}
              <div className="flex items-center space-x-2">
                <div className={`h-2 w-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className="text-sm text-muted-foreground hidden sm:block">
                  {isLoading ? 'Connecting...' : (isConnected ? 'Connected' : 'Disconnected')}
                </span>
              </div>

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden border-t bg-background/95 backdrop-blur">
              <nav className="py-2">
                <Link 
                  href="/testnet"
                  className="flex items-center gap-2 px-4 py-3 text-sm hover:bg-gray-100 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Code className="h-4 w-4" />
                  Testnet Development
                  {isTestnet && (
                    <span className="h-2 w-2 bg-blue-500 rounded-full animate-pulse"></span>
                  )}
                </Link>
              </nav>
            </div>
          )}
        </div>
      </header>
    </>
  )
}
