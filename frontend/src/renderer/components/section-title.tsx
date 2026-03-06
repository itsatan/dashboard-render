import { useCallback } from 'react'
import type { BaseComponentProps } from '@json-render/react'
import { dashboardActions } from '@/store/dashboard-store'

interface SectionTitleProps {
    title: string
    description?: string
    showRefresh?: boolean
}

// Refresh icon component
function RefreshIcon({ className = '' }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 14 14" fill="none">
            <path
                d="M2 7a5 5 0 0 1 8.5-3.5M12 7a5 5 0 0 1-8.5 3.5"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
            />
            <path
                d="M10 2h2.5M10 2v2.5M4 12H1.5M4 12v-2.5"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    )
}

export function SectionTitle({ props }: BaseComponentProps<SectionTitleProps>) {
    const handleRefresh = useCallback(() => {
        dashboardActions.triggerRefresh()
    }, [])

    return (
        <div className="flex items-center justify-between gap-3 py-1">
            <div className="flex items-start gap-3 min-w-0">
                {/* accent bar */}
                <div className="mt-0.75 h-4 w-0.75 shrink-0 rounded-full bg-zinc-900" />
                <div className="min-w-0">
                    <h2 className="text-sm font-semibold tracking-tight text-zinc-900">{props.title}</h2>
                    {props.description && (
                        <p className="mt-1 text-xs leading-relaxed text-zinc-400">{props.description}</p>
                    )}
                </div>
            </div>

            {/* Refresh button */}
            <button
                onClick={handleRefresh}
                className="shrink-0 p-1.5 rounded-lg hover:bg-zinc-100 transition-colors group"
                title="刷新数据"
                aria-label="刷新数据"
            >
                <RefreshIcon className="w-3.5 h-3.5 text-zinc-400 group-hover:text-zinc-600 transition-colors" />
            </button>
        </div>
    )
}
