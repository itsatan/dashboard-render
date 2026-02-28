import { LogoIcon } from '@/icons/logo-icon'

interface BreadcrumbNavProps {
    workspace: string
    projectId: string
}

export function BreadcrumbNav({
    workspace,
    projectId
}: BreadcrumbNavProps) {
    return (
        <div className="flex items-center gap-3">
            <div className="flex h-6 w-6 items-center justify-center rounded bg-zinc-950">
                <LogoIcon className="h-4 w-4 text-white" />
            </div>
            <nav className="flex items-center gap-2 text-[13px]">
                <span className="font-medium text-zinc-900">{workspace}</span>
                <span className="text-zinc-300">/</span>
                <span className="text-zinc-500 font-mono text-xs">{projectId}</span>
            </nav>
        </div>
    )
}
