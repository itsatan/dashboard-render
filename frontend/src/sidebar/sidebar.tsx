import { useState, useCallback } from 'react'
import { QuickTemplates } from '@/sidebar/quick-templates'
import { ComponentReference } from '@/sidebar/component-reference'
import { PromptInput } from '@/sidebar/prompt-input'

interface SidebarProps {
    onGenerate: (prompt: string) => void
    isGenerating?: boolean
}

export function Sidebar({ onGenerate, isGenerating }: SidebarProps) {
    const [fillValue, setFillValue] = useState<string>()

    const handleTemplateSelect = useCallback((prompt: string) => {
        setFillValue(prompt)
    }, [])

    return (
        <section className="w-[320px] flex flex-col border-r border-zinc-200 bg-white z-10 overflow-hidden">
            <div className="flex-1 p-5 overflow-y-auto space-y-5">
                <QuickTemplates onSelect={handleTemplateSelect} />
                <div className="border-t border-zinc-100" />
                <ComponentReference />
            </div>
            <PromptInput onGenerate={onGenerate} isGenerating={isGenerating} fillValue={fillValue} />
        </section>
    )
}
