import { useCallback, useEffect, useRef, useState } from 'react'
import { nanoid } from 'nanoid'
import { Header } from '@/header/header'
import { Sidebar } from '@/sidebar/sidebar'
import { PreviewPanel } from '@/preview/preview-panel'
import { useAgentStream } from '@/hooks/use-agent-stream'

export function App() {

    const [shareId, setShareId] = useState(() => nanoid(8))

    const { spec: streamSpec, isStreaming, error, thinkingSteps, send } = useAgentStream()

    const onGenerate = useCallback(async (prompt: string) => {
        setShareId(nanoid(8))
        await send(prompt)
    }, [send])

    const prevIsStreamingRef = useRef(isStreaming)

    useEffect(() => {
        if (prevIsStreamingRef.current && !isStreaming && streamSpec && Object.keys(streamSpec.elements).length > 0) {
            localStorage.setItem(shareId, JSON.stringify(streamSpec))
        }
        prevIsStreamingRef.current = isStreaming
    }, [isStreaming, streamSpec, shareId])

    const shareUrl = `${window.location.origin}/s/${shareId}`

    const engineStatus = isStreaming ? 'loading' as const : error ? 'error' as const : 'ready' as const

    return (
        <div className="flex h-screen flex-col">
            <Header status={engineStatus} />
            <main className="flex flex-1 overflow-hidden bg-zinc-50">
                <Sidebar
                    onGenerate={onGenerate}
                    isGenerating={isStreaming}
                    thinkingSteps={thinkingSteps}
                    thinkingError={error?.message}
                />
                <PreviewPanel spec={streamSpec} loading={isStreaming} shareUrl={shareUrl} />
            </main>
        </div>
    )
}
