import { useState, useMemo, useCallback, useRef, useEffect } from 'react'
import type { ThinkingStep, ThinkingStepType, StepStatus } from './thinking-step'

interface ThinkingPanelProps {
    steps: ThinkingStep[]
    isGenerating?: boolean
    error?: string
}

const STEP_CONFIG: Record<ThinkingStepType, { number: string; label: string }> = {
    intent_analysis: { number: '01', label: '意图分析' },
    entity_extraction: { number: '02', label: '实体提取' },
    layout_planning: { number: '03', label: '布局规划' },
    component_creation: { number: '04', label: '组件创建' },
    complete: { number: '05', label: '完成' },
}

// 解析组件创建详情
function parseComponentDetails(detail?: string): { count: number; components: string[] } {
    if (!detail) return { count: 0, components: [] }
    const lines = detail.split('\n')
    const components = lines.filter(l => l && !l.match(/^已创建\s*\d+/))
    const countMatch = detail.match(/已创建\s*(\d+)/)
    return {
        count: countMatch ? parseInt(countMatch[1]) : components.length,
        components
    }
}

// 计算步骤运行时间
function getStepDuration(step?: ThinkingStep, allSteps?: ThinkingStep[]): string | null {
    if (!step || !step.timestamp) return null
    if (step.status !== 'completed') return null

    // 完成步骤不显示时间
    if (step.type === 'complete') return null

    // 找到当前步骤的开始时间
    const stepIndex = allSteps?.findIndex(s => s.type === step.type)
    if (stepIndex === undefined || stepIndex < 0) return null

    // 当前步骤的开始时间（就是上一个步骤的结束时间或第一个步骤的开始时间）
    const startTime = stepIndex === 0
        ? step.timestamp
        : (allSteps?.[stepIndex - 1]?.timestamp || step.timestamp)

    const duration = ((step.timestamp - startTime) / 1000).toFixed(1)
    return duration
}

