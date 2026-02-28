import type { Spec } from '@json-render/core'
import { fourColumnSpec } from '@/specs/four-column'
import { splitViewSpec } from '@/specs/split-view'
import { trafficChartSpec } from '@/specs/traffic-chart'
import { healthTopologySpec } from '@/specs/health-topology'

export const presetSpecs: Record<string, Spec> = {
    'four-column': fourColumnSpec,
    'split-view': splitViewSpec,
    'traffic-chart': trafficChartSpec,
    'health-topology': healthTopologySpec,
}
