// 🚀 Performance Monitoring Utility
// Track API response times and identify bottlenecks

interface PerformanceMetric {
  endpoint: string
  method: string
  startTime: number
  endTime?: number
  duration?: number
  success: boolean
  error?: string
  userAgent?: string
  timestamp: Date
}

class PerformanceMonitor {
  private metrics: PerformanceMetric[] = []
  private maxMetrics = 1000 // Keep last 1000 metrics

  // Start timing an API call
  startTiming(endpoint: string, method: string = 'GET'): string {
    const id = `${endpoint}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    const metric: PerformanceMetric = {
      endpoint,
      method,
      startTime: performance.now(),
      success: false,
      timestamp: new Date()
    }
    
    this.metrics.push(metric)
    
    // Clean up old metrics
    if (this.metrics.length > this.maxMetrics) {
      this.metrics = this.metrics.slice(-this.maxMetrics)
    }
    
    return id
  }

  // End timing an API call
  endTiming(id: string, success: boolean = true, error?: string): void {
    const metric = this.metrics.find(m => 
      m.endpoint === id.split('-')[0] && 
      m.startTime === parseFloat(id.split('-')[1])
    )
    
    if (metric) {
      metric.endTime = performance.now()
      metric.duration = metric.endTime - metric.startTime
      metric.success = success
      metric.error = error
    }
  }

  // Get performance statistics
  getStats(): {
    totalCalls: number
    averageResponseTime: number
    slowestEndpoint: string
    slowestTime: number
    fastestEndpoint: string
    fastestTime: number
    errorRate: number
    endpointBreakdown: Record<string, { count: number, avgTime: number, errors: number }>
  } {
    const completedMetrics = this.metrics.filter(m => m.duration !== undefined)
    
    if (completedMetrics.length === 0) {
      return {
        totalCalls: 0,
        averageResponseTime: 0,
        slowestEndpoint: '',
        slowestTime: 0,
        fastestEndpoint: '',
        fastestTime: 0,
        errorRate: 0,
        endpointBreakdown: {}
      }
    }

    const totalCalls = completedMetrics.length
    const averageResponseTime = completedMetrics.reduce((sum, m) => sum + (m.duration || 0), 0) / totalCalls
    
    const slowest = completedMetrics.reduce((max, m) => 
      (m.duration || 0) > (max.duration || 0) ? m : max
    )
    
    const fastest = completedMetrics.reduce((min, m) => 
      (m.duration || 0) < (min.duration || 0) ? m : min
    )
    
    const errorRate = completedMetrics.filter(m => !m.success).length / totalCalls
    
    // Endpoint breakdown
    const endpointBreakdown: Record<string, { count: number, avgTime: number, errors: number }> = {}
    
    completedMetrics.forEach(metric => {
      if (!endpointBreakdown[metric.endpoint]) {
        endpointBreakdown[metric.endpoint] = { count: 0, avgTime: 0, errors: 0 }
      }
      
      const breakdown = endpointBreakdown[metric.endpoint]
      breakdown.count++
      breakdown.avgTime = (breakdown.avgTime * (breakdown.count - 1) + (metric.duration || 0)) / breakdown.count
      if (!metric.success) breakdown.errors++
    })

    return {
      totalCalls,
      averageResponseTime,
      slowestEndpoint: slowest.endpoint,
      slowestTime: slowest.duration || 0,
      fastestEndpoint: fastest.endpoint,
      fastestTime: fastest.duration || 0,
      errorRate,
      endpointBreakdown
    }
  }

  // Get slow queries (above threshold)
  getSlowQueries(threshold: number = 1000): PerformanceMetric[] {
    return this.metrics.filter(m => (m.duration || 0) > threshold)
  }

  // Get recent metrics
  getRecentMetrics(limit: number = 50): PerformanceMetric[] {
    return this.metrics.slice(-limit).reverse()
  }

  // Clear metrics
  clearMetrics(): void {
    this.metrics = []
  }

  // Export metrics for analysis
  exportMetrics(): string {
    return JSON.stringify(this.metrics, null, 2)
  }

  // Log performance summary to console
  logSummary(): void {
    const stats = this.getStats()
    
    console.group('🚀 Performance Monitor Summary')
    console.log(`📊 Total API Calls: ${stats.totalCalls}`)
    console.log(`⏱️  Average Response Time: ${stats.averageResponseTime.toFixed(2)}ms`)
    console.log(`🐌 Slowest Endpoint: ${stats.slowestEndpoint} (${stats.slowestTime.toFixed(2)}ms)`)
    console.log(`⚡ Fastest Endpoint: ${stats.fastestEndpoint} (${stats.fastestTime.toFixed(2)}ms)`)
    console.log(`❌ Error Rate: ${(stats.errorRate * 100).toFixed(2)}%`)
    
    console.group('📈 Endpoint Breakdown')
    Object.entries(stats.endpointBreakdown).forEach(([endpoint, data]) => {
      console.log(`${endpoint}: ${data.count} calls, ${data.avgTime.toFixed(2)}ms avg, ${data.errors} errors`)
    })
    console.groupEnd()
    
    console.groupEnd()
  }
}

// Create global instance
export const performanceMonitor = new PerformanceMonitor()

// Performance decorator for functions
export function measurePerformance<T extends any[], R>(
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor
): PropertyDescriptor {
  const originalMethod = descriptor.value

  descriptor.value = async function (...args: T): Promise<R> {
    const startTime = performance.now()
    const startDate = new Date()
    
    try {
      const result = await originalMethod.apply(this, args)
      const endTime = performance.now()
      const duration = endTime - startTime
      
      console.log(`🚀 ${propertyKey} completed in ${duration.toFixed(2)}ms`)
      
      // Log slow operations
      if (duration > 1000) {
        console.warn(`⚠️  Slow operation detected: ${propertyKey} took ${duration.toFixed(2)}ms`)
      }
      
      return result
    } catch (error) {
      const endTime = performance.now()
      const duration = endTime - startTime
      
      console.error(`❌ ${propertyKey} failed after ${duration.toFixed(2)}ms:`, error)
      throw error
    }
  }

  return descriptor
}

// Utility function to measure any async operation
export async function measureAsync<T>(
  operation: () => Promise<T>,
  operationName: string = 'Operation'
): Promise<T> {
  const startTime = performance.now()
  
  try {
    const result = await operation()
    const endTime = performance.now()
    const duration = endTime - startTime
    
    console.log(`🚀 ${operationName} completed in ${duration.toFixed(2)}ms`)
    
    if (duration > 1000) {
      console.warn(`⚠️  Slow operation detected: ${operationName} took ${duration.toFixed(2)}ms`)
    }
    
    return result
  } catch (error) {
    const endTime = performance.now()
    const duration = endTime - startTime
    
    console.error(`❌ ${operationName} failed after ${duration.toFixed(2)}ms:`, error)
    throw error
  }
}

// Utility function to measure sync operations
export function measureSync<T>(
  operation: () => T,
  operationName: string = 'Operation'
): T {
  const startTime = performance.now()
  
  try {
    const result = operation()
    const endTime = performance.now()
    const duration = endTime - startTime
    
    console.log(`🚀 ${operationName} completed in ${duration.toFixed(2)}ms`)
    
    if (duration > 100) {
      console.warn(`⚠️  Slow sync operation detected: ${operationName} took ${duration.toFixed(2)}ms`)
    }
    
    return result
  } catch (error) {
    const endTime = performance.now()
    const duration = endTime - startTime
    
    console.error(`❌ ${operationName} failed after ${duration.toFixed(2)}ms:`, error)
    throw error
  }
}