// 单个步骤组件
function StepItem({
    type,
    step,
    allSteps,
    isExpanded,
    onToggleExpand,
}: {
    type: ThinkingStepType
    step?: ThinkingStep
    allSteps: ThinkingStep[]
    isExpanded: boolean
    onToggleExpand: () => void
}) {
    const config = STEP_CONFIG[type]
    const status: StepStatus = step?.status || 'pending'
    const { count, components } = parseComponentDetails(step?.detail)
    const duration = getStepDuration(step, allSteps)

    // 组件创建步骤的特殊渲染
    const isComponentCreation = type === 'component_creation'
    const hasComponents = isComponentCreation && components.length > 0

    // 完成步骤特殊处理 - 只显示标题
    const isCompleteStep = type === 'complete'

    return (
        <div
            className={`transition-all duration-300 ease-out ${status === 'pending' ? 'opacity-30' : 'opacity-100'
                }`}
        >
            {/* 步骤主体 - 使用 items-center 垂直居中对齐 */}
            <div className="flex items-center gap-2.5">
                {/* 步骤编号 */}
                <span
                    className={`font-mono text-[10px] font-semibold w-4 text-center tabular-nums transition-colors duration-200 ${status === 'active'
                        ? 'text-indigo-500'
                        : status === 'completed'
                            ? 'text-zinc-400'
                            : status === 'error'
                                ? 'text-red-400'
                                : 'text-zinc-300'
                        }`}
                >
                    {config.number}
                </span>

                {/* 状态指示器 */}
                <div className="flex-shrink-0 w-3 h-3 flex items-center justify-center">
                    {status === 'completed' ? (
                        <svg
                            className="w-2.5 h-2.5 text-zinc-400"
                            viewBox="0 0 12 12"
                            fill="none"
                        >
                            <circle cx="6" cy="6" r="3" fill="currentColor" opacity="0.2" />
                            <circle cx="6" cy="6" r="1.5" fill="currentColor" />
                        </svg>
                    ) : status === 'active' ? (
                        <span className="flex items-center gap-[2px]">
                            {[0, 1, 2].map((i) => (
                                <span
                                    key={i}
                                    className="w-[3px] h-[3px] rounded-full bg-indigo-500"
                                    style={{
                                        animation: 'thinking-pulse 1.2s ease-in-out infinite',
                                        animationDelay: `${i * 0.12}s`,
                                    }}
                                />
                            ))}
                        </span>
                    ) : status === 'error' ? (
                        <svg className="w-2.5 h-2.5 text-red-400" viewBox="0 0 12 12" fill="none">
                            <circle cx="6" cy="6" r="2.5" stroke="currentColor" strokeWidth="1.2" />
                            <path d="M4.5 4.5l3 3M7.5 4.5l-3 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                        </svg>
                    ) : (
                        <span className="w-1.5 h-1.5 rounded-full bg-zinc-200" />
                    )}
                </div>

                {/* 步骤内容 */}
                <div className="flex-1 min-w-0 flex items-center gap-1.5">
                    <span
                        className={`text-[11px] font-medium tracking-[-0.01em] transition-colors duration-200 ${status === 'active'
                            ? 'text-zinc-800'
                            : status === 'completed'
                                ? 'text-zinc-500'
                                : status === 'error'
                                    ? 'text-red-500'
                                    : 'text-zinc-400'
                            }`}
                    >
                        {config.label}
                    </span>
                    {/* 运行时间 - 只在完成状态显示，完成步骤除外 */}
                    {status === 'completed' && duration && !isCompleteStep && (
                        <span className="text-[9px] text-zinc-400 font-mono">
                            {duration}s
                        </span>
                    )}
                    {status === 'active' && (
                        <span className="text-[9px] text-indigo-400 font-mono animate-pulse tracking-wide">
                            运行中
                        </span>
                    )}
                    {status === 'completed' && isComponentCreation && count > 0 && (
                        <span className="text-[9px] text-zinc-400 font-mono">
                            · {count} 个
                        </span>
                    )}
                </div>
            </div>

            {/* 普通步骤详情 - 完成步骤不显示 */}
            {step?.detail && status !== 'pending' && !isComponentCreation && !isCompleteStep && (
                <div className="mt-1.5 ml-12 pl-2 border-l border-zinc-200">
                    <span className="block text-[10px] font-mono text-zinc-500 leading-relaxed whitespace-pre-wrap">
                        {step.detail}
                    </span>
                </div>
            )}

            {/* 组件创建步骤的折叠列表 */}
            {hasComponents && (
                <div className="mt-2 ml-12">
                    <button
                        onClick={onToggleExpand}
                        className="flex items-center gap-1 text-[10px] text-zinc-400 hover:text-zinc-600 transition-colors group"
                    >
                        <svg
                            className={`w-2.5 h-2.5 transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`}
                            viewBox="0 0 10 10"
                            fill="none"
                        >
                            <path d="M3 2l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <span className="font-mono">{isExpanded ? '收起列表' : '展开列表'}</span>
                    </button>

                    {isExpanded && (
                        <div
                            className="mt-2 space-y-1 overflow-hidden"
                            style={{ animation: 'expand-in 0.2s ease-out' }}
                        >
                            {components.map((comp, i) => (
                                <div
                                    key={`${comp}-${i}`}
                                    className="flex items-center gap-2 pl-2 py-0.5 rounded hover:bg-zinc-50 transition-colors group"
                                    style={{
                                        animation: 'slide-in-left 0.2s ease-out',
                                        animationDelay: `${i * 0.03}s`,
                                        animationFillMode: 'both',
                                    }}
                                >
                                    <span className="w-1 h-1 rounded-full bg-zinc-300 group-hover:bg-indigo-400 transition-colors" />
                                    <span className="text-[10px] font-mono text-zinc-500 group-hover:text-zinc-700 transition-colors">
                                        {comp}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

// 空状态占位符
function EmptyPlaceholder() {
    return (
        <div className="flex-1 flex flex-col items-center justify-center p-6 relative overflow-hidden">
            {/* 背景网格 */}
            <div
                className="absolute inset-0 opacity-[0.03]"
                style={{
                    backgroundImage: `
            linear-gradient(to right, #71717a 1px, transparent 1px),
            linear-gradient(to bottom, #71717a 1px, transparent 1px)
          `,
                    backgroundSize: '24px 24px',
                }}
            />

            {/* 渐变光晕 */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl" />

            {/* 图标 */}
            <div className="relative mb-4">
                <div className="w-12 h-12 rounded-xl bg-zinc-50 border border-zinc-100 flex items-center justify-center">
                    <svg
                        className="w-5 h-5 text-zinc-300"
                        viewBox="0 0 20 20"
                        fill="none"
                    >
                        <circle cx="10" cy="10" r="3" stroke="currentColor" strokeWidth="1.5" strokeDasharray="2 1" />
                        <path d="M10 3v2M10 15v2M3 10h2M15 10h2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        <circle cx="10" cy="10" r="1" fill="currentColor" />
                    </svg>
                </div>
            </div>

            {/* 文字 */}
            <div className="relative text-center">
                <p className="text-xs text-zinc-400 font-medium tracking-tight">
                    AI 思考过程
                </p>
                <p className="mt-1 text-[10px] text-zinc-300">
                    输入提示词开始生成
                </p>
            </div>

            {/* 装饰线 */}
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-zinc-100 to-transparent" />
        </div>
    )
}

export function ThinkingPanel({ steps, isGenerating, error }: ThinkingPanelProps) {
    const [expandedSteps, setExpandedSteps] = useState<Set<ThinkingStepType>>(new Set(['component_creation']))
    const scrollRef = useRef<HTMLDivElement>(null)

    // 判断是否有内容
    const hasContent = steps.length > 0 || isGenerating

    // 计算完成状态
    const isComplete = steps.some(s => s.type === 'complete' && s.status === 'completed')

    // 计算总用时
    const totalDuration = useMemo(() => {
        const start = steps.find(s => s.type === 'intent_analysis')?.timestamp
        const end = steps.find(s => s.type === 'complete')?.timestamp
        if (!start || !end) return null
        return ((end - start) / 1000).toFixed(1)
    }, [steps])

    // 计算组件数量
    const componentCount = useMemo(() => {
        const step = steps.find(s => s.type === 'component_creation')
        return parseComponentDetails(step?.detail).count
    }, [steps])

    // 获取应该显示的步骤（只显示已经开始或完成的步骤）
    const visibleSteps = useMemo(() => {
        const types = Object.keys(STEP_CONFIG) as ThinkingStepType[]
        const result: ThinkingStepType[] = []
        let foundActive = false

        for (const type of types) {
            const step = steps.find(s => s.type === type)
            if (step && step.status !== 'pending') {
                result.push(type)
                if (step.status === 'active') {
                    foundActive = true
                }
            } else if (!foundActive && result.length > 0 && type !== 'complete') {
                // 显示当前活动步骤的下一个
                result.push(type)
                foundActive = true
            }
        }

        // 如果完成，添加complete步骤
        if (isComplete) {
            const hasComplete = result.includes('complete')
            if (!hasComplete) result.push('complete')
        }

        return result
    }, [steps, isComplete])

    // 自动滚动到底部
    useEffect(() => {
        if (scrollRef.current && isGenerating) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }, [steps, isGenerating])

    const toggleStepExpand = useCallback((type: ThinkingStepType) => {
        setExpandedSteps(prev => {
            const next = new Set(prev)
            if (next.has(type)) {
                next.delete(type)
            } else {
                next.add(type)
            }
            return next
        })
    }, [])

    // 空状态
    if (!hasContent) {
        return (
            <div className="flex-1 flex flex-col min-h-0">
                <EmptyPlaceholder />
            </div>
        )
    }

    return (
        <div className="flex-1 flex flex-col min-h-0 border-b border-zinc-100">
            {/* Header - 不可折叠 */}
            <div className="shrink-0 flex items-center justify-between px-4 py-2.5 bg-zinc-50/80 border-b border-zinc-100">
                <div className="flex items-center gap-2">
                    {/* 状态图标 */}
                    {isComplete ? (
                        <svg className="w-3 h-3 text-emerald-500" viewBox="0 0 12 12" fill="none">
                            <circle cx="6" cy="6" r="3" fill="currentColor" opacity="0.15" />
                            <path d="M4 6l1.5 1.5 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    ) : error ? (
                        <svg className="w-3 h-3 text-red-400" viewBox="0 0 12 12" fill="none">
                            <circle cx="6" cy="6" r="3" stroke="currentColor" strokeWidth="1.2" />
                            <path d="M4.5 4.5l3 3M7.5 4.5l-3 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                        </svg>
                    ) : (
                        <svg className="w-3 h-3 text-indigo-500 animate-pulse" viewBox="0 0 12 12" fill="none">
                            <circle cx="6" cy="6" r="3" stroke="currentColor" strokeWidth="1.2" strokeDasharray="1.5 1" />
                            <circle cx="6" cy="6" r="1" fill="currentColor" />
                        </svg>
                    )}

                    <span className="text-[11px] font-medium text-zinc-600 tracking-[-0.01em]">
                        AI 思考过程
                    </span>
                </div>

                {/* 摘要 - 分散布局 */}
                {isComplete && (
                    <div className="flex items-center gap-3 text-[9px] text-zinc-400 font-mono">
                        <span>{totalDuration}s</span>
                        <span className="w-px h-2.5 bg-zinc-200" />
                        <span>{componentCount} 组件</span>
                    </div>
                )}
            </div>

            {/* Content - 自动滚动到底部 */}
            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto px-4 py-3 space-y-3"
            >
                {/* 步骤列表 */}
                {visibleSteps.map((type) => {
                    const step = steps.find(s => s.type === type)

                    return (
                        <StepItem
                            key={type}
                            type={type}
                            step={step}
                            allSteps={steps}
                            isExpanded={expandedSteps.has(type)}
                            onToggleExpand={() => toggleStepExpand(type)}
                        />
                    )
                })}

                {/* 错误信息 */}
                {error && (
                    <div
                        className="mt-2 px-3 py-2 rounded-lg bg-red-50 border border-red-100"
                        style={{ animation: 'shake 0.3s ease-out' }}
                    >
                        <span className="text-[10px] text-red-600 font-mono">{error}</span>
                    </div>
                )}
            </div>

            {/* CSS Animations */}
            <style>{`
        @keyframes thinking-pulse {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1); }
        }
        @keyframes expand-in {
          from { opacity: 0; transform: translateY(-4px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slide-in-left {
          from { opacity: 0; transform: translateX(-8px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          75% { transform: translateX(4px); }
        }
      `}</style>
        </div>
    )
}
