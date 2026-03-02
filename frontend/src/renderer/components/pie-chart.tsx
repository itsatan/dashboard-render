import { useEffect, useRef } from 'react'
import * as echarts from 'echarts/core'
import { PieChart as EPieChart } from 'echarts/charts'
import {
    TooltipComponent,
    LegendComponent,
} from 'echarts/components'
import { SVGRenderer } from 'echarts/renderers'
import clsx from 'clsx'
import type { BaseComponentProps } from '@json-render/react'

echarts.use([EPieChart, TooltipComponent, LegendComponent, SVGRenderer])

interface PieChartProps {
    title: string
    data: Array<{ name: string; value: number }>
    height: 'sm' | 'md' | 'lg' | 'xl'
    donut?: boolean
    showLabel?: boolean
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

    useEffect(() => {
        if (!chartRef.current) return

        const chart = echarts.init(chartRef.current, undefined, { renderer: 'svg' })
        instanceRef.current = chart

        const total = props.data.reduce((sum, d) => sum + d.value, 0)

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
                    data: props.data,
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
    }, [props])

    return (
        <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white">
            <div className="border-b border-zinc-100 px-4 py-3">
                <h4 className="text-xs font-semibold text-zinc-800">{props.title}</h4>
            </div>
            <div className={clsx('w-full p-4', heightMap[props.height])}>
                <div ref={chartRef} className="w-full h-full" />
            </div>
        </div>
    )
}
