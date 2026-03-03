import { useState, useCallback } from 'react'
import { QuickTemplates } from '@/sidebar/quick-templates'
import { ComponentReference } from '@/sidebar/component-reference'
import { PromptInput } from '@/sidebar/prompt-input'
import { HistoryPanel } from '@/sidebar/history-panel'
import { useHistoryStore } from '@/sidebar/history-store'

interface SidebarProps {
    onGenerate: (prompt: string) => void
    isGenerating?: boolean
}

export function Sidebar({ onGenerate, isGenerating }: SidebarProps) {
    const [fillValue, setFillValue] = useState<string>()
    const addToHistory = useHistoryStore((state) => state.add)

    const handleTemplateSelect = useCallback((prompt: string) => {
        setFillValue(prompt)
    }, [])

    const handleHistorySelect = useCallback((prompt: string) => {
        setFillValue(prompt)
    }, [])

    const handleGenerate = useCallback((prompt: string) => {
        addToHistory(prompt)
        onGenerate(prompt)
    }, [addToHistory, onGenerate])

    return (
        <section className="w-[320px] flex flex-col border-r border-zinc-200 bg-white z-10 overflow-hidden">
            <div className="flex-1 p-5 overflow-y-auto space-y-5">
                <QuickTemplates onSelect={handleTemplateSelect} />
                <div className="border-t border-zinc-100" />
                <div className="space-y-3">
                    <HistoryPanel onSelect={handleHistorySelect} />
                    <ComponentReference />
                </div>
            </div>
            <PromptInput onGenerate={handleGenerate} isGenerating={isGenerating} fillValue={fillValue} />
        </section>
    )
}
