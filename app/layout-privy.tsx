import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Web3Provider } from "@/contexts/web3-context"
import { PrivyWeb3Provider } from "@/contexts/privy-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Split Pay - Privy Integration",
  description: "Simple cross-chain payment splitting with Privy",
  viewport: "width=device-width, initial-scale=1",
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={inter.className}>
        {/* Using Privy for better UX */}
        <PrivyWeb3Provider>
          {/* Keeping old provider for comparison - you can remove this later */}
          <Web3Provider>
            {children}
          </Web3Provider>
        </PrivyWeb3Provider>
      </body>
    </html>
  )
}
