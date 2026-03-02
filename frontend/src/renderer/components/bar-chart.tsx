import { useEffect, useRef } from 'react'
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

echarts.use([EBarChart, GridComponent, TooltipComponent, LegendComponent, SVGRenderer])

interface BarChartProps {
    title: string
    xAxis: string[]
    series: Array<{
        name: string
        data: number[]
    }>
    height: 'sm' | 'md' | 'lg' | 'xl'
    stack?: boolean
    horizontal?: boolean
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

    useEffect(() => {
        if (!chartRef.current) return

        const chart = echarts.init(chartRef.current, undefined, { renderer: 'svg' })
        instanceRef.current = chart

        const isHorizontal = props.horizontal ?? false

        const categoryAxis = {
            type: 'category' as const,
            data: props.xAxis,
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
                show: props.series.length > 1,
                bottom: 0,
                textStyle: { color: '#71717a', fontSize: 11 },
                itemWidth: 12,
                itemHeight: 8,
                itemGap: 16,
            },
            grid: {
                top: 12,
                right: 16,
                bottom: props.series.length > 1 ? 32 : 12,
                left: 0,
                containLabel: true,
            },
            xAxis: isHorizontal ? valueAxis : categoryAxis,
            yAxis: isHorizontal ? categoryAxis : valueAxis,
            series: props.series.map((s) => ({
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
