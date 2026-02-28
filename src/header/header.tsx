import { BreadcrumbNav } from '@/header/breadcrumb-nav'
import { StatusBadge } from '@/header/status-badge'

export function Header() {
    return (
        <header className="flex h-12 items-center justify-between border-b border-zinc-100 px-4 bg-white/80 backdrop-blur-md z-20">
            <BreadcrumbNav workspace="Dashboard" projectId="PROJECT_ID_882" />
            <StatusBadge status="ready" label="Engine Ready" />
        </header>
    )
}
