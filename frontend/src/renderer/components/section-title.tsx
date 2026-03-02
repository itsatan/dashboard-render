import type { BaseComponentProps } from '@json-render/react'

interface SectionTitleProps {
    title: string
    description?: string
}

export function SectionTitle({ props }: BaseComponentProps<SectionTitleProps>) {
    return (
        <div className="flex items-start gap-3 py-1">
            {/* accent bar */}
            <div className="mt-0.75 h-4 w-0.75 shrink-0 rounded-full bg-zinc-900" />
            <div className="min-w-0">
                <h2 className="text-sm font-semibold tracking-tight text-zinc-900">{props.title}</h2>
                {props.description && (
                    <p className="mt-1 text-xs leading-relaxed text-zinc-400">{props.description}</p>
                )}
            </div>
        </div>
    )
}
