import clsx from 'clsx'
import type { BaseComponentProps } from '@json-render/react'

interface MetricCardProps {
    label: string
    value: string
    unit?: string
    trend?: 'up' | 'down' | 'flat'
    trendValue?: string
    color: 'default' | 'blue' | 'green' | 'red' | 'amber'
}

const colorMap: Record<string, string> = {
    default: 'border-zinc-200',
    blue: 'border-zinc-200',
    green: 'border-zinc-200',
    red: 'border-zinc-200',
    amber: 'border-zinc-200',
}

const trendIcons: Record<string, string> = {
    up: '↑',
    down: '↓',
    flat: '→',
}

const trendColors: Record<string, string> = {
    up: 'text-emerald-600',
    down: 'text-red-600',
    flat: 'text-zinc-400',
}

export function MetricCard({ props }: BaseComponentProps<MetricCardProps>) {
    return (
        <div className={clsx('rounded-lg border bg-white p-4 shadow-sm', colorMap[props.color])}>
            <p className="mb-1 text-xs font-medium text-zinc-500">{props.label}</p>
            <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-bold tracking-tight text-zinc-900">{props.value}</span>
                {props.unit && <span className="text-xs text-zinc-400">{props.unit}</span>}
            </div>
            {props.trend && props.trendValue && (
                <div className={clsx('mt-2 flex items-center gap-1 text-xs font-medium', trendColors[props.trend])}>
                    <span>{trendIcons[props.trend]}</span>
                    <span>{props.trendValue}</span>
                </div>
            )}
        </div>
    )
}
