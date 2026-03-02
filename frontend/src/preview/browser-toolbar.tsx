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
    url
}: {
    url: string
}) {
    return (
        <div className="flex items-center gap-2 rounded-md border border-zinc-200 bg-white px-3 py-1 text-[11px] text-zinc-400 font-mono">
            <LockIcon />
            {url}
        </div>
    )
}

function RefreshButton({
    onClick
}: {
    onClick?: () => void
}) {
    return (
        <button className="text-zinc-400 hover:text-zinc-900 transition-colors cursor-pointer" onClick={onClick}>
            <RefreshIcon />
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
    return (
        <div className="flex items-center justify-between border-b border-zinc-100 bg-zinc-50/50 px-4 py-2.5">
            <div className="flex items-center gap-6">
                <TrafficLights active={active} />
                <AddressBar url={url} />
            </div>
            <div className="flex items-center gap-3">
                <RefreshButton onClick={onRefresh} />
            </div>
        </div>
    )
}
