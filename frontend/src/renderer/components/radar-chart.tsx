import { useEffect, useRef } from 'react'
import * as echarts from 'echarts/core'
import { RadarChart as ERadarChart } from 'echarts/charts'
import {
    TooltipComponent,
    LegendComponent,
} from 'echarts/components'
import { SVGRenderer } from 'echarts/renderers'
import clsx from 'clsx'
import type { BaseComponentProps } from '@json-render/react'

echarts.use([ERadarChart, TooltipComponent, LegendComponent, SVGRenderer])

interface RadarChartProps {
    title: string
    indicator: Array<{ name: string; max: number }>
    series: Array<{
        name: string
        data: number[]
    }>
    height: 'sm' | 'md' | 'lg' | 'xl'
    shape?: 'polygon' | 'circle'
}

const heightMap: Record<string, string> = {
    sm: 'h-48',
    md: 'h-64',
    lg: 'h-80',
    xl: 'h-96',
}

const COLORS = ['#6366f1', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']

export function RadarChart({ props }: BaseComponentProps<RadarChartProps>) {
    const chartRef = useRef<HTMLDivElement>(null)
    const instanceRef = useRef<echarts.ECharts | null>(null)

    useEffect(() => {
        if (!chartRef.current) return

        const chart = echarts.init(chartRef.current, undefined, { renderer: 'svg' })
        instanceRef.current = chart

        const option: echarts.EChartsCoreOption = {
            color: COLORS,
            tooltip: {
                trigger: 'item',
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
            radar: {
                indicator: props.indicator,
                shape: props.shape ?? 'polygon',
                splitNumber: 4,
                center: ['50%', props.series.length > 1 ? '45%' : '50%'],
                radius: '65%',
                axisName: {
                    color: '#71717a',
                    fontSize: 11,
                },
                splitLine: {
                    lineStyle: { color: '#e4e4e7' },
                },
                splitArea: {
                    areaStyle: {
                        color: ['rgba(244,244,245,0.3)', 'transparent'],
                    },
                },
                axisLine: {
                    lineStyle: { color: '#e4e4e7' },
                },
            },
            series: [
                {
                    type: 'radar',
                    data: props.series.map((s, i) => ({
                        name: s.name,
                        value: s.data,
                        symbol: 'circle',
                        symbolSize: 4,
                        lineStyle: { width: 2 },
                        areaStyle: { opacity: 0.1 },
                        itemStyle: { color: COLORS[i % COLORS.length] },
                    })),
                    emphasis: {
                        lineStyle: { width: 3 },
                        areaStyle: { opacity: 0.2 },
                    },
                },
            ],
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
            {props.title && (
                <div className="border-b border-zinc-100 px-4 py-3">
                    <h4 className="text-xs font-semibold text-zinc-800">{props.title}</h4>
                </div>
            )}
            <div className={clsx('w-full p-4', heightMap[props.height])}>
                <div ref={chartRef} className="w-full h-full" />
            </div>
        </div>
    )
}
