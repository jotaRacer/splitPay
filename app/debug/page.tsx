"use client"

import { useEffect, useState } from 'react'

export default function DebugPage() {
  const [timings, setTimings] = useState<any>({})
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const startTime = performance.now()
    
    // Medir tiempo de hidratación
    const hydrationTime = performance.now() - startTime
    
    // Medir tiempo de carga de recursos
    const resourceTiming = performance.getEntriesByType('resource')
    const scriptLoadTime = resourceTiming
      .filter((entry: any) => entry.initiatorType === 'script')
      .reduce((total: number, entry: any) => total + entry.duration, 0)
    
    // Medir tiempo de renderizado
    const renderTime = performance.now() - startTime
    
    setTimings({
      hydrationTime: hydrationTime.toFixed(2),
      scriptLoadTime: scriptLoadTime.toFixed(2),
      renderTime: renderTime.toFixed(2),
      resourceCount: resourceTiming.length,
      scriptCount: resourceTiming.filter((entry: any) => entry.initiatorType === 'script').length,
      cssCount: resourceTiming.filter((entry: any) => entry.initiatorType === 'css').length,
      imageCount: resourceTiming.filter((entry: any) => entry.initiatorType === 'img').length,
    })
    
    setIsLoaded(true)
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">🔍 Debug de Rendimiento - Cliente</h1>
        
        {!isLoaded ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p>Cargando métricas...</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Métricas de Tiempo */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="font-semibold text-lg mb-2">⏱️ Tiempo de Hidratación</h3>
                <p className="text-3xl font-bold text-blue-600">{timings.hydrationTime}ms</p>
                <p className="text-sm text-gray-600">Tiempo para hidratar React</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="font-semibold text-lg mb-2">📜 Carga de Scripts</h3>
                <p className="text-3xl font-bold text-green-600">{timings.scriptLoadTime}ms</p>
                <p className="text-sm text-gray-600">Tiempo total de scripts</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="font-semibold text-lg mb-2">🎨 Tiempo de Renderizado</h3>
                <p className="text-3xl font-bold text-purple-600">{timings.renderTime}ms</p>
                <p className="text-sm text-gray-600">Tiempo total de renderizado</p>
              </div>
            </div>

            {/* Recursos Cargados */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="font-semibold text-lg mb-4">📦 Recursos Cargados</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">{timings.resourceCount}</p>
                  <p className="text-sm text-gray-600">Total Recursos</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">{timings.scriptCount}</p>
                  <p className="text-sm text-gray-600">Scripts</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-purple-600">{timings.cssCount}</p>
                  <p className="text-sm text-gray-600">CSS</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-orange-600">{timings.imageCount}</p>
                  <p className="text-sm text-gray-600">Imágenes</p>
                </div>
              </div>
            </div>

            {/* Información del Navegador */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="font-semibold text-lg mb-4">🌐 Información del Navegador</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p><strong>User Agent:</strong> {navigator.userAgent}</p>
                  <p><strong>Platform:</strong> {navigator.platform}</p>
                  <p><strong>Language:</strong> {navigator.language}</p>
                </div>
                <div>
                  <p><strong>Connection:</strong> {(navigator as any).connection?.effectiveType || 'Unknown'}</p>
                  <p><strong>Memory:</strong> {(performance as any).memory ? `${((performance as any).memory.usedJSHeapSize / 1024 / 1024).toFixed(1)}MB` : 'N/A'}</p>
                  <p><strong>Device Memory:</strong> {(navigator as any).deviceMemory || 'N/A'}GB</p>
                </div>
              </div>
            </div>

            {/* Diagnóstico */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="font-semibold text-lg mb-4">🔍 Diagnóstico</h3>
              <div className="space-y-2">
                {parseFloat(timings.renderTime) > 5000 && (
                  <div className="p-3 bg-red-100 border border-red-300 rounded">
                    <p className="text-red-800">⚠️ <strong>Problema Crítico:</strong> Tiempo de renderizado muy alto ({timings.renderTime}ms)</p>
                  </div>
                )}
                {parseFloat(timings.scriptLoadTime) > 3000 && (
                  <div className="p-3 bg-yellow-100 border border-yellow-300 rounded">
                    <p className="text-yellow-800">⚠️ <strong>Problema:</strong> Carga de scripts lenta ({timings.scriptLoadTime}ms)</p>
                  </div>
                )}
                {parseFloat(timings.hydrationTime) > 1000 && (
                  <div className="p-3 bg-orange-100 border border-orange-300 rounded">
                    <p className="text-orange-800">⚠️ <strong>Problema:</strong> Hidratación lenta ({timings.hydrationTime}ms)</p>
                  </div>
                )}
                {parseFloat(timings.renderTime) <= 1000 && (
                  <div className="p-3 bg-green-100 border border-green-300 rounded">
                    <p className="text-green-800">✅ <strong>Excelente:</strong> Rendimiento óptimo</p>
                  </div>
                )}
              </div>
            </div>

            {/* Acciones */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="font-semibold text-lg mb-4">🛠️ Acciones Recomendadas</h3>
              <div className="space-y-2 text-sm">
                <p>• <strong>Si el tiempo de renderizado es alto:</strong> Optimizar componentes React, usar lazy loading</p>
                <p>• <strong>Si la carga de scripts es lenta:</strong> Reducir bundle size, code splitting</p>
                <p>• <strong>Si la hidratación es lenta:</strong> Optimizar estado inicial, reducir re-renders</p>
                <p>• <strong>Si hay muchos recursos:</strong> Optimizar imports, remover dependencias innecesarias</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 