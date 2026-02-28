import { GridIcon } from '@/icons/grid-icon'
import { ChartIcon } from '@/icons/chart-icon'
import type { CommandCategory } from '@/types/commands'

export const commandCategories: CommandCategory[] = [
    {
        id: 'layout',
        title: '布局架构',
        icon: GridIcon,
        commands: [
            { id: 'four-column', label: '标准四栏指标页签', shortcut: 'Alt+1' },
            { id: 'split-view', label: '左右分栏监控视图', shortcut: 'Alt+2' },
        ],
    },
    {
        id: 'data',
        title: '数据展示',
        icon: ChartIcon,
        commands: [
            { id: 'traffic-chart', label: '实时流量堆叠图', shortcut: 'Alt+3' },
            { id: 'health-topology', label: '节点健康度拓扑', shortcut: 'Alt+4' },
        ],
    },
]
