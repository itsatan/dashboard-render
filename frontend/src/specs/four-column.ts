import type { Spec } from '@json-render/core'

export const fourColumnSpec: Spec = {
    root: 'page',
    elements: {
        'page': {
            type: 'Flex',
            props: { direction: 'col', gap: 5 },
            children: ['title-1', 'metrics-row', 'charts-row'],
        },
        'title-1': {
            type: 'SectionTitle',
            props: { title: '核心指标概览', description: '实时业务关键指标' },
            children: [],
        },
        'metrics-row': {
            type: 'Grid',
            props: { columns: 4, gap: 4 },
            children: ['metric-1', 'metric-2', 'metric-3', 'metric-4'],
        },
        'metric-1': {
            type: 'MetricCard',
            props: { label: '总收入', value: '¥128.5K', unit: 'CNY', trend: 'up', trendValue: '+12.3%', color: 'blue' },
            children: [],
        },
        'metric-2': {
            type: 'MetricCard',
            props: { label: '活跃用户', value: '24,891', trend: 'up', trendValue: '+5.2%', color: 'green' },
            children: [],
        },
        'metric-3': {
            type: 'MetricCard',
            props: { label: '转化率', value: '3.24', unit: '%', trend: 'down', trendValue: '-0.8%', color: 'amber' },
            children: [],
        },
        'metric-4': {
            type: 'MetricCard',
            props: { label: '平均响应', value: '142', unit: 'ms', trend: 'flat', trendValue: '0.0%', color: 'default' },
            children: [],
        },
        'charts-row': {
            type: 'Grid',
            props: { columns: 2, gap: 4 },
            children: ['chart-1', 'chart-2'],
        },
        'chart-1': {
            type: 'ChartPlaceholder',
            props: { title: '收入趋势 (近 30 天)', chartType: 'area', height: 'lg' },
            children: [],
        },
        'chart-2': {
            type: 'ChartPlaceholder',
            props: { title: '用户增长分布', chartType: 'bar', height: 'lg' },
            children: [],
        },
    },
}
