import clsx from 'clsx'
import type { BaseComponentProps } from '@json-render/react'

interface CardProps {
    title?: string
    subtitle?: string
    padding: 'none' | 'sm' | 'md' | 'lg'
}

const paddingMap: Record<string, string> = {
    none: '',
    sm: 'p-3',
    md: 'p-5',
    lg: 'p-6',
}

export function Card({ props, children }: BaseComponentProps<CardProps>) {
    return (
        <div className={clsx('rounded-lg border border-zinc-200 bg-white shadow-sm', paddingMap[props.padding])}>
            {props.title && (
                <div className="mb-3">
                    <h3 className="text-sm font-semibold text-zinc-900">{props.title}</h3>
                    {props.subtitle && <p className="mt-0.5 text-xs text-zinc-500">{props.subtitle}</p>}
                </div>
            )}
            {children}
        </div>
    )
}
