import type { Spec } from '@json-render/core'
import { BrowserToolbar } from '@/preview/browser-toolbar'
import { RenderViewport } from '@/preview/render-viewport'

interface PreviewPanelProps {
    spec?: Spec | null
    loading?: boolean
}

export function PreviewPanel({ spec, loading }: PreviewPanelProps) {
    return (
        <section className="relative flex-1 bg-grid p-6 overflow-hidden flex flex-col">
            <div className="flex-1 flex flex-col mx-auto w-full min-h-0">
                <div className="flex flex-1 flex-col rounded-xl border border-zinc-200 bg-white shadow-[0_20px_50px_rgba(0,0,0,0.08)] overflow-hidden min-h-0">
                    <BrowserToolbar url="https://render.internal/preview_id_772" active={!!spec} />
                    <RenderViewport spec={spec} loading={loading} />
                </div>
            </div>
        </section>
    )
}
