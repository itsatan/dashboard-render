import { useState } from 'react'

const COMPONENTS = [
    { name: 'Grid', desc: 'CSS Grid 网格布局' },
    { name: 'Flex', desc: 'Flexbox 弹性布局' },
    { name: 'Card', desc: '内容卡片容器' },
    { name: 'MetricCard', desc: 'KPI 指标数据卡' },
    { name: 'LineChart', desc: 'ECharts 折线图' },
    { name: 'BarChart', desc: 'ECharts 柱状图' },
    { name: 'ChartPlaceholder', desc: '图表占位区域' },
    { name: 'SectionTitle', desc: '区域标题与描述' },
    { name: 'StatusDot', desc: '状态指示圆点' },
] as const

export function ComponentReference() {
    const [open, setOpen] = useState(false)

    return (
        <div className="space-y-2.5">
            <button
                className="w-full flex items-center gap-2 text-[10px] font-medium text-zinc-400 uppercase tracking-widest font-mono px-0.5 hover:text-zinc-600 transition-colors cursor-pointer"
                onClick={() => setOpen(!open)}
            >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-zinc-300">
                    <rect x="1.5" y="1.5" width="4" height="4" rx="1" />
                    <rect x="6.5" y="1.5" width="4" height="4" rx="1" />
                    <rect x="1.5" y="6.5" width="4" height="4" rx="1" />
                    <rect x="6.5" y="6.5" width="4" height="4" rx="1" />
                </svg>
                可用组件
                <svg
                    width="10"
                    height="10"
                    viewBox="0 0 10 10"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    className={`ml-auto transition-transform duration-200 ${open ? 'rotate-90' : ''}`}
                >
                    <path d="M3 1.5L7 5L3 8.5" />
                </svg>
            </button>

            <div
                className="grid transition-[grid-template-rows] duration-300 ease-out"
                style={{ gridTemplateRows: open ? '1fr' : '0fr' }}
            >
                <div className="overflow-hidden">
                    <div className="flex flex-wrap gap-1.5 pb-1">
                        {COMPONENTS.map((comp) => (
                            <span
                                key={comp.name}
                                className="group relative inline-flex items-center gap-1 px-2 py-1 rounded-md border border-zinc-100 bg-zinc-50/60 text-[10px] font-mono text-zinc-500 hover:border-zinc-200 hover:text-zinc-700 transition-colors cursor-default"
                                title={comp.desc}
                            >
                                <span className="w-1 h-1 rounded-full bg-indigo-300/50" />
                                {comp.name}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
