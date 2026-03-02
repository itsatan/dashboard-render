import type { BaseComponentProps } from '@json-render/react'

interface CardProps {
    title?: string
    subtitle?: string
    padding: 'none' | 'sm' | 'md' | 'lg'
}

const paddingMap: Record<string, string> = {
    none: '',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-5',
}

export function Card({ props, children }: BaseComponentProps<CardProps>) {
    const hasHeader = !!props.title
    return (
        <div className="rounded-lg border border-zinc-200 bg-white">
            {hasHeader && (
                <div className="border-b border-zinc-100 px-4 py-3">
                    <h3 className="text-xs font-semibold text-zinc-800">{props.title}</h3>
                    {props.subtitle && (
                        <p className="mt-0.5 text-[11px] text-zinc-400">{props.subtitle}</p>
                    )}
                </div>
            )}
            <div className={paddingMap[props.padding]}>
                {children}
            </div>
        </div>
    )
}
