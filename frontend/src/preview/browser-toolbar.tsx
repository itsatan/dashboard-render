import { useState, useCallback } from 'react'
import { LockIcon } from '@/icons/lock-icon'
import { RefreshIcon } from '@/icons/refresh-icon'

interface TrafficLightsProps {
    active?: boolean
}

function TrafficLights({
    active = false
}: TrafficLightsProps) {
    if (active) {
        return (
            <div className="flex items-center gap-1.5">
                <div className="h-3 w-3 rounded-full bg-[#ff5f56] border border-[#e0443e]" />
                <div className="h-3 w-3 rounded-full bg-[#ffbd2e] border border-[#dea123]" />
                <div className="h-3 w-3 rounded-full bg-[#27c93f] border border-[#1aab29]" />
            </div>
        )
    }

    return (
        <div className="flex items-center gap-1.5">
            <div className="h-3 w-3 rounded-full bg-zinc-200" />
            <div className="h-3 w-3 rounded-full bg-zinc-200" />
            <div className="h-3 w-3 rounded-full bg-zinc-200" />
        </div>
    )
}

function AddressBar({
    url,
    copied,
    onCopy
}: {
    url: string
    copied?: boolean
    onCopy?: () => void
}) {
    return (
        <div className="flex items-center gap-2 rounded-md border border-zinc-200 bg-white px-3 py-1 text-[11px] text-zinc-400 font-mono">
            <LockIcon />
            {url}
            <button
                className="ml-1 transition-colors cursor-pointer"
                onClick={onCopy}
                title="复制链接"
            >
                {copied ? (
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="#22c55e" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M2.5 6.5L5 9l4.5-6" />
                    </svg>
                ) : (
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-300 hover:text-zinc-600">
                        <rect x="4" y="4" width="6.5" height="6.5" rx="1.5" />
                        <path d="M8 4V2.5A1.5 1.5 0 0 0 6.5 1H2.5A1.5 1.5 0 0 0 1 2.5v4A1.5 1.5 0 0 0 2.5 8H4" />
                    </svg>
                )}
            </button>
        </div>
    )
}

function RefreshButton({
    onClick
}: {
    onClick?: () => void
}) {
    return (
        <button className="text-zinc-400 hover:text-zinc-900 transition-colors cursor-pointer hidden" onClick={onClick}>
            <RefreshIcon />
        </button>
    )
}

function OpenExternalButton({
    onClick
}: {
    onClick?: () => void
}) {
    return (
        <button className="text-zinc-400 hover:text-zinc-900 transition-colors cursor-pointer" onClick={onClick} title="在新标签页中打开">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 7.5v3a1.5 1.5 0 0 1-1.5 1.5h-6A1.5 1.5 0 0 1 2 10.5v-6A1.5 1.5 0 0 1 3.5 3H7" />
                <path d="M9 2h3v3" />
                <path d="M6 8L12 2" />
            </svg>
        </button>
    )
}

interface BrowserToolbarProps {
    url: string
    active?: boolean
    onRefresh?: () => void
}

export function BrowserToolbar({
    url,
    active = false,
    onRefresh
}: BrowserToolbarProps) {

    const [copied, setCopied] = useState(false)

    const onCopy = useCallback(() => {
        navigator.clipboard.writeText(url).then(() => {
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        })
    }, [url])

    const onOpenExternal = useCallback(() => {
        const urlPath = url.replace(/^https?:\/\/[^/]+/, '')
        window.open(urlPath, '_blank')
    }, [url])

    return (
        <div className="flex items-center justify-between border-b border-zinc-100 bg-zinc-50/50 px-4 py-2.5">
            <div className="flex items-center gap-6">
                <TrafficLights active={active} />
                <AddressBar url={url} copied={copied} onCopy={onCopy} />
                {copied && (
                    <span className="text-[11px] text-emerald-500 font-medium whitespace-nowrap animate-in fade-in duration-200">
                        已复制到剪贴板
                    </span>
                )}
            </div>
            <div className="flex items-center gap-3">
                <RefreshButton onClick={onRefresh} />
                <OpenExternalButton onClick={onOpenExternal} />
            </div>
        </div>
    )
}
