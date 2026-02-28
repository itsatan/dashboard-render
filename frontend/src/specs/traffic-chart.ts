import type { Spec } from '@json-render/core'

export const trafficChartSpec: Spec = {
    root: 'page',
    elements: {
        'page': {
            type: 'Flex',
            props: { direction: 'col', gap: 5 },
            children: ['title-1', 'metrics-row', 'main-chart', 'detail-row'],
        },
        'title-1': {
            type: 'SectionTitle',
            props: { title: '实时流量监控', description: '全站流量堆叠分析与细分' },
            children: [],
        },
        'metrics-row': {
            type: 'Grid',
            props: { columns: 3, gap: 4 },
            children: ['metric-qps', 'metric-bandwidth', 'metric-error-rate'],
        },
        'metric-qps': {
            type: 'MetricCard',
            props: { label: '当前 QPS', value: '12,847', trend: 'up', trendValue: '+18.2%', color: 'blue' },
            children: [],
        },
        'metric-bandwidth': {
            type: 'MetricCard',
            props: { label: '带宽吞吐', value: '2.4', unit: 'Gbps', trend: 'up', trendValue: '+6.7%', color: 'green' },
            children: [],
        },
        'metric-error-rate': {
            type: 'MetricCard',
            props: { label: '错误率', value: '0.03', unit: '%', trend: 'down', trendValue: '-0.01%', color: 'green' },
            children: [],
        },
        'main-chart': {
            type: 'ChartPlaceholder',
            props: { title: '流量堆叠趋势 (近 24h)', chartType: 'stacked-area', height: 'xl' },
            children: [],
        },
        'detail-row': {
            type: 'Grid',
            props: { columns: 2, gap: 4 },
            children: ['chart-by-region', 'chart-by-service'],
        },
        'chart-by-region': {
            type: 'ChartPlaceholder',
            props: { title: '按地域分布', chartType: 'pie', height: 'md' },
            children: [],
        },
        'chart-by-service': {
            type: 'ChartPlaceholder',
            props: { title: '按服务分布', chartType: 'bar', height: 'md' },
            children: [],
        },
    },
}
