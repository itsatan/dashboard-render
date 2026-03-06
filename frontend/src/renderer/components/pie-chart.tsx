import { useEffect, useRef, useState, useCallback, useMemo } from 'react'
import * as echarts from 'echarts/core'
import { PieChart as EPieChart } from 'echarts/charts'
import {
    TooltipComponent,
    LegendComponent,
} from 'echarts/components'
import { SVGRenderer } from 'echarts/renderers'
import clsx from 'clsx'
import type { BaseComponentProps } from '@json-render/react'
import { ChartSkeleton } from './chart-skeleton'
import type { DataSourceConfig, PieChartData } from '@/context/data-context'

echarts.use([EPieChart, TooltipComponent, LegendComponent, SVGRenderer])

interface PieChartProps {
    title?: string
    data?: Array<{ name: string; value: number }>
    height?: 'sm' | 'md' | 'lg' | 'xl'
    donut?: boolean
    showLabel?: boolean
    dataSource?: DataSourceConfig
}

const heightMap: Record<string, string> = {
    sm: 'h-48',
    md: 'h-64',
    lg: 'h-80',
    xl: 'h-96',
}

const COLORS = ['#6366f1', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']

export function PieChart({ props }: BaseComponentProps<PieChartProps>) {
    const chartRef = useRef<HTMLDivElement>(null)
    const instanceRef = useRef<echarts.ECharts | null>(null)

    // 动态数据状态
    const [dynamicData, setDynamicData] = useState<PieChartData | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // 确定使用的数据源
    const data = props.data || dynamicData?.data

    // 是否需要加载动态数据
    const needsDynamicData = props.dataSource && !props.data
    const hasData = data && data.length > 0

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

            const result: PieChartData = await response.json()
            setDynamicData(result)
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
        if (!chartRef.current || !hasData || !data) return

        const chart = echarts.init(chartRef.current, undefined, { renderer: 'svg' })
        instanceRef.current = chart

        const total = data.reduce((sum, d) => sum + d.value, 0)

        const option: echarts.EChartsCoreOption = {
            color: COLORS,
            tooltip: {
                trigger: 'item',
                backgroundColor: 'rgba(255,255,255,0.96)',
                borderColor: '#e4e4e7',
                borderWidth: 1,
                textStyle: { color: '#18181b', fontSize: 12 },
                formatter: (params: any) => {
                    const pct = total > 0 ? ((params.value / total) * 100).toFixed(1) : '0.0'
                    return `<span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${params.color};margin-right:6px;"></span>${params.name}<br/><span style="font-weight:600;margin-left:14px">${params.value}</span> <span style="color:#a1a1aa">(${pct}%)</span>`
                },
            },
            legend: {
                bottom: 0,
                textStyle: { color: '#71717a', fontSize: 11 },
                itemWidth: 8,
                itemHeight: 8,
                itemGap: 16,
                icon: 'circle',
            },
            series: [
                {
                    type: 'pie',
                    radius: props.donut ? ['40%', '70%'] : ['0%', '70%'],
                    center: ['50%', '45%'],
                    data: data,
                    label: {
                        show: props.showLabel ?? false,
                        formatter: (params: any) => {
                            const pct = total > 0 ? ((params.value / total) * 100).toFixed(0) : '0'
                            return `${pct}%`
                        },
                        fontSize: 11,
                        color: '#52525b',
                    },
                    labelLine: {
                        show: props.showLabel ?? false,
                        length: 8,
                        length2: 12,
                        lineStyle: { color: '#d4d4d8' },
                    },
                    itemStyle: {
                        borderColor: '#fff',
                        borderWidth: 2,
                        borderRadius: 4,
                    },
                    emphasis: {
                        scale: true,
                        scaleSize: 6,
                        itemStyle: { shadowBlur: 12, shadowColor: 'rgba(0,0,0,0.08)' },
                    },
                    animationType: 'scale',
                    animationEasing: 'cubicOut',
                    animationDuration: 600,
                },
            ],
        }

        chart.setOption(option)

        const ro = new ResizeObserver(() => chart.resize())
        ro.observe(chartRef.current)

        return () => {
            ro.disconnect()
            chart.dispose()
            instanceRef.current = null
        }
    }, [hasData, data, props.donut, props.showLabel])

    // 决定渲染内容
    const renderContent = useMemo(() => {
        if (isLoading) {
            return (
                <ChartSkeleton
                    title={props.title}
                    height={props.height || 'md'}
                    chartType="pie"
                    onRefresh={fetchDynamicData}
                />
            )
        }

        if (error) {
            return (
                <ChartSkeleton
                    title={props.title}
                    height={props.height || 'md'}
                    chartType="pie"
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
                    chartType="pie"
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
