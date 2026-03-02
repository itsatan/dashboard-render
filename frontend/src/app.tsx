import { useCallback } from 'react'
import { useUIStream } from '@json-render/react'
import { Header } from '@/header/header'
import { Sidebar } from '@/sidebar/sidebar'
import { PreviewPanel } from '@/preview/preview-panel'

export function App() {

    const { spec: streamSpec, isStreaming, error, send } = useUIStream({
        api: '/api/generate',
        onError: (err) => console.error('Generate error:', err),
    })

    const onGenerate = useCallback(async (prompt: string) => {
        await send(prompt)
    }, [send])

    const engineStatus = isStreaming ? 'loading' as const : error ? 'error' as const : 'ready' as const

    return (
        <div className="flex h-screen flex-col">
            <Header status={engineStatus} />
            <main className="flex flex-1 overflow-hidden bg-zinc-50">
                <Sidebar
                    onGenerate={onGenerate}
                    isGenerating={isStreaming}
                />
                <PreviewPanel spec={streamSpec} loading={isStreaming} />
            </main>
        </div>
    )
}
