import clsx from 'clsx'

interface StatusBadgeProps {
    status: 'ready' | 'loading' | 'error'
    label: string
}

const statusStyles = {
    ready: { dot: 'bg-emerald-500 animate-pulse', text: 'text-emerald-600 bg-emerald-50' },
    loading: { dot: 'bg-amber-500 animate-pulse', text: 'text-amber-600 bg-amber-50' },
    error: { dot: 'bg-red-500', text: 'text-red-600 bg-red-50' },
}

export function StatusBadge({
    status,
    label
}: StatusBadgeProps) {
    const style = statusStyles[status]
    return (
        <span className={clsx('flex items-center gap-1.5 px-2 py-1 text-[11px] font-medium rounded', style.text)}>
            <span className={clsx('h-1.5 w-1.5 rounded-full', style.dot)} />
            {label}
        </span>
    )
}
