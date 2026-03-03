import { useState } from 'react'
import { useHistoryStore, type HistoryItem } from '@/sidebar/history-store'

interface HistoryPanelProps {
    onSelect: (prompt: string) => void
}

function formatTime(timestamp: number): string {
    const now = Date.now()
    const diff = now - timestamp

    if (diff < 60000) {
        return '刚刚'
    } else if (diff < 3600000) {
        return `${Math.floor(diff / 60000)} 分钟前`
    } else if (diff < 86400000) {
        return `${Math.floor(diff / 3600000)} 小时前`
    } else {
        const date = new Date(timestamp)
        return `${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`
    }
}

function truncatePrompt(prompt: string, maxLength: number = 40): string {
    if (prompt.length <= maxLength) return prompt
    return prompt.slice(0, maxLength) + '...'
}

function HistoryItemView({ item, onSelect, onRemove }: {
    item: HistoryItem
    onSelect: (prompt: string) => void
    onRemove: (id: string) => void
}) {
    return (
        <div className="group relative flex items-start gap-2 p-2 rounded-lg border border-zinc-100 hover:bg-zinc-50 transition-colors">
            <button
                className="flex-1 text-left cursor-pointer"
                onClick={() => onSelect(item.prompt)}
            >
                <div className="text-[11px] text-zinc-700 leading-relaxed line-clamp-2">
                    {truncatePrompt(item.prompt, 50)}
                </div>
                <div className="mt-1 text-[9px] text-zinc-400 font-mono">
                    {formatTime(item.timestamp)}
                </div>
            </button>
            <button
                className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-zinc-100 text-zinc-400 hover:text-zinc-600 transition-all cursor-pointer"
                onClick={(e) => {
                    e.stopPropagation()
                    onRemove(item.id)
                }}
                title="删除"
            >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                    <path d="M2.5 4h7M4 4V2.5a1 1 0 011-1h2a1 1 0 011 1V4M5 6v3M7 6v3" />
                </svg>
            </button>
        </div>
    )
}

export function HistoryPanel({ onSelect }: HistoryPanelProps) {
    const [open, setOpen] = useState(false)
    const { items, remove, clear } = useHistoryStore()

    return (
        <div className="space-y-2.5">
            <button
                className="w-full flex items-center gap-2 text-[10px] font-medium text-zinc-400 uppercase tracking-widest font-mono px-0.5 hover:text-zinc-600 transition-colors cursor-pointer"
                onClick={() => setOpen(!open)}
            >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-zinc-300">
                    <circle cx="6" cy="6" r="4.5" />
                    <path d="M6 3.5V6l1.5 1" />
                </svg>
                历史记录
                {items.length > 0 && (
                    <span className="ml-1 px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-500 text-[8px] font-medium">
                        {items.length}
                    </span>
                )}
                <svg
                    width="10"
                    height="10"
                    viewBox="0 0 10 10"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    className={`ml-auto transition-transform duration-200 ${open ? 'rotate-90' : ''}`}
                >
                    <path d="M3 1.5L7 5L3 8.5" />
                </svg>
            </button>

            <div
                className="grid transition-[grid-template-rows] duration-300 ease-out"
                style={{ gridTemplateRows: open ? '1fr' : '0fr' }}
            >
                <div className="overflow-hidden">
                    <div className="pb-1">
                        {items.length === 0 ? (
                            <div className="py-4 text-center text-[11px] text-zinc-400">
                                暂无历史记录
                            </div>
                        ) : (
                            <>
                                <div className="max-h-48 overflow-y-auto space-y-1.5">
                                    {items.map((item) => (
                                        <HistoryItemView
                                            key={item.id}
                                            item={item}
                                            onSelect={onSelect}
                                            onRemove={remove}
                                        />
                                    ))}
                                </div>
                                <button
                                    className="w-full mt-2 py-1.5 text-[10px] text-zinc-400 hover:text-zinc-600 hover:bg-zinc-50 rounded-lg transition-colors cursor-pointer"
                                    onClick={clear}
                                >
                                    清空历史记录
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
