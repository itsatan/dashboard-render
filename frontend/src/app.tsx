import { useState, useCallback } from 'react'
import type { Spec } from '@json-render/core'
import { useUIStream } from '@json-render/react'
import { Header } from '@/header/header'
import { Sidebar } from '@/sidebar/sidebar'
import { PreviewPanel } from '@/preview/preview-panel'
import { presetSpecs } from '@/specs'
import type { Command } from '@/types/commands'

export function App() {
    const [presetSpec, setPresetSpec] = useState<Spec | null>(null)

    const { spec: streamSpec, isStreaming, error, send } = useUIStream({
        api: '/api/generate',
        onError: (err) => console.error('Generate error:', err),
    })

    const spec = streamSpec ?? presetSpec

    const handleCommandClick = useCallback((command: Command) => {
        const s = presetSpecs[command.id]
        if (s) {
            setPresetSpec(s)
        }
    }, [])

    const handleGenerate = useCallback(async (prompt: string) => {
        setPresetSpec(null)
        await send(prompt)
    }, [send])

    const engineStatus = isStreaming ? 'loading' as const : error ? 'error' as const : 'ready' as const

    return (
        <div className="flex h-screen flex-col">
            <Header status={engineStatus} />
            <main className="flex flex-1 overflow-hidden bg-zinc-50">
                <Sidebar
                    onCommandClick={handleCommandClick}
                    onGenerate={handleGenerate}
                    isGenerating={isStreaming}
                />
                <PreviewPanel spec={spec} loading={isStreaming} />
            </main>
        </div>
    )
}
