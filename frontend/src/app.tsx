import { useCallback, useEffect, useRef, useState } from 'react'
import { nanoid } from 'nanoid'
import { Header } from '@/header/header'
import { Sidebar } from '@/sidebar/sidebar'
import { PreviewPanel } from '@/preview/preview-panel'
import { useAgentStream } from '@/hooks/use-agent-stream'
import { RefreshProvider } from '@/context/refresh-context'
import { dashboardActions } from '@/store/dashboard-store'
import type { Spec } from '@json-render/core'

// 从 spec 中提取数据源配置
function extractDataSources(spec: Spec | null) {
    if (!spec || !spec.elements) return []

    const dataSources: Array<{
        id: string
        resourceType: string
        cluster?: string
        params?: Record<string, unknown>
    }> = []

    // 遍历所有元素，提取 dataSource 配置
    Object.entries(spec.elements).forEach(([id, element]) => {
        if (element.props?.dataSource) {
            const ds = element.props.dataSource as any
            dataSources.push({
                id: id,
                resourceType: ds.params?.resourceType || ds.resourceType || 'unknown',
                cluster: ds.params?.cluster,
                params: ds.params || {},
            })
        }
    })

    return dataSources
}

export function App() {

    const [shareId, setShareId] = useState(() => nanoid(8))

    const { spec: streamSpec, isStreaming, error, thinkingSteps, send } = useAgentStream()

    const onGenerate = useCallback(async (prompt: string) => {
        // 重置数据源
        dashboardActions.reset()
        setShareId(nanoid(8))
        await send(prompt)
    }, [send])

    const prevIsStreamingRef = useRef(isStreaming)
    const prevSpecRef = useRef<Spec | null>(null)

    // 当生成完成时，保存 spec 并提取数据源
    useEffect(() => {
        const justFinished = prevIsStreamingRef.current && !isStreaming
        const hasNewSpec = streamSpec && Object.keys(streamSpec.elements).length > 0

        if (justFinished && hasNewSpec) {
            // 保存到 localStorage
            localStorage.setItem(shareId, JSON.stringify(streamSpec))

            // 提取数据源配置
            const dataSources = extractDataSources(streamSpec)
            if (dataSources.length > 0) {
                dashboardActions.setDataSources(dataSources)
            }
        }

        prevIsStreamingRef.current = isStreaming
        prevSpecRef.current = streamSpec
    }, [isStreaming, streamSpec, shareId])

    const shareUrl = `${window.location.origin}/s/${shareId}`

    const engineStatus = isStreaming ? 'loading' as const : error ? 'error' as const : 'ready' as const

    return (
        <RefreshProvider>
            <div className="flex h-screen flex-col">
                <Header status={engineStatus} />
                <main className="flex flex-1 overflow-hidden bg-zinc-50">
                    <Sidebar
                        onGenerate={onGenerate}
                        isGenerating={isStreaming}
                        thinkingSteps={thinkingSteps}
                        thinkingError={error?.message}
                    />
                    <PreviewPanel spec={streamSpec} loading={isStreaming} shareUrl={shareUrl} />
                </main>
            </div>
        </RefreshProvider>
    )
}
