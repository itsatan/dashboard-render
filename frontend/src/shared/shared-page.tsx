import { useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import type { Spec } from '@json-render/core'
import { JSONUIProvider, Renderer } from '@json-render/react'
import { registry } from '@/renderer/registry'

export function SharedPage() {
    const { id } = useParams<{ id: string }>()

    const spec = useMemo<Spec | null>(() => {
        if (!id) return null
        const stored = localStorage.getItem(id)
        if (stored) {
            try {
                return JSON.parse(stored) as Spec
            } catch {
                return null
            }
        }
        return null
    }, [id])

    if (!spec) {
        return (
            <div className="flex h-screen flex-col items-center justify-center bg-zinc-50 gap-4">
                <div className="text-center">
                    <p className="text-6xl font-semibold text-zinc-200">404</p>
                    <p className="mt-3 text-sm text-zinc-400">该链接对应的仪表盘数据未找到，可能已过期或从未创建</p>
                </div>
                <Link
                    to="/"
                    className="text-xs text-indigo-500 hover:text-indigo-600 transition-colors"
                >
                    返回首页
                </Link>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-white">
            <div className="mx-auto max-w-7xl p-6">
                <JSONUIProvider registry={registry}>
                    <Renderer spec={spec} registry={registry} />
                </JSONUIProvider>
            </div>
        </div>
    )
}
