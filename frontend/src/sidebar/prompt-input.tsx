import { useCallback, useState, useEffect, useRef } from 'react'
import { SparkleIcon } from '@/icons/sparkle-icon'
import { ArrowRightIcon } from '@/icons/arrow-right-icon'

interface PromptInputProps {
    onGenerate: (prompt: string) => void
    isGenerating?: boolean
    fillValue?: string
}

export function PromptInput({
    onGenerate,
    isGenerating,
    fillValue
}: PromptInputProps) {

    const [value, setValue] = useState('')
    const textareaRef = useRef<HTMLTextAreaElement>(null)

    useEffect(() => {
        if (fillValue) {
            setValue(fillValue)
            textareaRef.current?.focus()
        }
    }, [fillValue])

    const handleGenerate = useCallback(() => {
        if (value.trim() && !isGenerating) {
            onGenerate(value.trim())
        }
    }, [value, isGenerating, onGenerate])

    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
            e.preventDefault()
            handleGenerate()
        }
    }, [handleGenerate])

    return (
        <div className="shrink-0 p-4 bg-zinc-50/50 border-t border-zinc-100">
            <div className="flex flex-col gap-3">
                <div className="bg-white border border-zinc-200 rounded-lg shadow-sm focus-within:border-zinc-400 focus-within:ring-4 focus-within:ring-zinc-100 transition-all">
                    <textarea
                        ref={textareaRef}
                        className="w-full resize-none bg-transparent p-3 text-xs leading-relaxed outline-none placeholder:text-zinc-300 h-32"
                        placeholder="描述你想要生成的仪表盘界面..."
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                </div>
                <button
                    className="group relative w-full overflow-hidden rounded-lg bg-zinc-950 py-2.5 text-sm font-medium text-white shadow-[0_1px_2px_rgba(0,0,0,0.1),0_8px_16px_-4px_rgba(0,0,0,0.1)] transition-all hover:bg-zinc-900 active:scale-[0.98] disabled:opacity-50  cursor-pointer"
                    onClick={handleGenerate}
                    disabled={isGenerating || !value.trim()}
                >
                    <div className="relative z-10 flex items-center justify-center gap-2">
                        {isGenerating ? (
                            <>
                                <svg width="14" height="14" viewBox="0 0 14 14" className="animate-spin text-zinc-400">
                                    <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.5" fill="none" strokeDasharray="20 12" strokeLinecap="round" />
                                </svg>
                                <span className="tracking-wide">Generating...</span>
                            </>
                        ) : (
                            <>
                                <SparkleIcon className="text-zinc-400 group-hover:text-white transition-colors" />
                                <span className="tracking-wide">Generate</span>
                                <ArrowRightIcon className="opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                            </>
                        )}
                    </div>
                </button>
            </div>
        </div>
    )
}
