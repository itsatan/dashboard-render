import clsx from 'clsx'

interface ChartSkeletonProps {
  title?: string
  height?: 'sm' | 'md' | 'lg' | 'xl'
  chartType?: 'line' | 'bar' | 'pie' | 'gauge' | 'radar'
  onRefresh?: () => void
  error?: string | null
}

const HEIGHT_MAP = {
  sm: 'h-48',
  md: 'h-64',
  lg: 'h-80',
  xl: 'h-96',
} as const

const BAR_HEIGHTS = [45, 70, 35, 60, 80, 50, 40, 65, 55, 75, 38, 58] as const
const LINE_POINTS = [0.35, 0.55, 0.42, 0.68, 0.52, 0.78, 0.62, 0.48, 0.72, 0.58] as const

export function ChartSkeleton({
  title,
  height = 'md',
  chartType = 'line',
  onRefresh,
  error
}: ChartSkeletonProps) {
  // 错误状态
  if (error) {
    return (
      <div className="overflow-hidden rounded-lg border border-red-200 bg-red-50/30">
        {title && (
          <div className="border-b border-red-100 px-4 py-3">
            <h4 className="text-xs font-semibold text-zinc-800">{title}</h4>
          </div>
        )}
        <div className={clsx('w-full flex flex-col items-center justify-center gap-3', HEIGHT_MAP[height])}>
          <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
            <svg className="w-5 h-5 text-red-400" viewBox="0 0 20 20" fill="none">
              <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.5" />
              <path d="M10 6v4M10 13.5v1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
          <div className="text-center">
            <p className="text-xs text-zinc-600 font-medium">数据加载失败</p>
            <p className="text-[10px] text-zinc-400 mt-1 font-mono max-w-[200px] truncate">{error}</p>
          </div>
          {onRefresh && (
            <button
              onClick={onRefresh}
              className="mt-1 px-4 py-1.5 text-xs font-medium text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors shadow-sm"
            >
              重试
            </button>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white">
      {/* 标题栏 */}
      {title && (
        <div className="border-b border-zinc-100 px-4 py-3 flex items-center justify-between">
          <h4 className="text-xs font-semibold text-zinc-800">{title}</h4>
          {onRefresh && (
            <button
              onClick={onRefresh}
              className="p-1 rounded hover:bg-zinc-100 transition-colors group"
              title="刷新数据"
            >
              <svg
                className="w-3.5 h-3.5 text-zinc-400 group-hover:text-zinc-600 transition-colors"
                viewBox="0 0 14 14"
                fill="none"
              >
                <path
                  d="M2 7a5 5 0 0 1 8.5-3.5M12 7a5 5 0 0 1-8.5 3.5"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                />
                <path
                  d="M10 2h2.5M10 2v2.5"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M4 12H1.5M4 12v-2.5"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          )}
        </div>
      )}

      {/* 图表骨架区域 */}
      <div className={clsx('w-full p-4 relative', HEIGHT_MAP[height])}>
        {/* 加载指示器 */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
          <span className="text-[10px] font-mono text-zinc-400 animate-pulse">
            loading
          </span>
        </div>

        {/* 根据图表类型渲染不同骨架 */}
        <div className="w-full h-full">
          {chartType === 'line' && <LineChartSkeleton />}
          {chartType === 'bar' && <BarChartSkeleton />}
          {chartType === 'pie' && <PieChartSkeleton />}
          {chartType === 'gauge' && <GaugeSkeleton />}
          {chartType === 'radar' && <RadarSkeleton />}
        </div>
      </div>
    </div>
  )
}

/* ============================================
   各图表类型的骨架屏实现
   ============================================ */

function LineChartSkeleton() {
  return (
    <div className="w-full h-full flex flex-col justify-end relative">
      {/* Y轴刻度线 */}
      <div className="absolute inset-0 flex flex-col justify-between py-1 pointer-events-none">
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={i} className="w-full h-px bg-zinc-100" />
        ))}
      </div>

      {/* 折线轮廓 */}
      <svg
        className="w-full h-3/4 overflow-visible"
        viewBox="0 0 100 40"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="line-skeleton-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#e4e4e7" />
            <stop offset="50%" stopColor="#a1a1aa" />
            <stop offset="100%" stopColor="#e4e4e7" />
            <animate
              attributeName="x1"
              values="-100%;0%;100%"
              dur="2s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="x2"
              values="0%;100%;200%"
              dur="2s"
              repeatCount="indefinite"
            />
          </linearGradient>
        </defs>
        <polyline
          points={LINE_POINTS.map((p, i) => `${(i / (LINE_POINTS.length - 1)) * 100},${(1 - p) * 40}`).join(' ')}
          fill="none"
          stroke="url(#line-skeleton-gradient)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      {/* X轴标签 */}
      <div className="flex justify-between mt-2 px-1">
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={i} className="h-1.5 w-6 rounded-full bg-zinc-100" />
        ))}
      </div>
    </div>
  )
}

