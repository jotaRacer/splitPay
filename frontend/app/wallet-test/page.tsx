"use client"

import { PrivyWalletConnect } from "@/components/privy-wallet-connect"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Zap, Shield } from "lucide-react"

export default function WalletTestPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">🔗 Privy Wallet Connection</h1>
          <p className="text-lg text-muted-foreground">
            Sistema de conexión de wallets con Privy
          </p>
        </div>

        {/* Privy Wallet Connect */}
        <div className="max-w-2xl mx-auto">
          <Card className="border-2 border-green-200">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Zap className="h-5 w-5 text-green-600" />
                <span>Sistema Privy</span>
                <Badge variant="default" className="bg-green-600">Activo</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-sm text-muted-foreground">
                  <p>• Múltiples métodos de conexión</p>
                  <p>• Email, Google, Twitter + Wallets</p>
                  <p>• Mejor UX y seguridad</p>
                </div>
                <PrivyWalletConnect />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Features */}
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Características de Privy</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="max-w-2xl mx-auto">
              <div className="space-y-4">
                <h3 className="font-semibold text-green-600 text-center">Sistema Privy</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center space-x-2">
                    <ArrowRight className="h-4 w-4 text-green-600" />
                    <span>Múltiples métodos de login</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <ArrowRight className="h-4 w-4 text-green-600" />
                    <span>Email, Google, Twitter + Wallets</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <ArrowRight className="h-4 w-4 text-green-600" />
                    <span>Wallets embebidas automáticas</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <ArrowRight className="h-4 w-4 text-green-600" />
                    <span>Mejor experiencia de usuario</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <ArrowRight className="h-4 w-4 text-green-600" />
                    <span>Seguridad mejorada</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <ArrowRight className="h-4 w-4 text-green-600" />
                    <span>Integración completa con Web3</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-6">
            <h3 className="font-semibold mb-4">📋 Instrucciones de Prueba</h3>
            <div className="space-y-2 text-sm">
              <p>1. <strong>Prueba Privy:</strong> Usa email, Google, Twitter o cualquier wallet</p>
              <p>2. <strong>Verifica la funcionalidad:</strong> Nota la mejor UX y opciones de conexión</p>
              <p>3. <strong>Prueba el cambio de red:</strong> El sistema soporta cambio a Mantle</p>
              <p>4. <strong>Explora las características:</strong> Wallets embebidas, múltiples métodos de login</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 