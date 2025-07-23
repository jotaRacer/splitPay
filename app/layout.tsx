import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { PrivyWeb3Provider } from "@/contexts/privy-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Split Pay",
  description: "Simple cross-chain payment splitting",
  generator: 'v0.dev'
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
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
