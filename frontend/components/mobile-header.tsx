"use client"

import { Wallet, Code, Menu, X } from "lucide-react"
import { usePrivyWeb3 } from "@/contexts/privy-context"
import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export function MobileHeader() {
  const { isConnected, isLoading } = usePrivyWeb3()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

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
              </Link>
            </nav>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-b bg-background">
          <div className="container-fluid py-4 space-y-2">
            <Link
              href="/testnet"
              className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-gray-100 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              <Code className="h-4 w-4" />
              Testnet
            </Link>
          </div>
        </div>
      )}
    </>
  )
}
