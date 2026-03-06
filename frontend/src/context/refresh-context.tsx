/**
 * Refresh Context - 刷新控制上下文
 *
 * 提供全局刷新功能：
 * - 一键刷新所有图表数据
 * - 自动刷新定时器
 * - 刷新进度和状态
 */

import {
    createContext,
    useContext,
    useEffect,
    useCallback,
    useMemo,
    type ReactNode,
} from 'react'
import { useStore } from 'zustand'
import {
    dashboardStore,
    dashboardActions,
    selectors,
    type ChartData,
    type DataSourceConfig,
} from '@/store/dashboard-store'

// 刷新上下文值类型
interface RefreshContextValue {
    // 刷新状态
    isRefreshing: boolean
    refreshProgress: number
    lastRefreshTime: number | null
    refreshError: string | null

    // 自动刷新
    autoRefreshInterval: number
    setAutoRefreshInterval: (interval: number) => void

    // 刷新操作
    refreshAll: () => Promise<void>
    refreshSingle: (dataSource: DataSourceConfig) => Promise<ChartData | null>

    // 数据源
    dataSources: DataSourceConfig[]
    hasDataSources: boolean
    registerDataSource: (dataSource: DataSourceConfig) => void
}

const RefreshContext = createContext<RefreshContextValue | null>(null)

interface RefreshProviderProps {
    children: ReactNode
}

// 数据查询 API
async function fetchDataFromAPI(params: Record<string, unknown>): Promise<ChartData> {
    const response = await fetch('/api/data/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
    })

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
    }

    return response.json()
}

export function RefreshProvider({ children }: RefreshProviderProps) {
    // 订阅 Zustand 状态
    const isRefreshing = useStore(dashboardStore, selectors.refreshing)
    const autoRefreshInterval = useStore(dashboardStore, selectors.autoRefreshInterval)
    const dataSources = useStore(dashboardStore, selectors.dataSources)
    const hasDataSources = useStore(dashboardStore, selectors.hasDataSources)

    // 获取完整状态（用于非响应式访问）
    const getState = () => dashboardStore.getState()
    const getProgress = () => getState().ui.refreshProgress
    const getLastRefresh = () => getState().ui.lastRefresh
    const getError = () => getState().ui.refreshError

    // 刷新单个数据源
    const refreshSingle = useCallback(async (dataSource: DataSourceConfig): Promise<ChartData | null> => {
        try {
            const data = await fetchDataFromAPI(dataSource.params || {
                resourceType: dataSource.resourceType,
                cluster: dataSource.cluster,
            })
            dashboardActions.setData(dataSource.id, data)
            return data
        } catch (error) {
            console.error(`Failed to refresh ${dataSource.id}:`, error)
            return null
        }
    }, [])

    // 刷新所有数据源
    const refreshAll = useCallback(async () => {
        const { dataSources } = getState()

        if (dataSources.length === 0) {
            return
        }

        dashboardActions.setRefreshing(true, 0)
        dashboardActions.setRefreshError(null)

        const total = dataSources.length
        let successCount = 0
        let errorCount = 0

        for (let i = 0; i < dataSources.length; i++) {
            const ds = dataSources[i]

            try {
                await refreshSingle(ds)
                successCount++
            } catch (error) {
                errorCount++
                console.error(`Failed to refresh ${ds.id}:`, error)
            }

            // 更新进度
            const progress = Math.round(((i + 1) / total) * 100)
            dashboardActions.setRefreshing(true, progress)
        }

        dashboardActions.setRefreshing(false, 100)
        dashboardActions.setLastRefresh(Date.now())

        if (errorCount > 0 && successCount === 0) {
            dashboardActions.setRefreshError('所有数据刷新失败')
        } else if (errorCount > 0) {
            dashboardActions.setRefreshError(`${errorCount}/${total} 个数据源刷新失败`)
        }
    }, [refreshSingle])

    // 设置自动刷新间隔
    const setAutoRefreshInterval = useCallback((interval: number) => {
        dashboardActions.setAutoRefresh(interval)
    }, [])

    // 注册数据源
    const registerDataSource = useCallback((dataSource: DataSourceConfig) => {
        const { dataSources } = getState()
        const existing = dataSources.find((ds) => ds.id === dataSource.id)

        if (!existing) {
            dashboardActions.addDataSource(dataSource)
        }
    }, [])

    // 自动刷新定时器
    useEffect(() => {
        if (autoRefreshInterval <= 0) {
            return
        }

        const timer = setInterval(() => {
            refreshAll()
        }, autoRefreshInterval * 1000)

        return () => clearInterval(timer)
    }, [autoRefreshInterval, refreshAll])

    // 监听刷新触发器
    useEffect(() => {
        const unsubscribe = dashboardStore.subscribe(
            (state) => state.trigger.refresh,
            (refresh) => {
                if (refresh > 0) {
                    refreshAll()
                }
            }
        )

        return unsubscribe
    }, [refreshAll])

    const value = useMemo<RefreshContextValue>(() => ({
        // 状态
        isRefreshing,
        refreshProgress: getProgress(),
        lastRefreshTime: getLastRefresh(),
        refreshError: getError(),

        // 自动刷新
        autoRefreshInterval,
        setAutoRefreshInterval,

        // 操作
        refreshAll,
        refreshSingle,

        // 数据源
        dataSources,
        hasDataSources,
        registerDataSource,
    }), [
        isRefreshing,
        autoRefreshInterval,
        refreshAll,
        refreshSingle,
        dataSources,
        hasDataSources,
        registerDataSource,
        setAutoRefreshInterval,
    ])

    return (
        <RefreshContext.Provider value={value}>
            {children}
        </RefreshContext.Provider>
    )
}

// Hook - 在组件中使用刷新上下文
export function useRefresh() {
    const context = useContext(RefreshContext)
    if (!context) {
        throw new Error('useRefresh must be used within a RefreshProvider')
    }
    return context
}

// Hook - 订阅特定数据源的数据变化
export function useChartData(id: string) {
    return useStore(dashboardStore, (state) => state.data[id])
}

// Hook - 订阅刷新状态
export function useRefreshing() {
    return useStore(dashboardStore, selectors.refreshing)
}
