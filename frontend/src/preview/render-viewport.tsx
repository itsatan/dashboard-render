import type { Spec } from '@json-render/core'
import { Renderer, JSONUIProvider } from '@json-render/react'
import { registry } from '@/renderer/registry'

function SkeletonPlaceholder() {
    const stagger = (i: number) => ({
        opacity: 0,
        animation: `skeleton-fade-up 0.5s ease-out ${i * 0.1}s forwards`,
    })

    return (
        <div className="p-6 min-h-full flex flex-col gap-4">
            {/* section title skeleton */}
            <div className="flex flex-col gap-1.5 mb-1" style={stagger(0)}>
                <div className="skeleton h-4 w-36 rounded bg-zinc-100" />
                <div className="skeleton h-2.5 w-56 rounded bg-zinc-50" />
            </div>

            {/* 4-column metric cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3" style={stagger(1)}>
                {[0, 1, 2, 3].map((i) => (
                    <div
                        key={i}
                        className="skeleton rounded-xl border border-zinc-100 bg-zinc-50/40 p-4 flex flex-col gap-3"
                        style={stagger(2 + i)}
                    >
                        <div className="h-2 w-14 rounded-full bg-zinc-200/50" />
                        <div className="h-5 w-20 rounded bg-zinc-200/60" />
                        <div className="flex items-center gap-2">
                            <div className="h-1.5 w-8 rounded-full bg-indigo-200/30" />
                            <div className="h-1.5 w-5 rounded-full bg-zinc-200/40" />
                        </div>
                    </div>
                ))}
            </div>

            {/* main chart + side panels */}
            <div className="flex-1 grid grid-cols-3 gap-3 min-h-[180px]" style={stagger(6)}>
                {/* chart area */}
                <div className="col-span-2 skeleton rounded-xl border border-zinc-100 bg-zinc-50/40 p-5 flex flex-col" style={stagger(7)}>
                    <div className="flex items-center justify-between mb-4">
                        <div className="h-3 w-24 rounded bg-zinc-200/50" />
                        <div className="flex gap-2">
                            <div className="h-2.5 w-10 rounded-full bg-zinc-100" />
                            <div className="h-2.5 w-10 rounded-full bg-zinc-100" />
                        </div>
                    </div>
                    {/* faux chart area */}
                    <div className="flex-1 flex items-end gap-2 min-h-0 pb-1">
                        {[45, 70, 35, 60, 80, 50, 40, 65, 55, 75, 38, 58].map((h, i) => (
                            <div
                                key={i}
                                className="flex-1 rounded-sm bg-zinc-100/80"
                                style={{ height: `${h}%` }}
                            />
                        ))}
                    </div>
                    {/* axis ticks */}
                    <div className="flex justify-between mt-2 px-1">
                        {[0, 1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="h-1.5 w-6 rounded-full bg-zinc-200/40" />
                        ))}
                    </div>
                </div>

                {/* side panels */}
                <div className="flex flex-col gap-3" style={stagger(8)}>
                    <div className="skeleton flex-1 rounded-xl border border-zinc-100 bg-zinc-50/40 p-4 flex flex-col gap-2.5">
                        <div className="h-2.5 w-16 rounded bg-zinc-200/50" />
                        <div className="h-2 w-full rounded bg-zinc-100/60" />
                        <div className="h-2 w-3/4 rounded bg-zinc-100/60" />
                        <div className="mt-auto flex gap-1.5">
                            {[0, 1, 2].map((i) => (
                                <div key={i} className="h-5 flex-1 rounded bg-zinc-100/50" />
                            ))}
                        </div>
                    </div>
                    <div className="skeleton flex-1 rounded-xl border border-zinc-100 bg-zinc-50/40 p-4 flex flex-col gap-2.5">
                        <div className="h-2.5 w-20 rounded bg-zinc-200/50" />
                        <div className="flex-1 flex items-end gap-1.5 pt-2">
                            {[40, 65, 30, 50, 75, 45].map((h, i) => (
                                <div
                                    key={i}
                                    className="flex-1 rounded-sm bg-zinc-100/70"
                                    style={{ height: `${h}%` }}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* status indicator */}
            <div
                className="flex items-center justify-center gap-2 pt-1"
                style={stagger(9)}
            >
                <svg width="12" height="12" viewBox="0 0 12 12" className="text-indigo-400/50" style={{ animation: 'skeleton-status-pulse 2s ease-in-out infinite' }}>
                    <circle cx="6" cy="6" r="2" fill="currentColor" />
                </svg>
                <span
                    className="text-[10px] font-mono text-zinc-300 tracking-wide"
                    style={{ animation: 'skeleton-status-pulse 2s ease-in-out infinite' }}
                >
                    Generating layout...
                </span>
            </div>
        </div>
    )
}

interface RenderViewportProps {
    spec?: Spec | null
    loading?: boolean
}

export function RenderViewport({
    spec,
    loading
}: RenderViewportProps) {

    const hasElements = !!spec && Object.keys(spec.elements).length > 0

    if (hasElements) {
        return (
            <div className="flex-1 overflow-auto bg-white relative">
                <div className="p-6">
                    <JSONUIProvider registry={registry}>
                        <Renderer spec={spec} registry={registry} loading={loading} />
                    </JSONUIProvider>
                </div>
            </div>
        )
    }

    if (loading) {
        return (
            <div className="flex-1 overflow-auto bg-white relative">
                <SkeletonPlaceholder />
            </div>
        )
    }

    return (
        <div className="flex-1 overflow-auto bg-white relative">
            <WelcomePlaceholder />
        </div>
    )
}

/* ------------------------------------------------------------------ */
/*  Welcome Placeholder – Architectural Blueprint Style               */
/* ------------------------------------------------------------------ */

const CAPABILITY_CHIPS = [
    'Grid', 'Flex', 'Card', 'MetricCard', 'Chart', 'StatusDot',
] as const

function BlueprintGraphic() {
    return (
        <div
            className="relative w-[280px] h-[180px]"
            style={{ animation: 'welcome-float 6s ease-in-out infinite' }}
        >
            <svg
                viewBox="0 0 280 180"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-full"
            >
                {/* background grid dots */}
                {Array.from({ length: 13 }).map((_, col) =>
                    Array.from({ length: 8 }).map((_, row) => (
                        <circle
                            key={`${col}-${row}`}
                            cx={20 + col * 20}
                            cy={20 + row * 20}
                            r={0.6}
                            fill="#d4d4d8"
                            opacity={0.5}
                        />
                    ))
                )}

                {/* top metric card outlines – 4 small rectangles */}
                {[0, 1, 2, 3].map((i) => (
                    <rect
                        key={`card-${i}`}
                        x={24 + i * 58}
                        y={24}
                        width={50}
                        height={32}
                        rx={4}
                        stroke="#a1a1aa"
                        strokeWidth={0.8}
                        strokeDasharray="3 2"
                        opacity={0.45}
                        style={{
                            strokeDashoffset: 80,
                            animation: `welcome-dash-travel 1.8s ease-out ${0.3 + i * 0.12}s forwards`,
                        }}
                    />
                ))}

                {/* metric card inner bars */}
                {[0, 1, 2, 3].map((i) => (
                    <g key={`bar-${i}`} opacity={0.3}>
                        <rect x={32 + i * 58} y={33} width={16} height={2} rx={1} fill="#a1a1aa" />
                        <rect x={32 + i * 58} y={39} width={24} height={3} rx={1.5} fill="#a1a1aa" />
                        <rect x={32 + i * 58} y={46} width={10} height={2} rx={1} fill="#a1a1aa" />
                    </g>
                ))}

                {/* main chart area */}
                <rect
                    x={24}
                    y={68}
                    width={148}
                    height={88}
                    rx={6}
                    stroke="#a1a1aa"
                    strokeWidth={0.8}
                    strokeDasharray="4 3"
                    opacity={0.4}
                    style={{
                        strokeDashoffset: 500,
                        animation: 'welcome-dash-travel 2.2s ease-out 0.6s forwards',
                    }}
                />

                {/* chart area inner – stylized line chart */}
                <polyline
                    points="40,136 60,118 80,126 100,105 120,112 140,95 155,100"
                    stroke="#818cf8"
                    strokeWidth={1.2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                    opacity={0.35}
                    strokeDasharray="120"
                    strokeDashoffset={120}
                    style={{
                        animation: 'welcome-dash-travel 2s ease-out 1s forwards',
                    }}
                />

                {/* chart axis labels */}
                {[0, 1, 2, 3, 4].map((i) => (
                    <rect
                        key={`axis-${i}`}
                        x={40 + i * 24}
                        y={144}
                        width={8}
                        height={1.5}
                        rx={0.75}
                        fill="#d4d4d8"
                        opacity={0.4}
                    />
                ))}

                {/* right side panel – sidebar cards */}
                <rect
                    x={184}
                    y={68}
                    width={72}
                    height={40}
                    rx={4}
                    stroke="#a1a1aa"
                    strokeWidth={0.8}
                    strokeDasharray="3 2"
                    opacity={0.4}
                    style={{
                        strokeDashoffset: 250,
                        animation: 'welcome-dash-travel 1.6s ease-out 0.8s forwards',
                    }}
                />
                <rect
                    x={184}
                    y={116}
                    width={72}
                    height={40}
                    rx={4}
                    stroke="#a1a1aa"
                    strokeWidth={0.8}
                    strokeDasharray="3 2"
                    opacity={0.4}
                    style={{
                        strokeDashoffset: 250,
                        animation: 'welcome-dash-travel 1.6s ease-out 1s forwards',
                    }}
                />

                {/* right panel inner content */}
                <g opacity={0.25}>
                    <rect x={192} y={78} width={20} height={2} rx={1} fill="#a1a1aa" />
                    <rect x={192} y={84} width={32} height={2} rx={1} fill="#a1a1aa" />
                    <rect x={192} y={90} width={14} height={2} rx={1} fill="#a1a1aa" />
                    <rect x={192} y={126} width={18} height={2} rx={1} fill="#a1a1aa" />
                    <rect x={192} y={132} width={28} height={2} rx={1} fill="#a1a1aa" />
                    <rect x={192} y={138} width={12} height={2} rx={1} fill="#a1a1aa" />
                </g>

                {/* pulsing accent node on chart peak */}
                <circle
                    cx={140}
                    cy={95}
                    r={8}
                    fill="#818cf8"
                    opacity={0.08}
                    style={{ animation: 'welcome-pulse-ring 3s ease-in-out infinite' }}
                />
                <circle cx={140} cy={95} r={2.5} fill="#818cf8" opacity={0.5} />
            </svg>
        </div>
    )
}

function WelcomePlaceholder() {
    return (
        <div className="flex-1 flex flex-col items-center justify-center min-h-full select-none px-6">
            {/* hero area */}
            <div
                className="flex flex-col items-center gap-8"
                style={{ animation: 'welcome-fade-in 0.8s ease-out both' }}
            >
                <BlueprintGraphic />

                <div className="flex flex-col items-center gap-3 max-w-[360px]">
                    <h2 className="text-[15px] font-semibold tracking-tight text-zinc-800">
                        JSON-Render Preview
                    </h2>
                    <p className="text-[12px] leading-relaxed text-zinc-400 text-center">
                        在左侧输入你的仪表盘描述，点击
                        <span className="inline-flex items-center mx-1 px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-600 font-medium text-[11px] align-middle">
                            Generate
                        </span>
                        即可实时生成界面
                    </p>
                </div>
            </div>

            {/* capability chips */}
            <div
                className="mt-10 flex flex-wrap items-center justify-center gap-2"
                style={{ animation: 'welcome-fade-in 0.8s ease-out 0.3s both' }}
            >
                <span className="text-[10px] text-zinc-300 font-mono mr-1">components:</span>
                {CAPABILITY_CHIPS.map((chip) => (
                    <span
                        key={chip}
                        className="px-2 py-0.5 rounded-full border border-zinc-100 bg-zinc-50/80 text-[10px] font-mono text-zinc-400 tracking-tight"
                    >
                        {chip}
                    </span>
                ))}
            </div>
        </div>
    )
}
