import { useMemo } from 'react'

interface QuickTemplatesProps {
    onSelect: (prompt: string) => void
}

const ALL_TEMPLATES = [
    {
        label: 'DNS服务监控',
        prompt: '创建一个DNS服务监控仪表盘，展示DNS查询成功率仪表盘、响应时间趋势折线图、各域名解析量柱状图、DNS服务器状态分布',
    },
    {
        label: 'SLA可用性',
        prompt: '创建一个SLA服务可用性仪表盘，展示整体可用率仪表盘、各服务SLA达成率柱状图、故障时间趋势折线图、服务健康状态列表',
    },
    {
        label: '告警中心',
        prompt: '创建一个告警中心仪表盘，展示今日告警总数、告警级别分布饼图、告警趋势折线图、Top10告警来源柱状图、当前活跃告警列表',
    },
    {
        label: '流量分析',
        prompt: '创建一个网络流量分析仪表盘，展示入站/出站流量趋势折线图、流量来源分布饼图、各端口流量柱状图、带宽利用率仪表盘',
    },
    {
        label: '网络延迟',
        prompt: '创建一个网络延迟监控仪表盘，展示平均延迟仪表盘、延迟趋势折线图、各区域延迟对比柱状图、丢包率趋势',
    },
    {
        label: '带宽利用率',
        prompt: '创建一个带宽利用率仪表盘，展示总带宽使用率仪表盘、各链路带宽占比饼图、带宽趋势折线图、峰值时段分析柱状图',
    },
    {
        label: '服务器状态',
        prompt: '创建一个服务器状态监控仪表盘，展示服务器在线数量、CPU/内存/磁盘使用率仪表盘、各服务器状态列表、资源趋势折线图',
    },
    {
        label: 'CDN性能',
        prompt: '创建一个CDN性能监控仪表盘，展示缓存命中率仪表盘、各节点响应时间柱状图、带宽消耗趋势折线图、节点健康状态分布',
    },
    {
        label: '防火墙日志',
        prompt: '创建一个防火墙日志分析仪表盘，展示今日拦截次数、攻击类型分布饼图、拦截趋势折线图、Top10攻击来源IP柱状图',
    },
    {
        label: '负载均衡',
        prompt: '创建一个负载均衡监控仪表盘，展示后端服务器健康状态、请求分发占比饼图、响应时间趋势折线图、各节点负载柱状图',
    },
    {
        label: 'API网关',
        prompt: '创建一个API网关监控仪表盘，展示API请求总量、成功率仪表盘、各接口响应时间柱状图、QPS趋势折线图、错误类型分布',
    },
    {
        label: '数据库连接池',
        prompt: '创建一个数据库连接池监控仪表盘，展示连接池使用率仪表盘、活跃连接数趋势折线图、慢查询分布柱状图、各数据库状态',
    },
    {
        label: '缓存服务',
        prompt: '创建一个缓存服务监控仪表盘，展示缓存命中率仪表盘、内存使用率趋势折线图、各Key空间占用柱状图、缓存连接数',
    },
    {
        label: '消息队列',
        prompt: '创建一个消息队列监控仪表盘，展示消息堆积量仪表盘、生产/消费速率趋势折线图、各Topic消息量柱状图、消费者状态',
    },
    {
        label: '微服务链路',
        prompt: '创建一个微服务链路追踪仪表盘，展示调用链成功率、各服务响应时间柱状图、调用拓扑关系、错误链路分析',
    },
    {
        label: 'SSL证书',
        prompt: '创建一个SSL证书监控仪表盘，展示证书到期倒计时、各域名证书状态列表、证书有效期分布、即将过期告警',
    },
    {
        label: 'DDoS防护',
        prompt: '创建一个DDoS防护仪表盘，展示攻击流量仪表盘、攻击类型分布饼图、攻击趋势折线图、拦截成功率、来源地区分布',
    },
    {
        label: 'VPN连接',
        prompt: '创建一个VPN连接监控仪表盘，展示在线连接数仪表盘、各节点连接量柱状图、连接成功率趋势、带宽使用情况',
    },
    {
        label: '网络设备',
        prompt: '创建一个网络设备监控仪表盘，展示设备在线率仪表盘、各设备CPU/内存使用率柱状图、端口流量趋势折线图、设备状态列表',
    },
    {
        label: '机房环境',
        prompt: '创建一个机房环境监控仪表盘，展示温度/湿度仪表盘、各机柜温度柱状图、环境趋势折线图、告警状态列表',
    },
    {
        label: '容器集群',
        prompt: '创建一个容器集群监控仪表盘，展示Pod运行数量、节点资源使用率柱状图、容器重启趋势折线图、命名空间分布',
    },
    {
        label: '日志分析',
        prompt: '创建一个日志分析仪表盘，展示日志总量趋势折线图、日志级别分布饼图、各服务日志量柱状图、错误日志Top10',
    },
    {
        label: '安全事件',
        prompt: '创建一个安全事件监控仪表盘，展示今日安全事件数、事件类型分布饼图、威胁级别柱状图、事件趋势折线图',
    },
    {
        label: '配置变更',
        prompt: '创建一个配置变更追踪仪表盘，展示今日变更次数、变更类型分布饼图、变更趋势折线图、最近变更记录列表',
    },
    {
        label: '容量规划',
        prompt: '创建一个容量规划仪表盘，展示资源利用率趋势折线图、预测增长曲线、各服务资源占比饼图、扩容建议列表',
    },
    {
        label: '网络拓扑',
        prompt: '创建一个网络拓扑概览仪表盘，展示各层级设备数量、链路状态分布、流量流向分析、关键路径延迟',
    },
    {
        label: 'HTTP性能',
        prompt: '创建一个HTTP性能监控仪表盘，展示平均响应时间仪表盘、状态码分布饼图、请求量趋势折线图、慢接口Top10柱状图',
    },
    {
        label: 'TCP连接',
        prompt: '创建一个TCP连接监控仪表盘，展示活跃连接数仪表盘、连接状态分布饼图、新建连接趋势折线图、各端口连接量柱状图',
    },
    {
        label: '存储系统',
        prompt: '创建一个存储系统监控仪表盘，展示存储容量使用率仪表盘、IOPS趋势折线图、各存储池占比饼图、读写延迟柱状图',
    },
] as const

function getRandomTemplates(count: number) {
    const shuffled = [...ALL_TEMPLATES].sort(() => Math.random() - 0.5)
    return shuffled.slice(0, count)
}

export function QuickTemplates({ onSelect }: QuickTemplatesProps) {
    const templates = useMemo(() => getRandomTemplates(9), [])

    return (
        <div className="space-y-2.5">
            <h3 className="flex items-center gap-2 text-[10px] font-medium text-zinc-400 uppercase tracking-widest font-mono px-0.5">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-zinc-300">
                    <path d="M2 3h8M2 6h5M2 9h7" />
                </svg>
                快捷模板
            </h3>
            <div className="flex flex-wrap gap-1.5">
                {templates.map((tpl) => (
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
