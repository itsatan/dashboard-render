import type { BaseComponentProps } from '@json-render/react'

interface CardProps {
    title?: string
    subtitle?: string
    padding: 'sm' | 'md' | 'lg'
}

const paddingMap: Record<string, string> = {
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-5',
}

export function Card({ props, children }: BaseComponentProps<CardProps>) {
    return (
        <div className="group relative rounded-lg bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04),0_4px_12px_rgba(0,0,0,0.03)] ring-1 ring-zinc-950/4 transition-shadow duration-300 hover:shadow-[0_2px_6px_rgba(0,0,0,0.06),0_8px_24px_rgba(0,0,0,0.04)]">
            {props.title && (
                <div className="relative px-4 py-3.5">
                    <div className="flex items-start gap-2.5">
                        <div className="mt-0.75 h-3.5 w-0.75 shrink-0 rounded-full bg-linear-to-b from-indigo-400 to-indigo-500/60" />
                        <div>
                            <h3 className="text-[13px] font-semibold tracking-[-0.01em] text-zinc-800">{props.title}</h3>
                            {props.subtitle && (
                                <p className="mt-0.5 text-[11px] leading-relaxed text-zinc-400">{props.subtitle}</p>
                            )}
                        </div>
                    </div>
                    <div className="absolute bottom-0 left-4 right-4 h-px bg-linear-to-r from-zinc-200/80 via-zinc-200/40 to-transparent" />
                </div>
            )}
            <div className={paddingMap[props.padding]}>
                {children}
            </div>
        </div>
    )
}
