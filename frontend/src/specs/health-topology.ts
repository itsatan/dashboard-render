import type { Spec } from '@json-render/core'

export const healthTopologySpec: Spec = {
    root: 'page',
    elements: {
        'page': {
            type: 'Flex',
            props: { direction: 'col', gap: 5 },
            children: ['title-1', 'status-grid', 'topology-chart', 'detail-section'],
        },
        'title-1': {
            type: 'SectionTitle',
            props: { title: '节点健康度拓扑', description: '集群节点运行状态总览' },
            children: [],
        },
        'status-grid': {
            type: 'Grid',
            props: { columns: 6, gap: 3 },
            children: ['node-1', 'node-2', 'node-3', 'node-4', 'node-5', 'node-6'],
        },
        'node-1': {
            type: 'StatusDot',
            props: { label: 'node-cn-bj-01', status: 'healthy' },
            children: [],
        },
        'node-2': {
            type: 'StatusDot',
            props: { label: 'node-cn-sh-02', status: 'healthy' },
            children: [],
        },
        'node-3': {
            type: 'StatusDot',
            props: { label: 'node-cn-gz-03', status: 'warning' },
            children: [],
        },
        'node-4': {
            type: 'StatusDot',
            props: { label: 'node-us-east-01', status: 'healthy' },
            children: [],
        },
        'node-5': {
            type: 'StatusDot',
            props: { label: 'node-eu-west-01', status: 'critical' },
            children: [],
        },
        'node-6': {
            type: 'StatusDot',
            props: { label: 'node-ap-sg-01', status: 'unknown' },
            children: [],
        },
        'topology-chart': {
            type: 'ChartPlaceholder',
            props: { title: '集群拓扑图', chartType: 'topology', height: 'xl' },
            children: [],
        },
        'detail-section': {
            type: 'Grid',
            props: { columns: 2, gap: 4 },
            children: ['chart-cpu', 'chart-memory'],
        },
        'chart-cpu': {
            type: 'ChartPlaceholder',
            props: { title: '各节点 CPU 对比', chartType: 'bar', height: 'md' },
            children: [],
        },
        'chart-memory': {
            type: 'ChartPlaceholder',
            props: { title: '各节点内存对比', chartType: 'bar', height: 'md' },
            children: [],
        },
    },
}
