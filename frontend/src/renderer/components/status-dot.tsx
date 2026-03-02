import clsx from 'clsx'
import type { BaseComponentProps } from '@json-render/react'

interface StatusDotProps {
    label: string
    status: 'healthy' | 'warning' | 'critical' | 'unknown'
}

const statusConfig: Record<string, { dot: string; ring: string; bg: string; text: string; pulse: boolean }> = {
    healthy: {
        dot: 'bg-emerald-500',
        ring: 'ring-emerald-500/20',
        bg: 'bg-emerald-50/50',
        text: 'text-emerald-700',
        pulse: false,
    },
    warning: {
        dot: 'bg-amber-500',
        ring: 'ring-amber-500/20',
        bg: 'bg-amber-50/50',
        text: 'text-amber-700',
        pulse: true,
    },
    critical: {
        dot: 'bg-red-500',
        ring: 'ring-red-500/20',
        bg: 'bg-red-50/50',
        text: 'text-red-700',
        pulse: true,
    },
    unknown: {
        dot: 'bg-zinc-300',
        ring: 'ring-zinc-300/20',
        bg: 'bg-zinc-50/50',
        text: 'text-zinc-500',
        pulse: false,
    },
}

export function StatusDot({ props }: BaseComponentProps<StatusDotProps>) {
    const config = statusConfig[props.status]

    return (
        <div className={clsx(
            'inline-flex items-center gap-2 rounded-lg border border-zinc-200 px-3 py-2',
            config.bg,
        )}>
            <span className="relative flex h-2 w-2 shrink-0">
                {config.pulse && (
                    <span className={clsx('absolute inset-0 rounded-full opacity-75 animate-ping', config.dot)} />
                )}
                <span className={clsx('relative h-2 w-2 rounded-full ring-2', config.dot, config.ring)} />
            </span>
            <span className={clsx('text-xs font-medium', config.text)}>{props.label}</span>
        </div>
    )
}
