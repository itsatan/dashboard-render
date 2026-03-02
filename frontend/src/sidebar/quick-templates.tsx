interface QuickTemplatesProps {
    onSelect: (prompt: string) => void
}

const TEMPLATES = [
    {
        label: '四栏指标看板',
        prompt: '生成一个标准四栏指标看板：顶部标题，4个指标卡片展示关键KPI数据，下方两个图表区域并排展示趋势',
        icon: (
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round">
                <rect x="1" y="1" width="5" height="5" rx="1" />
                <rect x="8" y="1" width="5" height="5" rx="1" />
                <rect x="1" y="8" width="5" height="5" rx="1" />
                <rect x="8" y="8" width="5" height="5" rx="1" />
            </svg>
        ),
    },
    {
        label: '流量监控大屏',
        prompt: '生成一个实时流量监控大屏：顶部3个核心流量指标卡，中间一个大的堆叠面积图展示实时流量趋势，底部两个小图表展示分类统计',
        icon: (
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="1,10 4,6 7,8 10,3 13,5" />
                <polyline points="1,13 4,10 7,11 10,7 13,9" opacity="0.4" />
            </svg>
        ),
    },
    {
        label: '左右分栏布局',
        prompt: '生成一个左右分栏监控视图：左侧纵向排列4个指标卡展示关键数据，右侧纵向排列2个图表区域展示详细趋势',
        icon: (
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round">
                <rect x="1" y="1" width="5" height="12" rx="1" />
                <rect x="8" y="1" width="5" height="12" rx="1" />
            </svg>
        ),
    },
    {
        label: '节点健康拓扑',
        prompt: '生成一个节点健康度拓扑：顶部标题，6个状态指示点展示各节点状态（6列网格），下方一个拓扑图占位区域，底部两个柱状图展示统计',
        icon: (
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round">
                <circle cx="7" cy="3" r="2" />
                <circle cx="3" cy="11" r="2" />
                <circle cx="11" cy="11" r="2" />
                <line x1="5.5" y1="4.5" x2="4" y2="9.5" />
                <line x1="8.5" y1="4.5" x2="10" y2="9.5" />
            </svg>
        ),
    },
    {
        label: '三栏数据总览',
        prompt: '生成一个三栏数据总览页面：顶部区域标题和描述，3列网格每列包含一个指标卡和一个图表，展示不同维度的数据',
        icon: (
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round">
                <rect x="1" y="1" width="3" height="12" rx="0.5" />
                <rect x="5.5" y="1" width="3" height="12" rx="0.5" />
                <rect x="10" y="1" width="3" height="12" rx="0.5" />
            </svg>
        ),
    },
] as const

export function QuickTemplates({ onSelect }: QuickTemplatesProps) {
    return (
        <div className="space-y-2.5">
            <h3 className="flex items-center gap-2 text-[10px] font-medium text-zinc-400 uppercase tracking-widest font-mono px-0.5">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-zinc-300">
                    <path d="M2 3h8M2 6h5M2 9h7" />
                </svg>
                快捷模板
            </h3>
            <div className="space-y-1">
                {TEMPLATES.map((tpl) => (
                    <button
                        key={tpl.label}
                        className="group w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg border border-transparent hover:border-zinc-200 hover:bg-zinc-50/80 transition-all cursor-pointer"
                        onClick={() => onSelect(tpl.prompt)}
                    >
                        <span className="flex-none flex items-center justify-center w-7 h-7 rounded-md bg-zinc-100/80 text-zinc-400 group-hover:bg-indigo-50 group-hover:text-indigo-500 transition-colors">
                            {tpl.icon}
                        </span>
                        <span className="text-[12px] text-zinc-600 group-hover:text-zinc-900 transition-colors text-left truncate">
                            {tpl.label}
                        </span>
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="ml-auto flex-none text-zinc-200 group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-all">
                            <path d="M3 1.5L7 5L3 8.5" />
                        </svg>
                    </button>
                ))}
            </div>
        </div>
    )
}
