import clsx from 'clsx'

function SkeletonPlaceholder() {
    return (
        <div className="p-6 min-h-full flex flex-col">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                {[12, 16, 10, 14].map((width, i) => (
                    <div key={i} className="skeleton h-28 rounded-xl border border-zinc-100 bg-zinc-50/50 flex flex-col items-center justify-center gap-2">
                        <div className={clsx('h-2 bg-zinc-200/60 rounded-full', `w-${width}`)} />
                        <span className="text-[10px] text-zinc-300 font-mono tracking-tight italic">
                            Metric Card Placeholder
                        </span>
                    </div>
                ))}
            </div>
            <div className="skeleton flex-1 w-full rounded-lg border border-zinc-100 bg-zinc-50/50 flex items-center justify-center">
                <p className="text-sm text-zinc-300 italic">Waiting for JSON-Render output...</p>
            </div>
        </div>
    )
}

interface RenderViewportProps {
    spec?: unknown | null
    loading?: boolean
}

export function RenderViewport({
    spec
}: RenderViewportProps) {
    if (!spec) {
        return (
            <div className="flex-1 overflow-auto bg-white relative">
                <SkeletonPlaceholder />
            </div>
        )
    }
    return (
        <div className="flex-1 overflow-auto bg-white relative">
            <div className="p-6">
                {/* <Renderer spec={spec} /> */}
            </div>
        </div>
    )
}
