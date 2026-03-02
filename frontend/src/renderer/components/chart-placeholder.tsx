import clsx from 'clsx'
import type { BaseComponentProps } from '@json-render/react'

interface ChartPlaceholderProps {
    title: string
    chartType: string
    height: 'sm' | 'md' | 'lg' | 'xl'
}

const heightMap: Record<string, string> = {
    sm: 'h-32',
    md: 'h-48',
    lg: 'h-64',
    xl: 'h-80',
}

const chartTypeLabels: Record<string, string> = {
    line: 'Line Chart',
    bar: 'Bar Chart',
    area: 'Area Chart',
    pie: 'Pie Chart',
    donut: 'Donut Chart',
    scatter: 'Scatter Plot',
    'stacked-area': 'Stacked Area Chart',
    topology: 'Topology Graph',
}

export function ChartPlaceholder({ props }: BaseComponentProps<ChartPlaceholderProps>) {
    return (
        <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm">
            <div className="border-b border-zinc-100 px-4 py-3">
                <h4 className="text-xs font-semibold text-zinc-800">{props.title}</h4>
            </div>
            <div className={clsx(
                'flex flex-col items-center justify-center bg-zinc-50/50',
                heightMap[props.height],
            )}>
                <div className="font-mono text-xs text-zinc-300">
                    {chartTypeLabels[props.chartType] ?? props.chartType}
                </div>
                <div className="mt-1 text-[10px] italic text-zinc-300">
                    Placeholder — connect chart library
                </div>
            </div>
        </div>
    )
}
