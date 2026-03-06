import type { DataQueryRequest, DataQueryResponse, ChartSeriesData, PieChartData, GaugeChartData } from '../types/data.js'

// 模拟的集群列表
const MOCK_CLUSTERS = [
  'bdbl-sys-bgwcluster',
  'bdbl-sys-bgwcluster-2',
  'bdbl-sys-bgwcluster-3',
]

// 时间标签
const TIME_LABELS = ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '24:00']

// 模拟 VIP 数据
const mockVIPData: Record<string, ChartSeriesData> = {
  'bdbl-sys-bgwcluster': {
    xAxis: TIME_LABELS,
    series: [
      { name: 'VIP连接数', data: [128, 145, 189, 234, 198, 156, 142] },
      { name: 'VIP活跃数', data: [98, 112, 145, 189, 156, 128, 115] },
    ]
  },
  'bdbl-sys-bgwcluster-2': {
    xAxis: TIME_LABELS,
    series: [
      { name: 'VIP连接数', data: [85, 92, 108, 125, 118, 95, 88] },
      { name: 'VIP活跃数', data: [65, 72, 85, 98, 92, 75, 68] },
    ]
  },
  'bdbl-sys-bgwcluster-3': {
    xAxis: TIME_LABELS,
    series: [
      { name: 'VIP连接数', data: [210, 235, 268, 312, 285, 248, 225] },
      { name: 'VIP活跃数', data: [180, 195, 225, 268, 245, 215, 198] },
    ]
  },
}

// 模拟 VS 数据
const mockVSData: Record<string, ChartSeriesData> = {
  'bdbl-sys-bgwcluster': {
    xAxis: TIME_LABELS,
    series: [
      { name: 'VS数量', data: [45, 52, 68, 89, 76, 58, 51] },
      { name: 'VS活跃', data: [38, 45, 58, 75, 65, 48, 42] },
    ]
  },
  'bdbl-sys-bgwcluster-2': {
    xAxis: TIME_LABELS,
    series: [
      { name: 'VS数量', data: [32, 38, 45, 56, 48, 38, 35] },
      { name: 'VS活跃', data: [25, 30, 38, 48, 40, 32, 28] },
    ]
  },
  'bdbl-sys-bgwcluster-3': {
    xAxis: TIME_LABELS,
    series: [
      { name: 'VS数量', data: [78, 85, 98, 115, 105, 92, 85] },
      { name: 'VS活跃', data: [65, 72, 85, 98, 88, 78, 72] },
    ]
  },
}

// 模拟 Server 数据
const mockServerData: Record<string, PieChartData> = {
  'bdbl-sys-bgwcluster': {
    data: [
      { name: '运行中', value: 128 },
      { name: '异常', value: 3 },
      { name: '维护中', value: 5 },
    ]
  },
  'bdbl-sys-bgwcluster-2': {
    data: [
      { name: '运行中', value: 85 },
      { name: '异常', value: 2 },
      { name: '维护中', value: 3 },
    ]
  },
  'bdbl-sys-bgwcluster-3': {
    data: [
      { name: '运行中', value: 210 },
      { name: '异常', value: 5 },
      { name: '维护中', value: 8 },
    ]
  },
}

// 模拟 Connection 数据
const mockConnectionData: Record<string, GaugeChartData> = {
  'bdbl-sys-bgwcluster': {
    value: 85,
    min: 0,
    max: 100,
    unit: '%'
  },
  'bdbl-sys-bgwcluster-2': {
    value: 92,
    min: 0,
    max: 100,
    unit: '%'
  },
  'bdbl-sys-bgwcluster-3': {
    value: 78,
    min: 0,
    max: 100,
    unit: '%'
  },
}

/**
 * 获取 Mock 数据
 */
export async function getMockData(params: DataQueryRequest): Promise<DataQueryResponse> {
  const { cluster = 'bdbl-sys-bgwcluster', resourceType } = params

  // 模拟延迟
  await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 200))

  switch (resourceType) {
    case 'VIP':
      return mockVIPData[cluster] || mockVIPData['bdbl-sys-bgwcluster']

    case 'VS':
      return mockVSData[cluster] || mockVSData['bdbl-sys-bgwcluster']

    case 'Server':
      return mockServerData[cluster] || mockServerData['bdbl-sys-bgwcluster']

    case 'Connection':
      return mockConnectionData[cluster] || mockConnectionData['bdbl-sys-bgwcluster']

    default:
      throw new Error(`Unknown resource type: ${resourceType}`)
  }
}

/**
 * 获取可用的集群列表
 */
export function getAvailableClusters(): string[] {
  return MOCK_CLUSTERS
}
