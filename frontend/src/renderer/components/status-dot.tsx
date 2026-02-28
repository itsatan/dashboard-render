import clsx from 'clsx'
import type { BaseComponentProps } from '@json-render/react'

interface StatusDotProps {
    label: string
    status: 'healthy' | 'warning' | 'critical' | 'unknown'
}

const dotColors: Record<string, string> = {
    healthy: 'bg-emerald-500',
    warning: 'bg-amber-500',
    critical: 'bg-red-500',
    unknown: 'bg-zinc-300',
}

export function StatusDot({ props }: BaseComponentProps<StatusDotProps>) {
    return (
        <div className="flex items-center gap-2 rounded-lg border border-zinc-100 bg-white px-3 py-2">
            <span className={clsx('h-2 w-2 rounded-full', dotColors[props.status])} />
            <span className="text-xs text-zinc-700">{props.label}</span>
        </div>
    )
}
