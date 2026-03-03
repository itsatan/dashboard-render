import clsx from 'clsx'
import type { BaseComponentProps } from '@json-render/react'

interface FlexProps {
    direction: 'row' | 'col'
    gap: number
    align?: 'start' | 'center' | 'end' | 'stretch'
    justify?: 'start' | 'center' | 'end' | 'between' | 'around'
}

const alignMap: Record<string, string> = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
    stretch: 'items-stretch',
}

const justifyMap: Record<string, string> = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    between: 'justify-between',
    around: 'justify-around',
}

export function Flex({ props, children }: BaseComponentProps<FlexProps>) {
    return (
        <div
            className={clsx(
                'flex w-full',
                props.direction === 'col' ? 'flex-col' : 'flex-row',
                props.align && alignMap[props.align],
                props.justify && justifyMap[props.justify],
                props.direction === 'row' && '*:flex-1 *:min-w-0',
            )}
            style={{ gap: `${props.gap * 4}px` }}
        >
            {children}
        </div>
    )
}
