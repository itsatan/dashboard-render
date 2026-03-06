import { useState, useCallback } from 'react'
import type { ThinkingStep, ThinkingStepType, StepStatus } from '@/sidebar/thinking-step'

interface UseThinkingStateReturn {
    steps: ThinkingStep[]
    isGenerating: boolean
    error: string | null
    startThinking: () => void
    updateStep: (type: ThinkingStepType, status: StepStatus, detail?: string) => void
    completeThinking: (componentCount?: number) => void
    setError: (error: string) => void
    reset: () => void
}

function getStepLabel(type: ThinkingStepType): string {
    const labels: Record<ThinkingStepType, string> = {
        intent_analysis: '意图分析',
        entity_extraction: '实体提取',
        layout_planning: '布局规划',
        component_creation: '组件创建',
        complete: '完成'
    }
    return labels[type]
}

export function useThinkingState(): UseThinkingStateReturn {
    const [steps, setSteps] = useState<ThinkingStep[]>([])
    const [isGenerating, setIsGenerating] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const startThinking = useCallback(() => {
        setSteps([])
        setError(null)
        setIsGenerating(true)
    }, [])

    const updateStep = useCallback((
        type: ThinkingStepType,
        status: StepStatus,
        detail?: string
    ) => {
        setSteps(prev => {
            const existing = prev.find(s => s.type === type)
            if (existing) {
                return prev.map(s => s.type === type
                    ? { ...s, status, detail: detail || s.detail, timestamp: Date.now() }
                    : s
                )
            }
            return [...prev, {
                id: `${type}-${Date.now()}`,
                type,
                label: getStepLabel(type),
                status,
                detail,
                timestamp: Date.now()
            }]
        })
    }, [])

    const completeThinking = useCallback((componentCount?: number) => {
        setIsGenerating(false)
        updateStep('complete', 'completed', componentCount ? `已生成 ${componentCount} 个组件` : undefined)
    }, [updateStep])

    const reset = useCallback(() => {
        setSteps([])
        setError(null)
        setIsGenerating(false)
    }, [])

    return {
        steps,
        isGenerating,
        error,
        startThinking,
        updateStep,
        completeThinking,
        setError,
        reset
    }
}
