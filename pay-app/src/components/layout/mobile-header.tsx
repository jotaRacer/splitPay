import { useState } from "react"
import { Menu, X, Wallet, Bell } from "lucide-react"
import { Button } from "../ui/button"

export function MobileHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b header-glass">
        <div className="container-fluid">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg gradient-primary flex items-center justify-center shadow-soft">
                <Wallet className="h-5 w-5 text-white" />
              </div>
              <span className="text-responsive-xl font-bold">Split Pay</span>
            </div>

            {/* Mobile menu button */}
            <div className="flex items-center space-x-2 md:hidden">
              <Button variant="ghost" size="icon" className="hover-lift">
                <Bell className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)} className="hover-lift">
                {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>

            {/* Desktop navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              <a
                href="#"
                className="text-responsive-base text-muted-foreground hover:text-foreground transition-colors hover-lift"
              >
                Dashboard
              </a>
              <a
                href="#"
                className="text-responsive-base text-muted-foreground hover:text-foreground transition-colors hover-lift"
              >
                History
              </a>
              <Button variant="outline" size="sm" className="hover-lift">
                Connect Wallet
              </Button>
            </nav>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t bg-background animate-slide-in">
            <div className="container-fluid py-4 space-y-4">
              <a href="#" className="block text-responsive-lg font-medium hover:text-primary transition-colors hover-lift">
                Dashboard
              </a>
              <a href="#" className="block text-responsive-lg font-medium hover:text-primary transition-colors hover-lift">
                History
              </a>
              <Button size="lg" className="w-full hover-lift">
                Connect Wallet
              </Button>
            </div>
          </div>
        )}
      </header>
    </>
  )
} 