import { useCallback, useState } from 'react'
import { SparkleIcon } from '@/icons/sparkle-icon'
import { ArrowRightIcon } from '@/icons/arrow-right-icon'

interface PromptInputProps {
    onGenerate: (prompt: string) => void
    isGenerating?: boolean
}

export function PromptInput({
    onGenerate,
    isGenerating
}: PromptInputProps) {

    const [value, setValue] = useState('')

    const handleGenerate = useCallback(() => {
        if (value.trim() && !isGenerating) {
            onGenerate(value.trim())
        }
    }, [value, isGenerating, onGenerate])

    return (
        <div className="p-4 bg-zinc-50/50 border-t border-zinc-100">
            <div className="flex flex-col gap-3">
                <div className="bg-white border border-zinc-200 rounded-md shadow-sm focus-within:border-zinc-400 focus-within:ring-4 focus-within:ring-zinc-100 transition-all">
                    <textarea
                        className="w-full resize-none bg-transparent p-3 text-xs leading-relaxed outline-none placeholder:text-zinc-300 h-36"
                        placeholder="输入渲染指令或描述..."
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                    />
                </div>
                <button
                    className="group relative w-full overflow-hidden rounded-md bg-zinc-950 py-2.5 text-sm font-medium text-white shadow-[0_1px_2px_rgba(0,0,0,0.1),0_8px_16px_-4px_rgba(0,0,0,0.1)] transition-all hover:bg-zinc-900 active:scale-[0.98] disabled:opacity-50"
                    onClick={handleGenerate}
                    disabled={isGenerating}
                >
                    <div className="relative z-10 flex items-center justify-center gap-2">
                        <SparkleIcon className="text-zinc-400 group-hover:text-white transition-colors" />
                        <span className="tracking-wide">Generate</span>
                        <ArrowRightIcon className="opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                    </div>
                </button>
            </div>
        </div>
    )
}
