"use client"

import { useEffect, useState } from 'react'

export default function MinimalPage() {
  const [loadTime, setLoadTime] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const startTime = performance.now()
    
    // Simular carga mínima
    setTimeout(() => {
      const endTime = performance.now()
      setLoadTime(endTime - startTime)
      setIsLoaded(true)
    }, 100)
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-4">🚀 Página Minimalista</h1>
        <p className="text-lg text-gray-600 mb-8">
          Esta página no tiene Privy ni componentes pesados
        </p>
        
        {!isLoaded ? (
          <div className="py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p>Cargando...</p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-white p-8 rounded-lg shadow">
              <h2 className="text-2xl font-bold mb-4">⏱️ Tiempo de Carga</h2>
              <p className="text-4xl font-bold text-green-600">{loadTime.toFixed(2)}ms</p>
              <p className="text-sm text-gray-600 mt-2">
                {loadTime < 100 ? '✅ Excelente' : loadTime < 500 ? '⚠️ Bueno' : '❌ Lento'}
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-4">📊 Comparación</h3>
              <div className="space-y-2 text-sm">
                <p>• <strong>Esta página:</strong> Solo React básico</p>
                <p>• <strong>Página principal:</strong> React + Privy + LiFi + Componentes</p>
                <p>• <strong>Diferencia:</strong> {loadTime < 100 ? 'Mínima' : 'Significativa'}</p>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-4">🔍 Diagnóstico</h3>
              <div className="text-left space-y-2 text-sm">
                <p>• <strong>Bundle size:</strong> Mínimo (solo React)</p>
                <p>• <strong>Hidratación:</strong> Rápida (sin estado complejo)</p>
                <p>• <strong>Recursos:</strong> Mínimos (solo CSS básico)</p>
                <p>• <strong>Dependencias:</strong> Solo React hooks</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 