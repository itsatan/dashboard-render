import { PromptInput } from '@/sidebar/prompt-input'

interface SidebarProps {
    onGenerate: (prompt: string) => void
    isGenerating?: boolean
}

export function Sidebar({ onGenerate, isGenerating }: SidebarProps) {
    return (
        <section className="w-[320px] flex flex-col border-r border-zinc-200 bg-white z-10 overflow-hidden">
            <div className="flex-1 p-5 overflow-y-auto">
            </div>
            <PromptInput onGenerate={onGenerate} isGenerating={isGenerating} />
        </section>
    )
}
