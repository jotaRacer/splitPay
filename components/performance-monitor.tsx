"use client"

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface PerformanceMetrics {
  loadTime: number
  renderTime: number
  componentCount: number
  memoryUsage?: number
}

export function PerformanceMonitor() {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    loadTime: 0,
    renderTime: 0,
    componentCount: 0
  })
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const startTime = performance.now()
    
    // Measure initial load time
    const measureLoadTime = () => {
      const loadTime = performance.now() - startTime
      
      // Count React components (approximate)
      const componentCount = document.querySelectorAll('[data-reactroot], [data-reactid]').length
      
      // Measure memory usage if available
      const memoryUsage = (performance as any).memory?.usedJSHeapSize / 1024 / 1024
      
      setMetrics({
        loadTime,
        renderTime: loadTime,
        componentCount,
        memoryUsage
      })
    }

    // Use requestAnimationFrame to measure after render
    requestAnimationFrame(() => {
      requestAnimationFrame(measureLoadTime)
    })

    // Toggle visibility with Ctrl+Shift+P
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'P') {
        setIsVisible(prev => !prev)
      }
    }

    document.addEventListener('keydown', handleKeyPress)
    return () => document.removeEventListener('keydown', handleKeyPress)
  }, [])

  if (!isVisible) return null

  const getPerformanceColor = (time: number) => {
    if (time < 100) return 'bg-green-100 text-green-800'
    if (time < 500) return 'bg-yellow-100 text-yellow-800'
    return 'bg-red-100 text-red-800'
  }

  const getMemoryColor = (memory?: number) => {
    if (!memory) return 'bg-gray-100 text-gray-800'
    if (memory < 50) return 'bg-green-100 text-green-800'
    if (memory < 100) return 'bg-yellow-100 text-yellow-800'
    return 'bg-red-100 text-red-800'
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Card className="w-80 shadow-lg">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center justify-between">
            <span>🚀 Performance Monitor</span>
            <Badge variant="outline" className="text-xs">
              Ctrl+Shift+P
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-600">Load Time:</span>
            <Badge className={`text-xs ${getPerformanceColor(metrics.loadTime)}`}>
              {metrics.loadTime.toFixed(2)}ms
            </Badge>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-600">Render Time:</span>
            <Badge className={`text-xs ${getPerformanceColor(metrics.renderTime)}`}>
              {metrics.renderTime.toFixed(2)}ms
            </Badge>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-600">Components:</span>
            <Badge variant="outline" className="text-xs">
              {metrics.componentCount}
            </Badge>
          </div>
          
          {metrics.memoryUsage && (
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-600">Memory:</span>
              <Badge className={`text-xs ${getMemoryColor(metrics.memoryUsage)}`}>
                {metrics.memoryUsage.toFixed(1)}MB
              </Badge>
            </div>
          )}
          
          <div className="pt-2 border-t">
            <div className="text-xs text-gray-500">
              <p>• Green: &lt;100ms (Excellent)</p>
              <p>• Yellow: 100-500ms (Good)</p>
              <p>• Red: &gt;500ms (Needs optimization)</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 