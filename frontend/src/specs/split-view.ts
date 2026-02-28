import type { Spec } from '@json-render/core'

export const splitViewSpec: Spec = {
    root: 'page',
    elements: {
        'page': {
            type: 'Flex',
            props: { direction: 'col', gap: 5 },
            children: ['title-1', 'content'],
        },
        'title-1': {
            type: 'SectionTitle',
            props: { title: '系统监控面板', description: '左右分栏，实时监控关键指标' },
            children: [],
        },
        'content': {
            type: 'Grid',
            props: { columns: 2, gap: 4 },
            children: ['left-panel', 'right-panel'],
        },
        'left-panel': {
            type: 'Flex',
            props: { direction: 'col', gap: 3 },
            children: ['metric-1', 'metric-2', 'metric-3', 'metric-4'],
        },
        'metric-1': {
            type: 'MetricCard',
            props: { label: 'CPU 使用率', value: '67.2', unit: '%', trend: 'up', trendValue: '+3.1%', color: 'amber' },
            children: [],
        },
        'metric-2': {
            type: 'MetricCard',
            props: { label: '内存占用', value: '12.8', unit: 'GB', trend: 'flat', trendValue: '0.0%', color: 'blue' },
            children: [],
        },
        'metric-3': {
            type: 'MetricCard',
            props: { label: '磁盘 I/O', value: '340', unit: 'MB/s', trend: 'down', trendValue: '-8.5%', color: 'green' },
            children: [],
        },
        'metric-4': {
            type: 'MetricCard',
            props: { label: '网络延迟', value: '23', unit: 'ms', trend: 'up', trendValue: '+1.2ms', color: 'red' },
            children: [],
        },
        'right-panel': {
            type: 'Flex',
            props: { direction: 'col', gap: 4 },
            children: ['chart-main', 'chart-secondary'],
        },
        'chart-main': {
            type: 'ChartPlaceholder',
            props: { title: 'CPU 负载时间线', chartType: 'line', height: 'lg' },
            children: [],
        },
        'chart-secondary': {
            type: 'ChartPlaceholder',
            props: { title: '内存使用分布', chartType: 'area', height: 'md' },
            children: [],
        },
    },
}
