import { useCallback } from 'react'
import { commandCategories } from '@/data/commands'
import { CommandList } from '@/sidebar/command-list'
import { PromptInput } from '@/sidebar/prompt-input'
import type { Command } from '@/types/commands'

export function Sidebar() {

    const handleCommandClick = useCallback((command: Command) => {
        console.log('Command clicked:', command.id)
    }, [])

    const handleGenerate = useCallback((prompt: string) => {
        console.log('Generate:', prompt)
    }, [])

    return (
        <section className="w-[320px] flex flex-col border-r border-zinc-200 bg-white z-10 overflow-hidden">
            <div className="flex-1 p-5 overflow-y-auto">
                <CommandList categories={commandCategories} onCommandClick={handleCommandClick} />
            </div>
            <PromptInput onGenerate={handleGenerate} />
        </section>
    )
}
