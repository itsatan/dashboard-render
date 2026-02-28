import { commandCategories } from '@/data/commands'
import { CommandList } from '@/sidebar/command-list'
import { PromptInput } from '@/sidebar/prompt-input'
import type { Command } from '@/types/commands'

interface SidebarProps {
    onCommandClick: (command: Command) => void
    onGenerate: (prompt: string) => void
    isGenerating?: boolean
}

export function Sidebar({ onCommandClick, onGenerate, isGenerating }: SidebarProps) {
    return (
        <section className="w-[320px] flex flex-col border-r border-zinc-200 bg-white z-10 overflow-hidden">
            <div className="flex-1 p-5 overflow-y-auto">
                <CommandList categories={commandCategories} onCommandClick={onCommandClick} />
            </div>
            <PromptInput onGenerate={onGenerate} isGenerating={isGenerating} />
        </section>
    )
}
