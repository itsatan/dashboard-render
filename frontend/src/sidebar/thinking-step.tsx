export type ThinkingStepType =
    | 'intent_analysis'
    | 'entity_extraction'
    | 'layout_planning'
    | 'component_creation'
    | 'complete'

export type StepStatus = 'pending' | 'active' | 'completed' | 'error'

export interface ThinkingStep {
    id: string
    type: ThinkingStepType
    label: string
    detail?: string
    status: StepStatus
    timestamp?: number
}

interface ThinkingStepProps {
    number: string
    label: string
    detail?: string
    status: StepStatus
    isActive?: boolean
}

export function ThinkingStepItem({
    number,
    label,
    detail,
    status,
}: ThinkingStepProps) {
    return (
        <div
            className={`flex items-start gap-2.5 transition-opacity duration-200 ${status === 'pending' ? 'opacity-40' : 'opacity-100'
                }`}
        >
            {/* 步骤编号 */}
            <span
                className={`font-mono text-[10px] font-medium leading-5 pt-0.5 ${status === 'active'
                        ? 'text-indigo-500'
                        : status === 'completed'
                            ? 'text-zinc-500'
                            : status === 'error'
                                ? 'text-red-500'
                                : 'text-zinc-400'
                    }`}
            >
                {number}
            </span>

            {/* 状态指示器 */}
            <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center pt-0.5">
                {status === 'completed' ? (
                    <svg className="w-3.5 h-3.5 text-zinc-500" viewBox="0 0 14 14" fill="none">
                        <circle cx="7" cy="7" r="3" fill="currentColor" opacity="0.15" />
                        <circle cx="7" cy="7" r="1.5" fill="currentColor" />
                    </svg>
                ) : status === 'active' ? (
                    <span className="flex items-center gap-0.5">
                        {[0, 1, 2].map((i) => (
                            <span
                                key={i}
                                className="w-1 h-1 rounded-full bg-indigo-500"
                                style={{
                                    animation: 'step-pulse 1.2s ease-in-out infinite',
                                    animationDelay: `${i * 0.15}s`
                                }}
                            />
                        ))}
                    </span>
                ) : status === 'error' ? (
                    <svg className="w-3.5 h-3.5 text-red-500" viewBox="0 0 14 14" fill="none">
                        <circle cx="7" cy="7" r="3" stroke="currentColor" strokeWidth="1.2" fill="none" />
                        <path d="M5 5l4 4M9 5l-4 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                    </svg>
                ) : (
                    <span className="w-1.5 h-1.5 rounded-full bg-zinc-300" />
                )}
            </div>

            {/* 步骤内容 */}
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                    <span
                        className={`text-xs font-medium tracking-tight ${status === 'active'
                                ? 'text-zinc-800'
                                : status === 'completed'
                                    ? 'text-zinc-600'
                                    : status === 'error'
                                        ? 'text-red-600'
                                        : 'text-zinc-400'
                            }`}
                    >
                        {label}
                    </span>
                    {status === 'active' && (
                        <span className="text-[10px] text-indigo-400 font-mono animate-pulse">
                            进行中
                        </span>
                    )}
                </div>

                {/* 详细信息 */}
                {detail && status !== 'pending' && (
                    <div className="mt-1 pl-0.5 border-l border-zinc-200 ml-1">
                        <span className="block text-[10px] font-mono text-zinc-500 leading-relaxed whitespace-pre-wrap">
                            {detail}
                        </span>
                    </div>
                )}
            </div>
        </div>
    )
}
