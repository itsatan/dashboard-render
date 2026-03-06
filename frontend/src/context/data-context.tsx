import { createContext, useContext, useRef, useState, useCallback, type ReactNode } from 'react'

// 数据源配置
export interface DataSourceConfig {
    type: 'mock' | 'api' | 'mcp'
    endpoint?: string
    params?: Record<string, unknown>
    refreshInterval?: number
}

// 图表数据类型
export interface ChartSeriesData {
    xAxis: string[]
    series: Array<{
        name: string
        data: number[]
    }>
}

export interface PieChartData {
    data: Array<{
        name: string
        value: number
    }>
}

export interface RadarChartData {
    indicator: Array<{
        name: string
        max: number
    }>
    series: Array<{
        name: string
        data: number[]
    }>
}

export interface GaugeChartData {
    value: number
    min?: number
    max?: number
    unit?: string
}

export type ChartData = ChartSeriesData | PieChartData | RadarChartData | GaugeChartData

// 缓存数据
interface CachedData {
    data: ChartData
    timestamp: number
}

// Context 值类型
interface DataContextValue {
    // 缓存
    cache: Map<string, CachedData>

    // 获取数据
    fetchData: (config: DataSourceConfig) => Promise<ChartData>

    // 刷新数据
    refresh: (key: string) => void

    // 加载状态
    loading: Map<string, boolean>

    // 错误状态
    errors: Map<string, Error>

    // 清除缓存
    clearCache: () => void
}

const DataContext = createContext<DataContextValue | null>(null)

interface DataProviderProps {
    children: ReactNode
}

// 缓存有效期（5分钟）
const CACHE_TTL = 5 * 60 * 1000

export function DataProvider({ children }: DataProviderProps) {
    const cacheRef = useRef(new Map<string, CachedData>())
    const [loading, setLoading] = useState(new Map<string, boolean>())
    const [errors, setErrors] = useState(new Map<string, Error>())

    // 生成缓存 key
    const getCacheKey = useCallback((config: DataSourceConfig) => {
        return JSON.stringify(config)
    }, [])

    // 获取数据
    const fetchData = useCallback(async (config: DataSourceConfig): Promise<ChartData> => {
        const key = getCacheKey(config)

        // 检查缓存
        const cached = cacheRef.current.get(key)
        if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
            return cached.data
        }

        // 设置加载状态
        setLoading(prev => new Map(prev).set(key, true))
        setErrors(prev => {
            const next = new Map(prev)
            next.delete(key)
            return next
        })

        try {
            // 调用数据查询 API
            const response = await fetch('/api/data/query', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(config.params || {})
            })

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            const data: ChartData = await response.json()

            // 更新缓存
            cacheRef.current.set(key, { data, timestamp: Date.now() })

            return data
        } catch (err) {
            const error = err instanceof Error ? err : new Error(String(err))
            setErrors(prev => new Map(prev).set(key, error))
            throw error
        } finally {
            setLoading(prev => {
                const next = new Map(prev)
                next.delete(key)
                return next
            })
        }
    }, [getCacheKey])

    // 刷新数据
    const refresh = useCallback((key: string) => {
        cacheRef.current.delete(key)
    }, [])

    // 清除所有缓存
    const clearCache = useCallback(() => {
        cacheRef.current.clear()
    }, [])

    return (
        <DataContext.Provider value={{
            cache: cacheRef.current,
            fetchData,
            refresh,
            loading,
            errors,
            clearCache
        }}>
            {children}
        </DataContext.Provider>
    )
}

// Hook
export function useData() {
    const context = useContext(DataContext)
    if (!context) {
        throw new Error('useData must be used within a DataProvider')
    }
    return context
}

// 用于图表组件的 Hook
export function useChartData(config: DataSourceConfig | undefined) {
    const { fetchData, refresh } = useData()
    const [data, setData] = useState<ChartData | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<Error | null>(null)

    const key = config ? JSON.stringify(config) : null

    // 获取数据
    const load = useCallback(async () => {
        if (!config) return

        setIsLoading(true)
        setError(null)

        try {
            const result = await fetchData(config)
            setData(result)
        } catch (err) {
            setError(err instanceof Error ? err : new Error(String(err)))
        } finally {
            setIsLoading(false)
        }
    }, [config, fetchData])

    // 首次加载
    const loadRef = useRef(load)
    loadRef.current = load

    // 使用 key 变化时重新加载
    const prevKeyRef = useRef<string | null>(null)

    if (key !== prevKeyRef.current) {
        prevKeyRef.current = key
        if (key) {
            load()
        }
    }

    // 手动刷新
    const handleRefresh = useCallback(() => {
        if (key) {
            refresh(key)
        }
        load()
    }, [key, refresh, load])

    return {
        data,
        isLoading,
        error,
        refresh: handleRefresh
    }
}
