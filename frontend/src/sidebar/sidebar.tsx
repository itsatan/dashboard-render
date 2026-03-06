import { useCallback } from 'react'
import { PromptInput } from '@/sidebar/prompt-input'
import { useHistoryStore } from '@/sidebar/history-store'
import { ThinkingPanel } from '@/sidebar/thinking-panel'
import type { ThinkingStep } from '@/sidebar/thinking-step'

interface SidebarProps {
    onGenerate: (prompt: string) => void
    isGenerating?: boolean
    thinkingSteps?: ThinkingStep[]
    thinkingError?: string
}

export function Sidebar({ onGenerate, isGenerating, thinkingSteps = [], thinkingError }: SidebarProps) {
    const addToHistory = useHistoryStore((state) => state.add)

    const handleGenerate = useCallback((prompt: string) => {
        addToHistory(prompt)
        onGenerate(prompt)
    }, [addToHistory, onGenerate])

    return (
        <section className="w-[320px] flex flex-col border-r border-zinc-200 bg-white z-10 overflow-hidden">
            <ThinkingPanel
                steps={thinkingSteps}
                isGenerating={isGenerating}
                error={thinkingError}
            />
            <PromptInput onGenerate={handleGenerate} isGenerating={isGenerating} />
        </section>
    )
}
