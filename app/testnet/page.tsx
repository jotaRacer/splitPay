"use client"

import { MobileHeader } from "@/components/mobile-header"
import { TestnetHelper } from "@/components/testnet-helper"
import { TestnetSwitcher } from "@/components/testnet-switcher"
import { NetworkDebugger } from "@/components/network-debugger"
import { WalletConnect } from "@/components/wallet-connect"
import { LifiTest } from "@/components/lifi-test"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Code, Zap, Coins, Shield } from "lucide-react"

export default function TestnetPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <MobileHeader />

      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2">
            <Code className="h-6 w-6 text-blue-600" />
            <h1 className="text-3xl font-bold">Testnet Development</h1>
            <Badge variant="secondary" className="bg-blue-100 text-blue-700">
              Safe Testing
            </Badge>
          </div>
          <p className="text-muted-foreground">
            Herramientas para desarrollo y testing seguro en redes de prueba
          </p>
        </div>

        {/* Wallet Connection */}
        <WalletConnect />

        {/* Features Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Testnet Helper */}
          <div className="space-y-4">
            <TestnetHelper />
          </div>

          {/* Testnet Switcher */}
          <div className="space-y-4">
            <TestnetSwitcher />
          </div>
        </div>

        {/* Debug Panel */}
        <NetworkDebugger />

        {/* Testing Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-green-600" />
              <CardTitle>Probar Pagos Cross-Chain</CardTitle>
            </div>
            <CardDescription>
              Usa el componente de prueba para verificar la integración de Li.Fi
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LifiTest />
          </CardContent>
        </Card>

        {/* Best Practices */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-purple-600" />
              <CardTitle>Mejores Prácticas para Testnets</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <Coins className="h-4 w-4" />
              <AlertDescription>
                <strong>Tokens Gratuitos:</strong> Los tokens de testnet no tienen valor real. 
                Úsalos libremente para probar todas las funcionalidades.
              </AlertDescription>
            </Alert>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <h4 className="font-medium text-sm">✅ Hacer:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Probar diferentes montos y rutas</li>
                  <li>• Verificar transacciones en el explorador</li>
                  <li>• Probar escenarios de error</li>
                  <li>• Usar múltiples testnets</li>
                  <li>• Documentar bugs encontrados</li>
                </ul>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium text-sm">❌ Evitar:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Usar testnets para transacciones reales</li>
                  <li>• Compartir claves privadas de mainnet</li>
                  <li>• Confundir direcciones de testnet/mainnet</li>
                  <li>• Saltarse las pruebas antes de mainnet</li>
                  <li>• Asumir que testnet = mainnet</li>
                </ul>
              </div>
            </div>

            <Alert>
              <AlertDescription>
                <strong>Recomendación:</strong> Siempre prueba exhaustivamente en testnets 
                antes de desplegar en mainnet. Los errores en mainnet pueden costar dinero real.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        {/* Quick Links */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Enlaces Útiles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-2">
              <a
                href="https://faucet.quicknode.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors"
              >
                <Coins className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium">QuickNode Multi-Faucet</span>
              </a>
              
              <a
                href="https://docs.li.fi/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 p-3 bg-green-50 rounded-lg border border-green-200 hover:bg-green-100 transition-colors"
              >
                <Code className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium">Li.Fi Documentation</span>
              </a>
              
              <a
                href="https://chainlist.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 p-3 bg-purple-50 rounded-lg border border-purple-200 hover:bg-purple-100 transition-colors"
              >
                <Zap className="h-4 w-4 text-purple-600" />
                <span className="text-sm font-medium">Chainlist (Add Networks)</span>
              </a>
              
              <a
                href="https://ethereum.org/en/developers/docs/networks/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 p-3 bg-orange-50 rounded-lg border border-orange-200 hover:bg-orange-100 transition-colors"
              >
                <Shield className="h-4 w-4 text-orange-600" />
                <span className="text-sm font-medium">Ethereum Networks Guide</span>
              </a>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
