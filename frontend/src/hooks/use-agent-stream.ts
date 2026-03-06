import { useState, useCallback, useRef } from 'react'
import { applySpecPatch } from '@json-render/core'
import type { Spec } from '@json-render/core'
import type { ThinkingStep, ThinkingStepType } from '@/sidebar/thinking-step'

interface ThinkingEvent {
    type: ThinkingStepType
    status: 'active' | 'completed'
    detail?: string
}

interface UseAgentStreamReturn {
    spec: Spec | null
    isStreaming: boolean
    error: Error | null
    thinkingSteps: ThinkingStep[]
    send: (prompt: string) => Promise<void>
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

// 创建初始 Spec
function createEmptySpec(): Spec {
    return { root: '', elements: {} }
}

export function useAgentStream(): UseAgentStreamReturn {
    const [spec, setSpec] = useState<Spec | null>(null)
    const [isStreaming, setIsStreaming] = useState(false)
    const [error, setError] = useState<Error | null>(null)
    const [thinkingSteps, setThinkingSteps] = useState<ThinkingStep[]>([])

    // 用于跟踪当前 spec 的 ref
    const specRef = useRef<Spec>(createEmptySpec())

    const updateThinkingStep = useCallback((event: ThinkingEvent) => {
        setThinkingSteps(prev => {
            const existing = prev.find(s => s.type === event.type)
            if (existing) {
                return prev.map(s => s.type === event.type
                    ? { ...s, status: event.status, detail: event.detail || s.detail, timestamp: Date.now() }
                    : s
                )
            }
            return [...prev, {
                id: `${event.type}-${Date.now()}`,
                type: event.type,
                label: getStepLabel(event.type),
                status: event.status,
                detail: event.detail,
                timestamp: Date.now()
            }]
        })
    }, [])

    const send = useCallback(async (prompt: string) => {
        // 重置状态
        const emptySpec = createEmptySpec()
        setSpec(null)
        specRef.current = emptySpec
        setError(null)
        setThinkingSteps([])
        setIsStreaming(true)

        try {
            const response = await fetch('/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt })
            })

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            const reader = response.body?.getReader()
            if (!reader) {
                throw new Error('No reader available')
            }

            const decoder = new TextDecoder()
            let buffer = ''

            while (true) {
                const { done, value } = await reader.read()
                if (done) break

                buffer += decoder.decode(value, { stream: true })
                const lines = buffer.split('\n')
                buffer = lines.pop() || '' // 保留最后一个不完整的行

                for (const line of lines) {
                    if (!line.trim()) continue

                    if (line.startsWith('THINKING:')) {
                        // 处理思考步骤
                        try {
                            const event = JSON.parse(line.slice(9)) as ThinkingEvent
                            updateThinkingStep(event)
                        } catch (e) {
                            console.error('Failed to parse thinking event:', line, e)
                        }
                    } else {
                        // 处理 JSONL patch
                        try {
                            const patch = JSON.parse(line)
                            specRef.current = applySpecPatch(specRef.current, patch)
                            setSpec({ ...specRef.current, root: specRef.current.root, elements: specRef.current.elements })
                        } catch (e) {
                            console.error('Failed to parse JSONL:', line, e)
                        }
                    }
                }
            }

            // 处理 buffer 中剩余的内容
            if (buffer.trim()) {
                if (buffer.startsWith('THINKING:')) {
                    try {
                        const event = JSON.parse(buffer.slice(9)) as ThinkingEvent
                        updateThinkingStep(event)
                    } catch (e) {
                        console.error('Failed to parse thinking event:', buffer, e)
                    }
                } else {
                    try {
                        const patch = JSON.parse(buffer)
                        specRef.current = applySpecPatch(specRef.current, patch)
                        setSpec({ ...specRef.current, root: specRef.current.root, elements: specRef.current.elements })
                    } catch (e) {
                        console.error('Failed to parse JSONL:', buffer, e)
                    }
                }
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error(String(err)))
        } finally {
            setIsStreaming(false)
        }
    }, [updateThinkingStep])

    return {
        spec,
        isStreaming,
        error,
        thinkingSteps,
        send
    }
}
