import { useEffect, useRef } from 'react'
import * as echarts from 'echarts/core'
import { GaugeChart as EGaugeChart } from 'echarts/charts'
import {
    TooltipComponent,
} from 'echarts/components'
import { SVGRenderer } from 'echarts/renderers'
import clsx from 'clsx'
import type { BaseComponentProps } from '@json-render/react'

echarts.use([EGaugeChart, TooltipComponent, SVGRenderer])

interface GaugeChartProps {
    title: string
    value: number
    min?: number
    max?: number
    unit?: string
    height: 'sm' | 'md' | 'lg' | 'xl'
    color?: 'blue' | 'green' | 'red' | 'amber' | 'auto'
}

const heightMap: Record<string, string> = {
    sm: 'h-48',
    md: 'h-64',
    lg: 'h-80',
    xl: 'h-96',
}

const COLOR_MAP: Record<string, string> = {
    blue: '#3b82f6',
    green: '#10b981',
    red: '#ef4444',
    amber: '#f59e0b',
}

function getAutoColorStops() {
    return [
        [0.3, '#10b981'],
        [0.7, '#f59e0b'],
        [1, '#ef4444'],
    ] as [number, string][]
}

export function GaugeChart({ props }: BaseComponentProps<GaugeChartProps>) {
    const chartRef = useRef<HTMLDivElement>(null)
    const instanceRef = useRef<echarts.ECharts | null>(null)

    useEffect(() => {
        if (!chartRef.current) return

        const chart = echarts.init(chartRef.current, undefined, { renderer: 'svg' })
        instanceRef.current = chart

        const min = props.min ?? 0
        const max = props.max ?? 100
        const colorMode = props.color ?? 'auto'

        const axisLineColor = colorMode === 'auto'
            ? getAutoColorStops()
            : [[1, COLOR_MAP[colorMode] ?? '#6366f1']] as [number, string][]

        const option: echarts.EChartsCoreOption = {
            tooltip: {
                trigger: 'item',
                backgroundColor: 'rgba(255,255,255,0.96)',
                borderColor: '#e4e4e7',
                borderWidth: 1,
                textStyle: { color: '#18181b', fontSize: 12 },
                formatter: () => {
                    return `${props.title}<br/><span style="font-weight:600">${props.value}</span>${props.unit ? ` ${props.unit}` : ''}`
                },
            },
            series: [
                {
                    type: 'gauge',
                    min,
                    max,
                    center: ['50%', '55%'],
                    radius: '85%',
                    startAngle: 210,
                    endAngle: -30,
                    progress: {
                        show: true,
                        width: 14,
                        roundCap: true,
                    },
                    axisLine: {
                        lineStyle: {
                            width: 14,
                            color: axisLineColor,
                            opacity: colorMode === 'auto' ? 1 : 0.15,
                        },
                        roundCap: true,
                    },
                    axisTick: { show: false },
                    splitLine: {
                        length: 8,
                        lineStyle: { width: 1.5, color: '#d4d4d8' },
                    },
                    axisLabel: {
                        distance: 20,
                        color: '#a1a1aa',
                        fontSize: 10,
                    },
                    pointer: {
                        length: '55%',
                        width: 4,
                        itemStyle: { color: '#52525b' },
                    },
                    anchor: {
                        show: true,
                        size: 8,
                        showAbove: true,
                        itemStyle: {
                            borderColor: '#52525b',
                            borderWidth: 2,
                            color: '#fff',
                        },
                    },
                    title: {
                        show: false,
                    },
                    detail: {
                        valueAnimation: true,
                        fontSize: 22,
                        fontWeight: 600,
                        color: '#18181b',
                        offsetCenter: [0, '70%'],
                        formatter: (value: number) => {
                            return `${value}${props.unit ? ` ${props.unit}` : ''}`
                        },
                    },
                    data: [{ value: props.value }],
                    animation: true,
                    animationDuration: 800,
                    animationEasing: 'cubicOut',
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
