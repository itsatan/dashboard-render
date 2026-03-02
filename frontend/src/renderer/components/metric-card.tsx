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

const trendConfig: Record<string, { icon: React.ReactNode; pill: string; text: string }> = {
    up: {
        icon: (
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M6 9.5V2.5M6 2.5L3 5.5M6 2.5L9 5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        ),
        pill: 'bg-emerald-50 text-emerald-600',
        text: 'text-emerald-600',
    },
    down: {
        icon: (
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M6 2.5V9.5M6 9.5L3 6.5M6 9.5L9 6.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        ),
        pill: 'bg-red-50 text-red-600',
        text: 'text-red-600',
    },
    flat: {
        icon: (
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M2.5 6H9.5M9.5 6L7 3.5M9.5 6L7 8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        ),
        pill: 'bg-zinc-100 text-zinc-500',
        text: 'text-zinc-500',
    },
}

export function MetricCard({ props }: BaseComponentProps<MetricCardProps>) {
    const trend = props.trend ? trendConfig[props.trend] : null
    return (
        <div className="group relative rounded-lg border border-zinc-200 bg-white">
            <div className="px-4 pt-4 pb-3.5">
                {/* label */}
                <p className="text-[11px] font-medium tracking-wide text-zinc-400 uppercase">{props.label}</p>

                {/* value row */}
                <div className="mt-2 flex items-end justify-between gap-3">
                    <div className="flex items-baseline gap-1.5 min-w-0">
                        <span className="text-[26px] font-semibold leading-none tracking-tight text-zinc-900" style={{ fontFeatureSettings: '"tnum"' }}>
                            {props.value}
                        </span>
                        {props.unit && (
                            <span className="text-xs font-medium text-zinc-300 whitespace-nowrap">{props.unit}</span>
                        )}
                    </div>

                    {/* trend pill */}
                    {trend && props.trendValue && (
                        <span className={clsx(
                            'inline-flex shrink-0 items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[11px] font-medium leading-none',
                            trend.pill,
                        )}>
                            {trend.icon}
                            {props.trendValue}
                        </span>
                    )}
                </div>
            </div>
        </div>
    )
}
