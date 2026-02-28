import type { BaseComponentProps } from '@json-render/react'

interface SectionTitleProps {
    title: string
    description?: string
}

export function SectionTitle({ props }: BaseComponentProps<SectionTitleProps>) {
    return (
        <div className="mb-1">
            <h2 className="text-sm font-bold text-zinc-900">{props.title}</h2>
            {props.description && (
                <p className="mt-0.5 text-xs text-zinc-500">{props.description}</p>
            )}
        </div>
    )
}
