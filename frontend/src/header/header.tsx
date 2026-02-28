import { BreadcrumbNav } from '@/header/breadcrumb-nav'
import { StatusBadge } from '@/header/status-badge'

const statusLabels: Record<string, string> = {
    ready: 'Engine Ready',
    loading: 'Generating...',
    error: 'Error',
}

interface HeaderProps {
    status?: 'ready' | 'loading' | 'error'
}

export function Header({ status = 'ready' }: HeaderProps) {
    return (
        <header className="flex h-12 items-center justify-between border-b border-zinc-100 px-4 bg-white/80 backdrop-blur-md z-20">
            <BreadcrumbNav workspace="Dashboard" projectId="PROJECT_ID_882" />
            <StatusBadge status={status} label={statusLabels[status]} />
        </header>
    )
}
