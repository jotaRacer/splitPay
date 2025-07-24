import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { PrivyWeb3Provider } from "@/contexts/privy-context"

// Optimize font loading
const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap', // Improve loading performance
  preload: false, // Reduce initial bundle size
})

export const metadata: Metadata = {
  title: "Split Pay",
  description: "Simple cross-chain payment splitting",
  generator: 'v0.dev',
  keywords: ['crypto', 'web3', 'payments', 'blockchain', 'split', 'bills'],
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <PrivyWeb3Provider>
          {children}
        </PrivyWeb3Provider>
      </body>
    </html>
  )
}
