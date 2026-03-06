import { useEffect, useRef, useState, useCallback, useMemo } from 'react'
import * as echarts from 'echarts/core'
import { BarChart as EBarChart } from 'echarts/charts'
import {
    GridComponent,
    TooltipComponent,
    LegendComponent,
} from 'echarts/components'
import { SVGRenderer } from 'echarts/renderers'
import clsx from 'clsx'
import type { BaseComponentProps } from '@json-render/react'
import { ChartSkeleton } from './chart-skeleton'
import type { DataSourceConfig, ChartSeriesData } from '@/context/data-context'

echarts.use([EBarChart, GridComponent, TooltipComponent, LegendComponent, SVGRenderer])

interface BarChartProps {
    title?: string
    xAxis?: string[]
    series?: Array<{
        name: string
        data: number[]
    }>
    height?: 'sm' | 'md' | 'lg' | 'xl'
    stack?: boolean
    horizontal?: boolean
    dataSource?: DataSourceConfig
}

const heightMap: Record<string, string> = {
    sm: 'h-48',
    md: 'h-64',
    lg: 'h-80',
    xl: 'h-96',
}

const COLORS = ['#6366f1', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']

export function BarChart({ props }: BaseComponentProps<BarChartProps>) {
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

        const isHorizontal = props.horizontal ?? false

        const categoryAxis = {
            type: 'category' as const,
            data: xAxis,
            axisLine: { lineStyle: { color: '#e4e4e7' } },
            axisTick: { show: false },
            axisLabel: { color: '#a1a1aa', fontSize: 11 },
        }

        const valueAxis = {
            type: 'value' as const,
            splitLine: { lineStyle: { color: '#f4f4f5', type: 'dashed' as const } },
            axisLabel: { color: '#a1a1aa', fontSize: 11 },
        }

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
            xAxis: isHorizontal ? valueAxis : categoryAxis,
            yAxis: isHorizontal ? categoryAxis : valueAxis,
            series: series.map((s) => ({
                name: s.name,
                type: 'bar' as const,
                data: s.data,
                stack: props.stack ? 'total' : undefined,
                barMaxWidth: 32,
                itemStyle: { borderRadius: props.stack ? [0, 0, 0, 0] : [4, 4, 0, 0] },
                emphasis: { focus: 'series' as const },
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
    }, [hasData, xAxis, series, props.horizontal, props.stack])

    // 决定渲染内容
    const renderContent = useMemo(() => {
        if (isLoading) {
            return (
                <ChartSkeleton
                    title={props.title}
                    height={props.height || 'md'}
                    chartType="bar"
                    onRefresh={fetchDynamicData}
                />
            )
        }

        if (error) {
            return (
                <ChartSkeleton
                    title={props.title}
                    height={props.height || 'md'}
                    chartType="bar"
                    error={error}
                    onRefresh={fetchDynamicData}
                />
            )
        }

        if (!hasData) {
            return (
                <ChartSkeleton
                    title={props.title}
                    height={props.height || 'md'}
                    chartType="bar"
                    onRefresh={fetchDynamicData}
                />
            )
        }

        return (
            <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white">
                {props.title && (
                    <div className="border-b border-zinc-100 px-4 py-3 flex items-center justify-between">
                        <h4 className="text-xs font-semibold text-zinc-800">{props.title}</h4>
                        {props.dataSource && (
                            <button
                                onClick={fetchDynamicData}
                                className="p-1 rounded hover:bg-zinc-100 transition-colors group"
                                title="刷新数据"
                            >
                                <svg
                                    className="w-3.5 h-3.5 text-zinc-400 group-hover:text-zinc-600 transition-colors"
                                    viewBox="0 0 14 14"
                                    fill="none"
                                >
                                    <path
                                        d="M2 7a5 5 0 0 1 8.5-3.5M12 7a5 5 0 0 1-8.5 3.5"
                                        stroke="currentColor"
                                        strokeWidth="1.2"
                                        strokeLinecap="round"
                                    />
                                    <path
                                        d="M10 2h2.5M10 2v2.5"
                                        stroke="currentColor"
                                        strokeWidth="1.2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                    <path
                                        d="M4 12H1.5M4 12v-2.5"
                                        stroke="currentColor"
                                        strokeWidth="1.2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </button>
                        )}
                    </div>
                )}
                <div className={clsx('w-full p-4', heightMap[props.height || 'md'])}>
                    <div ref={chartRef} className="w-full h-full" />
                </div>
            </div>
        )
    }, [isLoading, error, hasData, props.title, props.height, props.dataSource, fetchDynamicData])

    return renderContent
}
