import { defineRegistry } from '@json-render/react'
import { catalog } from '@/renderer/catalog'
import { Grid } from '@/renderer/components/grid'
import { Flex } from '@/renderer/components/flex'
import { Card } from '@/renderer/components/card'
import { MetricCard } from '@/renderer/components/metric-card'
import { ChartPlaceholder } from '@/renderer/components/chart-placeholder'
import { LineChart } from '@/renderer/components/line-chart'
import { BarChart } from '@/renderer/components/bar-chart'
import { SectionTitle } from '@/renderer/components/section-title'
import { StatusDot } from '@/renderer/components/status-dot'

// Zod v4 type inference doesn't fully propagate through defineCatalog's generic chain,
// causing ComponentContext.props to resolve as `unknown`. The runtime behavior is correct
// — props are resolved from the spec at render time.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const { registry } = defineRegistry(catalog, {
    components: {
        Grid,
        Flex,
        Card,
        MetricCard,
        ChartPlaceholder,
        LineChart,
        BarChart,
        SectionTitle,
        StatusDot,
    },
} as any)