function BarChartSkeleton() {
  return (
    <div className="w-full h-full flex flex-col justify-end gap-1">
      {/* 柱状图轮廓 */}
      <div className="flex-1 flex items-end gap-1.5 min-h-0">
        {BAR_HEIGHTS.slice(0, 8).map((h, i) => (
          <div
            key={i}
            className="flex-1 rounded-t bg-zinc-100 relative overflow-hidden"
            style={{ height: `${h}%` }}
          >
            {/* shimmer 效果 */}
            <div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent"
              style={{
                animation: 'shimmer 2s ease-in-out infinite',
                animationDelay: `${i * 0.08}s`
              }}
            />
          </div>
        ))}
      </div>

      {/* X轴标签 */}
      <div className="flex justify-between mt-2 px-1">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-1.5 w-6 rounded-full bg-zinc-100" />
        ))}
      </div>
    </div>
  )
}

function PieChartSkeleton() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="relative w-28 h-28">
        {/* 环形轮廓 */}
        <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
          {/* 背景圆环 */}
          <circle cx="50" cy="50" r="40" fill="none" stroke="#f4f4f5" strokeWidth="16" />
          {/* 动态填充 */}
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke="url(#pie-skeleton-gradient)"
            strokeWidth="16"
            strokeDasharray="200 52"
            strokeLinecap="round"
          />
          <defs>
            <linearGradient id="pie-skeleton-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#d4d4d8" />
              <stop offset="50%" stopColor="#a1a1aa" />
              <stop offset="100%" stopColor="#d4d4d8" />
              <animate
                attributeName="x1"
                values="-100%;0%;100%"
                dur="2.5s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="x2"
                values="0%;100%;200%"
                dur="2.5s"
                repeatCount="indefinite"
              />
            </linearGradient>
          </defs>
        </svg>
        {/* 中心指示器 */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-zinc-50 border border-zinc-100 flex items-center justify-center">
            <div className="w-3 h-3 rounded-full bg-zinc-200 animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  )
}

function GaugeSkeleton() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="relative w-32 h-20">
        <svg viewBox="0 0 120 60" className="w-full h-full">
          {/* 背景弧 */}
          <path
            d="M 10 55 A 50 50 0 0 1 110 55"
            fill="none"
            stroke="#f4f4f5"
            strokeWidth="10"
            strokeLinecap="round"
          />
          {/* 动态填充弧 */}
          <path
            d="M 10 55 A 50 50 0 0 1 110 55"
            fill="none"
            stroke="url(#gauge-skeleton-gradient)"
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray="120 78"
          />
          <defs>
            <linearGradient id="gauge-skeleton-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#d4d4d8" />
              <stop offset="50%" stopColor="#a1a1aa" />
              <stop offset="100%" stopColor="#d4d4d8" />
              <animate
                attributeName="x1"
                values="-100%;0%;100%"
                dur="2s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="x2"
                values="0%;100%;200%"
                dur="2s"
                repeatCount="indefinite"
              />
            </linearGradient>
          </defs>
        </svg>
        {/* 中心数值占位 */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1">
          <div className="h-4 w-12 rounded bg-zinc-100" />
          <div className="h-2 w-8 rounded bg-zinc-50" />
        </div>
      </div>
    </div>
  )
}

function RadarSkeleton() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="relative w-28 h-28">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          {/* 背景网格 */}
          {[0.2, 0.4, 0.6, 0.8, 1].map((scale, i) => (
            <polygon
              key={i}
              points={Array.from({ length: 6 }).map((_, j) => {
                const angle = (j * 60 - 90) * Math.PI / 180
                const x = 50 + Math.cos(angle) * 40 * scale
                const y = 50 + Math.sin(angle) * 40 * scale
                return `${x},${y}`
              }).join(' ')}
              fill="none"
              stroke="#f4f4f5"
              strokeWidth="1"
            />
          ))}
          {/* 轴线 */}
          {Array.from({ length: 6 }).map((_, i) => {
            const angle = (i * 60 - 90) * Math.PI / 180
            return (
              <line
                key={i}
                x1="50"
                y1="50"
                x2={50 + Math.cos(angle) * 40}
                y2={50 + Math.sin(angle) * 40}
                stroke="#e4e4e7"
                strokeWidth="1"
              />
            )
          })}
          {/* 动态填充区域 */}
          <polygon
            points={Array.from({ length: 6 }).map((_, i) => {
              const angle = (i * 60 - 90) * Math.PI / 180
              const scale = 0.5 + Math.random() * 0.3
              const x = 50 + Math.cos(angle) * 40 * scale
              const y = 50 + Math.sin(angle) * 40 * scale
              return `${x},${y}`
            }).join(' ')}
            fill="url(#radar-skeleton-gradient)"
            stroke="#a1a1aa"
            strokeWidth="1"
          />
          <defs>
            <radialGradient id="radar-skeleton-gradient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#a1a1aa" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#d4d4d8" stopOpacity="0.2" />
              <animate
                attributeName="r"
                values="30%;50%;30%"
                dur="2s"
                repeatCount="indefinite"
              />
            </radialGradient>
          </defs>
        </svg>
      </div>
    </div>
  )
}
