import clsx from 'clsx'
import type { BaseComponentProps } from '@json-render/react'

interface ChartPlaceholderProps {
    title: string
    chartType: string
    height: 'sm' | 'md' | 'lg' | 'xl'
}

const heightMap: Record<string, string> = {
    sm: 'h-32',
    md: 'h-48',
    lg: 'h-64',
    xl: 'h-80',
}

const chartTypeLabels: Record<string, string> = {
    line: '折线图',
    bar: '柱状图',
    area: '面积图',
    pie: '饼图',
    donut: '环形图',
    scatter: '散点图',
    'stacked-area': '堆叠面积图',
    topology: '拓扑图',
}

function ChartIllustration({ type }: { type: string }) {
    const common = 'text-zinc-200'

    switch (type) {
        case 'line':
        case 'area':
            return (
                <svg width="120" height="60" viewBox="0 0 120 60" fill="none" className={common}>
                    {[15, 30, 45].map((y) => (
                        <line key={y} x1="0" y1={y} x2="120" y2={y} stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 2" opacity="0.5" />
                    ))}
                    {type === 'area' && (
                        <path d="M0,40 L20,28 L40,35 L60,18 L80,25 L100,12 L120,20 L120,60 L0,60Z" fill="currentColor" opacity="0.15" />
                    )}
                    <polyline points="0,40 20,28 40,35 60,18 80,25 100,12 120,20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <circle cx="60" cy="18" r="2.5" fill="white" stroke="currentColor" strokeWidth="1.5" />
                </svg>
            )

        case 'bar':
            return (
                <svg width="120" height="60" viewBox="0 0 120 60" fill="none" className={common}>
                    <line x1="0" y1="59" x2="120" y2="59" stroke="currentColor" strokeWidth="0.5" opacity="0.5" />
                    {[
                        { x: 8, h: 30 },
                        { x: 28, h: 45 },
                        { x: 48, h: 25 },
                        { x: 68, h: 50 },
                        { x: 88, h: 35 },
                        { x: 108, h: 40 },
                    ].map(({ x, h }) => (
                        <rect key={x} x={x - 6} y={59 - h} width="12" height={h} rx="2" fill="currentColor" opacity="0.25" />
                    ))}
                </svg>
            )

        case 'pie':
        case 'donut':
            return (
                <svg width="60" height="60" viewBox="0 0 60 60" fill="none" className={common}>
                    <circle cx="30" cy="30" r="26" stroke="currentColor" strokeWidth="1" opacity="0.2" />
                    <path d="M30,4 A26,26 0 0,1 56,30 L30,30 Z" fill="currentColor" opacity="0.2" />
                    <path d="M56,30 A26,26 0 0,1 30,56 L30,30 Z" fill="currentColor" opacity="0.12" />
                    <path d="M30,56 A26,26 0 0,1 4,30 L30,30 Z" fill="currentColor" opacity="0.08" />
                    {type === 'donut' && <circle cx="30" cy="30" r="14" fill="white" />}
                </svg>
            )

        case 'scatter':
            return (
                <svg width="120" height="60" viewBox="0 0 120 60" fill="none" className={common}>
                    {[15, 30, 45].map((y) => (
                        <line key={y} x1="0" y1={y} x2="120" y2={y} stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 2" opacity="0.3" />
                    ))}
                    {[
                        [15, 38], [25, 22], [35, 42], [42, 30], [55, 15],
                        [62, 35], [72, 20], [80, 28], [90, 12], [105, 25],
                    ].map(([cx, cy], i) => (
                        <circle key={i} cx={cx} cy={cy} r="3" fill="currentColor" opacity={0.15 + (i % 3) * 0.08} />
                    ))}
                </svg>
            )

        default:
            return (
                <svg width="120" height="60" viewBox="0 0 120 60" fill="none" className={common}>
                    {[
                        [20, 15], [50, 15], [80, 15], [100, 15],
                        [35, 35], [65, 35], [95, 35],
                        [50, 55],
                    ].map(([cx, cy], i) => (
                        <g key={i}>
                            <circle cx={cx} cy={cy} r="5" stroke="currentColor" strokeWidth="1" opacity="0.3" />
                            {i < 4 && i < 3 && (
                                <line x1={Number(cx) + 5} y1={cy} x2={[50, 80, 100][i] - 5} y2={15} stroke="currentColor" strokeWidth="0.5" opacity="0.2" />
                            )}
                        </g>
                    ))}
                    <line x1="25" y1="18" x2="33" y2="32" stroke="currentColor" strokeWidth="0.5" opacity="0.2" />
                    <line x1="55" y1="18" x2="48" y2="32" stroke="currentColor" strokeWidth="0.5" opacity="0.2" />
                    <line x1="55" y1="18" x2="62" y2="32" stroke="currentColor" strokeWidth="0.5" opacity="0.2" />
                    <line x1="50" y1="40" x2="50" y2="50" stroke="currentColor" strokeWidth="0.5" opacity="0.2" />
                </svg>
            )
    }
}

export function ChartPlaceholder({ props }: BaseComponentProps<ChartPlaceholderProps>) {
    return (
        <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white">
            {props.title && (
                <div className="border-b border-zinc-100 px-4 py-3">
                    <h4 className="text-xs font-semibold text-zinc-800">{props.title}</h4>
                </div>
            )}
            <div className={clsx(
                'flex flex-col items-center justify-center gap-3',
                heightMap[props.height],
            )}>
                <ChartIllustration type={props.chartType} />
                <span className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-[10px] font-medium text-zinc-400">
                    {chartTypeLabels[props.chartType] ?? props.chartType}
                </span>
            </div>
        </div>
    )
}
