import { defineCatalog } from '@json-render/core'
import { schema } from '@json-render/react/schema'
import { z } from 'zod'

export const catalog = defineCatalog(schema, {
    components: {
        Grid: {
            props: z.object({
                columns: z.number().min(1).max(12).default(4),
                gap: z.number().default(4),
            }),
            slots: ['default'],
            description: 'CSS Grid layout container. Children are placed in grid cells.',
        },

        Flex: {
            props: z.object({
                direction: z.enum(['row', 'col']).default('row'),
                gap: z.number().default(4),
                align: z.enum(['start', 'center', 'end', 'stretch']).optional(),
                justify: z.enum(['start', 'center', 'end', 'between', 'around']).optional(),
            }),
            slots: ['default'],
            description: 'Flexbox layout container.',
        },

        Card: {
            props: z.object({
                title: z.string().optional(),
                subtitle: z.string().optional(),
                padding: z.enum(['none', 'sm', 'md', 'lg']).default('md'),
            }),
            slots: ['default'],
            description: 'A card container with optional title and border/shadow.',
        },

        MetricCard: {
            props: z.object({
                label: z.string(),
                value: z.string(),
                unit: z.string().optional(),
                trend: z.enum(['up', 'down', 'flat']).optional(),
                trendValue: z.string().optional(),
                color: z.enum(['default', 'blue', 'green', 'red', 'amber']).default('default'),
            }),
            description: 'A KPI metric display card with label, value, and optional trend indicator.',
        },

        ChartPlaceholder: {
            props: z.object({
                title: z.string(),
                chartType: z.enum(['line', 'bar', 'area', 'pie', 'donut', 'scatter', 'stacked-area', 'topology']).default('line'),
                height: z.enum(['sm', 'md', 'lg', 'xl']).default('md'),
            }),
            description: 'A visual placeholder representing a chart area.',
        },

        SectionTitle: {
            props: z.object({
                title: z.string(),
                description: z.string().optional(),
            }),
            description: 'A section heading with optional description text.',
        },

        StatusDot: {
            props: z.object({
                label: z.string(),
                status: z.enum(['healthy', 'warning', 'critical', 'unknown']).default('healthy'),
            }),
            description: 'A small status indicator dot with a label.',
        },
    },
    actions: {},
})
