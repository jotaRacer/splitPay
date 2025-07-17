"use client"

import { useState } from "react"
import { Menu, X, Wallet, Bell, ExternalLink, LogOut } from "lucide-react"
import { ResponsiveButton } from "./ui/responsive-button"
import { useWeb3 } from "@/contexts/web3-context"
import { Badge } from "./ui/badge"
import { SUPPORTED_NETWORKS } from "@/lib/networks"

export function MobileHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { 
    account, 
    isConnected, 
    chainId, 
    balance, 
    connect, 
    disconnect, 
    switchNetwork, 
    isLoading 
  } = useWeb3()

  const currentNetwork = Object.values(SUPPORTED_NETWORKS).find(n => n.chainId === chainId)

  const handleConnect = async () => {
    if (!isConnected) {
      await connect()
    }
    setIsMenuOpen(false)
  }

  const handleDisconnect = () => {
    disconnect()
    setIsMenuOpen(false)
  }

  const handleNetworkSwitch = async () => {
    await switchNetwork(SUPPORTED_NETWORKS.mantle.chainId)
  }

  const formatBalance = (balance: string | null) => {
    if (!balance) return '0'
    return parseFloat(balance).toFixed(4)
  }

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
              
              {/* Desktop Wallet Connection */}
              {!isConnected ? (
                <ResponsiveButton 
                  variant="outline" 
                  size="sm"
                  onClick={handleConnect}
                  disabled={isLoading}
                >
                  {isLoading ? 'Connecting...' : 'Connect Wallet'}
                </ResponsiveButton>
              ) : (
                <div className="flex items-center space-x-2">
                  {/* Network Badge */}
                  <Badge variant={currentNetwork?.name === 'Mantle' ? 'default' : 'secondary'}>
                    {currentNetwork?.name || 'Unknown'}
                  </Badge>
                  
                  {/* Account Button */}
                  <ResponsiveButton 
                    variant="outline" 
                    size="sm"
                    onClick={handleDisconnect}
                    className="flex items-center space-x-1"
                  >
                    <Wallet className="h-3 w-3" />
                    <span>{account?.slice(0, 6)}...{account?.slice(-4)}</span>
                  </ResponsiveButton>
                  
                  {/* Switch Network Button (if not on Mantle) */}
                  {currentNetwork?.name !== 'Mantle' && (
                    <ResponsiveButton 
                      variant="ghost" 
                      size="sm"
                      onClick={handleNetworkSwitch}
                      disabled={isLoading}
                    >
                      Switch to Mantle
                    </ResponsiveButton>
                  )}
                </div>
              )}
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
              
              {/* Mobile Wallet Connection */}
              {!isConnected ? (
                <ResponsiveButton 
                  className="w-full" 
                  size="lg"
                  onClick={handleConnect}
                  disabled={isLoading}
                >
                  {isLoading ? 'Connecting...' : 'Connect Wallet'}
                </ResponsiveButton>
              ) : (
                <div className="space-y-3">
                  {/* Account Info */}
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Wallet className="h-4 w-4 text-green-600" />
                      <div>
                        <p className="text-sm font-medium">
                          {account?.slice(0, 6)}...{account?.slice(-4)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatBalance(balance)} {currentNetwork?.nativeCurrency.symbol}
                        </p>
                      </div>
                    </div>
                    <Badge variant={currentNetwork?.name === 'Mantle' ? 'default' : 'secondary'}>
                      {currentNetwork?.name || 'Unknown'}
                    </Badge>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex space-x-2">
                    {currentNetwork?.name !== 'Mantle' && (
                      <ResponsiveButton 
                        variant="outline" 
                        size="sm"
                        onClick={handleNetworkSwitch}
                        disabled={isLoading}
                        className="flex-1"
                      >
                        Switch to Mantle
                      </ResponsiveButton>
                    )}
                    
                    {currentNetwork?.blockExplorer && (
                      <ResponsiveButton 
                        variant="ghost" 
                        size="sm"
                        onClick={() => window.open(`${currentNetwork.blockExplorer}/address/${account}`, '_blank')}
                        className="flex-1"
                      >
                        <ExternalLink className="h-3 w-3 mr-1" />
                        Explorer
                      </ResponsiveButton>
                    )}
                    
                    <ResponsiveButton 
                      variant="outline" 
                      size="sm"
                      onClick={handleDisconnect}
                      className="flex-1"
                    >
                      <LogOut className="h-3 w-3 mr-1" />
                      Disconnect
                    </ResponsiveButton>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </header>
    </>
  )
}
