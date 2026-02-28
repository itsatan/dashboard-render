import type { BaseComponentProps } from '@json-render/react'

interface GridProps {
    columns: number
    gap: number
}

export function Grid({ props, children }: BaseComponentProps<GridProps>) {
    return (
        <div
            className="grid w-full"
            style={{
                gridTemplateColumns: `repeat(${props.columns}, minmax(0, 1fr))`,
                gap: `${props.gap * 4}px`,
            }}
        >
            {children}
        </div>
    )
}
