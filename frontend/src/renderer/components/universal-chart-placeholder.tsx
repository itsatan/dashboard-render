import clsx from 'clsx'

// ============================================
// Types & Constants
// ============================================

interface UniversalChartPlaceholderProps {
    height?: 'sm' | 'md' | 'lg' | 'xl'
    error?: string | null
    isLoading?: boolean
}

// 与图表组件保持一致的高度
const HEIGHT_MAP = {
    sm: 'h-48',
    md: 'h-64',
    lg: 'h-80',
    xl: 'h-96',
} as const

// ============================================
// Main Component - 纯内容组件，不带卡片外壳
// ============================================

export function UniversalChartPlaceholder({
    height = 'md',
    error,
    isLoading = false,
}: UniversalChartPlaceholderProps) {
    const hasError = !!error

    // The single ambient glow — different warmth per state
    const glowColor = hasError
        ? 'radial-gradient(ellipse at 50% 60%, rgba(254,202,202,0.18) 0%, transparent 70%)'
        : isLoading
            ? 'radial-gradient(ellipse at 50% 60%, rgba(165,180,252,0.1) 0%, transparent 70%)'
            : 'radial-gradient(ellipse at 50% 60%, rgba(228,228,231,0.15) 0%, transparent 70%)'

    return (
        <div className={clsx('relative w-full rounded-lg', HEIGHT_MAP[height])}>
            {/* Ambient glow */}
            <div
                className={clsx(
                    'absolute inset-0 pointer-events-none transition-opacity duration-700 rounded-lg',
                    isLoading && 'animate-pulse'
                )}
                style={{ background: glowColor }}
                aria-hidden
            />

            {/* Text cluster */}
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5">
                <p className={clsx(
                    'text-[13px] font-medium tracking-[-0.01em] transition-colors duration-300',
                    hasError ? 'text-red-400' : 'text-zinc-300',
                )}>
                    {isLoading ? '加载中…' : hasError ? '加载失败' : '暂无数据'}
                </p>

                {hasError && error && (
                    <p className="text-[11px] text-red-300/70 text-center max-w-52 leading-relaxed">
                        {error}
                    </p>
                )}

                {!isLoading && !hasError && (
                    <p className="text-[11px] text-zinc-300/60">等待数据源响应</p>
                )}
            </div>
        </div>
    )
}

export const ChartSkeleton = UniversalChartPlaceholder
export const ChartPlaceholder = UniversalChartPlaceholder
