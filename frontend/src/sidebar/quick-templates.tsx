interface QuickTemplatesProps {
    onSelect: (prompt: string) => void
}

const TEMPLATES = [
    {
        label: '电商运营总览',
        prompt: '创建一个电商运营数据仪表盘，包含销售额、订单量、客单价、退款率等核心KPI，销售趋势折线图，品类销售占比饼图，各渠道业绩对比柱状图',
    },
    {
        label: '服务器监控',
        prompt: '创建一个服务器监控仪表盘，包含CPU、内存、磁盘、网络等核心指标卡片，CPU使用率仪表盘，资源使用趋势图，各服务健康状态点',
    },
    {
        label: '项目管理看板',
        prompt: '创建一个项目管理仪表盘，包含项目进度完成率仪表盘、团队成员能力雷达图、任务完成趋势折线图、各阶段任务分布饼图和关键指标卡片',
    },
    {
        label: '竞争力分析',
        prompt: '创建一个产品竞争力分析仪表盘，用雷达图对比3个产品在性能、价格、用户体验、市场份额、品牌认知等维度的表现，搭配市场占有率饼图和月度销量趋势折线图',
    },
    {
        label: '城市宜居指数',
        prompt: '创建一个城市宜居指数分析仪表盘，包含多个城市的综合评分指标卡、各维度对比雷达图、环境空气质量指数仪表盘、近12个月空气质量趋势图',
    },
    {
        label: '综合项目管理',
        prompt: '创建一个项目管理仪表盘，包含项目进度、团队成员能力画像、任务完成趋势和预算使用情况',
    },
    {
        label: '员工绩效评估',
        prompt: '创建一个员工绩效评估仪表盘，用雷达图展示5个员工在沟通能力、技术能力、团队协作、创新能力、执行力等维度的表现，搭配绩效评分仪表盘和季度绩效趋势柱状图',
    },
    {
        label: '财务报表概览',
        prompt: '创建一个财务报表仪表盘，包含营收、利润、毛利率、负债率等核心财务指标卡片，收入支出趋势对比折线图，费用构成环形图，各部门预算执行率柱状图',
    },
    {
        label: '健康监测面板',
        prompt: '创建一个健康监测仪表盘，用仪表盘图展示心率、血压、血氧等实时指标，体重变化趋势折线图，运动类型分布饼图，身体各项指标雷达图综合评估',
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
            <div className="flex flex-wrap gap-1.5">
                {TEMPLATES.map((tpl) => (
                    <button
                        key={tpl.label}
                        className="inline-flex items-center px-2.5 py-1.5 rounded-lg border border-zinc-100 bg-zinc-50/40 text-[11px] text-zinc-400 hover:border-indigo-200 hover:bg-indigo-50/50 hover:text-indigo-600 hover:shadow-[0_1px_4px_rgba(99,102,241,0.08)] transition-all duration-200 cursor-pointer"
                        onClick={() => onSelect(tpl.prompt)}
                        title={tpl.prompt}
                    >
                        {tpl.label}
                    </button>
                ))}
            </div>
        </div>
    )
}
