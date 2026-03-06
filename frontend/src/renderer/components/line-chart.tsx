import { useEffect, useRef, useState, useCallback } from 'react'
import * as echarts from 'echarts/core'
import { LineChart as ELineChart } from 'echarts/charts'
import {
    GridComponent,
    TooltipComponent,
    LegendComponent,
} from 'echarts/components'
import { SVGRenderer } from 'echarts/renderers'
import clsx from 'clsx'
import type { BaseComponentProps } from '@json-render/react'
import { UniversalChartPlaceholder } from './universal-chart-placeholder'
import type { DataSourceConfig, ChartSeriesData } from '@/context/data-context'
import { dashboardStore, selectors } from '@/store/dashboard-store'

echarts.use([ELineChart, GridComponent, TooltipComponent, LegendComponent, SVGRenderer])

interface LineChartProps {
    title?: string
    xAxis?: string[]
    series?: Array<{
        name: string
        data: number[]
    }>
    height?: 'sm' | 'md' | 'lg' | 'xl'
    smooth?: boolean
    showArea?: boolean
    dataSource?: DataSourceConfig
}

const heightMap: Record<string, string> = {
    sm: 'h-48',
    md: 'h-64',
    lg: 'h-80',
    xl: 'h-96',
}

const COLORS = ['#6366f1', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']

export function LineChart({ props }: BaseComponentProps<LineChartProps>) {
    const chartRef = useRef<HTMLDivElement>(null)
    const instanceRef = useRef<echarts.ECharts | null>(null)

    // 动态数据状态
    const [dynamicData, setDynamicData] = useState<ChartSeriesData | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // 确定使用的数据源
    const xAxis = props.xAxis || dynamicData?.xAxis
    const series = props.series || dynamicData?.series

    // 是否需要加载动态数据
    const needsDynamicData = props.dataSource && !props.xAxis && !props.series
    const hasData = xAxis && series && series.length > 0

    // 获取动态数据
    const fetchDynamicData = useCallback(async () => {
        if (!props.dataSource) return

        setIsLoading(true)
        setError(null)

        try {
            const response = await fetch('/api/data/query', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(props.dataSource.params || {})
            })

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            const data: ChartSeriesData = await response.json()
            setDynamicData(data)
        } catch (err) {
            setError(err instanceof Error ? err.message : '数据加载失败')
        } finally {
            setIsLoading(false)
        }
    }, [props.dataSource])

    // 首次加载动态数据
    useEffect(() => {
        if (needsDynamicData) {
            fetchDynamicData()
        }
    }, [needsDynamicData, fetchDynamicData])

    // 监听全局刷新触发器
    useEffect(() => {
        if (!needsDynamicData) return

        const unsubscribe = dashboardStore.subscribe(
            selectors.refreshTrigger,
            (timestamp) => {
                if (timestamp > 0) {
                    fetchDynamicData()
                }
            }
        )

        return unsubscribe
    }, [needsDynamicData, fetchDynamicData])

    // 自动刷新
    useEffect(() => {
        if (props.dataSource?.refreshInterval) {
            const timer = setInterval(fetchDynamicData, props.dataSource.refreshInterval * 1000)
            return () => clearInterval(timer)
        }
    }, [props.dataSource?.refreshInterval, fetchDynamicData])

    // 渲染图表 - 必须在所有条件返回之前
    useEffect(() => {
        if (!chartRef.current || !hasData || !xAxis || !series) return

        const chart = echarts.init(chartRef.current, undefined, { renderer: 'svg' })
        instanceRef.current = chart

        const option: echarts.EChartsCoreOption = {
            color: COLORS,
            tooltip: {
                trigger: 'axis',
                backgroundColor: 'rgba(255,255,255,0.96)',
                borderColor: '#e4e4e7',
                borderWidth: 1,
                textStyle: { color: '#18181b', fontSize: 12 },
            },
            legend: {
                show: series.length > 1,
                bottom: 0,
                textStyle: { color: '#71717a', fontSize: 11 },
                itemWidth: 12,
                itemHeight: 8,
                itemGap: 16,
            },
            grid: {
                top: 12,
                right: 16,
                bottom: series.length > 1 ? 32 : 12,
                left: 0,
                containLabel: true,
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: xAxis,
                axisLine: { lineStyle: { color: '#e4e4e7' } },
                axisTick: { show: false },
                axisLabel: { color: '#a1a1aa', fontSize: 11 },
            },
            yAxis: {
                type: 'value',
                splitLine: { lineStyle: { color: '#f4f4f5', type: 'dashed' } },
                axisLabel: { color: '#a1a1aa', fontSize: 11 },
            },
            series: series.map((s) => ({
                name: s.name,
                type: 'line' as const,
                data: s.data,
                smooth: props.smooth ?? true,
                symbol: 'circle',
                symbolSize: 4,
                showSymbol: false,
                emphasis: { focus: 'series' as const },
                lineStyle: { width: 2 },
                ...(props.showArea ? {
                    areaStyle: { opacity: 0.08 },
                } : {}),
            })),
            animation: true,
            animationDuration: 600,
            animationEasing: 'cubicOut',
        }

        chart.setOption(option)

        const ro = new ResizeObserver(() => chart.resize())
        ro.observe(chartRef.current)

        return () => {
            ro.disconnect()
            chart.dispose()
            instanceRef.current = null
        }
    }, [hasData, xAxis, series, props.smooth, props.showArea])

    // 统一的卡片容器 - 内容区域高度固定，避免切换时抖动
    const containerHeight = heightMap[props.height || 'md']

    return (
        <div className="group relative rounded-lg bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04),0_4px_12px_rgba(0,0,0,0.03)] ring-1 ring-zinc-950/4 transition-shadow duration-300 hover:shadow-[0_2px_6px_rgba(0,0,0,0.06),0_8px_24px_rgba(0,0,0,0.04)]">
            {props.title && (
                <div className="relative px-4 py-3.5">
                    <div className="flex items-start gap-2.5">
                        <div className={clsx(
                            'mt-0.75 h-3.5 w-0.75 shrink-0 rounded-full bg-linear-to-b',
                            error ? 'from-red-300 to-red-400/60' : 'from-indigo-400 to-indigo-500/60'
                        )} />
                        <h3 className="text-[13px] font-semibold tracking-[-0.01em] text-zinc-800">
                            {props.title}
                        </h3>
                    </div>
                    <div className={clsx(
                        'absolute bottom-0 left-4 right-4 h-px bg-linear-to-r',
                        error ? 'from-red-200/60 via-red-100/30 to-transparent' : 'from-zinc-200/80 via-zinc-200/40 to-transparent'
                    )} />
                </div>
            )}
            <div className="px-4 py-3.5">
                <div className={clsx('w-full relative', containerHeight)}>
                    {/* 图表容器 - 始终存在，无数据时隐藏 */}
                    <div
                        ref={chartRef}
                        className={clsx('w-full h-full', (isLoading || error || !hasData) && 'hidden')}
                    />
                    {/* 占位符 - 加载/错误/无数据时显示 */}
                    {(isLoading || error || !hasData) && (
                        <div className="absolute inset-0">
                            <UniversalChartPlaceholder
                                height={props.height || 'md'}
                                isLoading={isLoading}
                                error={error}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
