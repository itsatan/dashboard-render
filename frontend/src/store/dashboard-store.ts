/**
 * Dashboard Store - 全局状态管理
 *
 * 使用 Zustand 管理仪表盘数据、UI 状态和刷新触发器
 * 与 json-render 的 StateProvider 配合使用
 */

import { createStore } from 'zustand/vanilla'
import { subscribeWithSelector } from 'zustand/middleware'

// 数据源配置
export interface DataSourceConfig {
    id: string
    resourceType: string
    cluster?: string
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

export interface GaugeChartData {
    value: number
    min?: number
    max?: number
    unit?: string
}

export type ChartData = ChartSeriesData | PieChartData | GaugeChartData

// 仪表盘状态
export interface DashboardState {
    // 数据层 - 按数据源 ID 存储图表数据
    data: Record<string, ChartData>

    // UI 层
    ui: {
        refreshing: boolean
        lastRefresh: number | null
        autoRefreshInterval: number  // 秒，0 表示关闭
        refreshProgress: number      // 0-100
        refreshError: string | null
    }

    // 触发器 - 用于触发全局刷新
    trigger: {
        refresh: number  // 时间戳，变化时触发刷新
    }

    // 数据源配置列表（从 spec 中提取）
    dataSources: DataSourceConfig[]

    // 当前集群信息
    cluster?: string
}

// 初始状态
const initialState: DashboardState = {
    data: {},
    ui: {
        refreshing: false,
        lastRefresh: null,
        autoRefreshInterval: 0,
        refreshProgress: 0,
        refreshError: null,
    },
    trigger: {
        refresh: 0,
    },
    dataSources: [],
    cluster: undefined,
}

// 创建 Zustand store
export const dashboardStore = createStore<DashboardState>()(
    subscribeWithSelector(() => initialState)
)

// Actions - 状态操作函数
export const dashboardActions = {
    // 触发全局刷新
    triggerRefresh: () => {
        dashboardStore.setState(() => ({
            trigger: { refresh: Date.now() },
        }))
    },

    // 设置刷新状态
    setRefreshing: (refreshing: boolean, progress = 0) => {
        dashboardStore.setState((state) => ({
            ui: { ...state.ui, refreshing, refreshProgress: progress },
        }))
    },

    // 设置刷新错误
    setRefreshError: (error: string | null) => {
        dashboardStore.setState((state) => ({
            ui: { ...state.ui, refreshError: error },
        }))
    },

    // 更新单个数据源的数据
    setData: (id: string, data: ChartData) => {
        dashboardStore.setState((state) => ({
            data: { ...state.data, [id]: data },
        }))
    },

    // 批量更新数据
    setMultipleData: (updates: Record<string, ChartData>) => {
        dashboardStore.setState((state) => ({
            data: { ...state.data, ...updates },
        }))
    },

    // 清除单个数据
    clearData: (id: string) => {
        dashboardStore.setState((state) => {
            const newData = { ...state.data }
            delete newData[id]
            return { data: newData }
        })
    },

    // 清除所有数据
    clearAllData: () => {
        dashboardStore.setState({ data: {} })
    },

    // 设置自动刷新间隔
    setAutoRefresh: (interval: number) => {
        dashboardStore.setState((state) => ({
            ui: { ...state.ui, autoRefreshInterval: interval },
        }))
    },

    // 设置上次刷新时间
    setLastRefresh: (time: number) => {
        dashboardStore.setState((state) => ({
            ui: { ...state.ui, lastRefresh: time },
        }))
    },

    // 设置数据源配置列表
    setDataSources: (dataSources: DataSourceConfig[]) => {
        dashboardStore.setState({ dataSources })
    },

    // 添加数据源
    addDataSource: (dataSource: DataSourceConfig) => {
        dashboardStore.setState((state) => ({
            dataSources: [...state.dataSources, dataSource],
        }))
    },

    // 设置集群信息
    setCluster: (cluster: string | undefined) => {
        dashboardStore.setState({ cluster })
    },

    // 重置状态
    reset: () => {
        dashboardStore.setState(initialState)
    },
}

// 选择器 - 用于订阅特定状态
export const selectors = {
    // 获取刷新状态
    refreshing: (state: DashboardState) => state.ui.refreshing,

    // 获取自动刷新间隔
    autoRefreshInterval: (state: DashboardState) => state.ui.autoRefreshInterval,

    // 获取刷新触发器
    refreshTrigger: (state: DashboardState) => state.trigger.refresh,

    // 获取数据源列表
    dataSources: (state: DashboardState) => state.dataSources,

    // 获取所有数据
    allData: (state: DashboardState) => state.data,

    // 获取特定数据
    getData: (id: string) => (state: DashboardState) => state.data[id],

    // 是否有数据源
    hasDataSources: (state: DashboardState) => state.dataSources.length > 0,
}

// Hook - 在 React 组件中使用
export function useDashboardStore() {
    return dashboardStore.getState()
}

// 订阅状态变化
export function subscribeToRefresh(callback: (timestamp: number) => void) {
    return dashboardStore.subscribe(
        (state) => state.trigger.refresh,
        (refresh) => {
            if (refresh > 0) {
                callback(refresh)
            }
        }
    )
}
