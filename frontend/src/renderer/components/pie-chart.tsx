import { useEffect, useRef, useState, useCallback } from 'react'
import * as echarts from 'echarts/core'
import { PieChart as EPieChart } from 'echarts/charts'
import {
    TooltipComponent,
    LegendComponent,
} from 'echarts/components'
import { SVGRenderer } from 'echarts/renderers'
import clsx from 'clsx'
import type { BaseComponentProps } from '@json-render/react'
import { UniversalChartPlaceholder } from './universal-chart-placeholder'
import type { DataSourceConfig, PieChartData } from '@/context/data-context'
import { dashboardStore, selectors } from '@/store/dashboard-store'

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
