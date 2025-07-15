"use client"

import { useState } from "react"
import { Menu, X, Wallet, Bell } from "lucide-react"
import { ResponsiveButton } from "./ui/responsive-button"

export function MobileHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

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

            {/* Mobile menu button */}
            <div className="flex items-center space-x-2 md:hidden">
              <ResponsiveButton variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
              </ResponsiveButton>
              <ResponsiveButton variant="ghost" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </ResponsiveButton>
            </div>

            {/* Desktop navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              <a
                href="#"
                className="text-responsive-base text-muted-foreground hover:text-foreground transition-colors"
              >
                Dashboard
              </a>
              <a
                href="#"
                className="text-responsive-base text-muted-foreground hover:text-foreground transition-colors"
              >
                History
              </a>
              <ResponsiveButton variant="outline" size="sm">
                Connect Wallet
              </ResponsiveButton>
            </nav>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t bg-background">
            <div className="container-fluid py-4 space-y-4">
              <a href="#" className="block text-responsive-lg font-medium hover:text-primary transition-colors">
                Dashboard
              </a>
              <a href="#" className="block text-responsive-lg font-medium hover:text-primary transition-colors">
                History
              </a>
              <ResponsiveButton className="w-full" size="lg">
                Connect Wallet
              </ResponsiveButton>
            </div>
          </div>
        )}
      </header>
    </>
  )
}
