// 数据查询请求
export interface DataQueryRequest {
  cluster?: string
  resourceType: 'VIP' | 'VS' | 'Server' | 'Connection'
  timeRange?: {
    start: string
    end: string
  }
}

// 折线图/柱状图数据
export interface ChartSeriesData {
  xAxis: string[]
  series: Array<{
    name: string
    data: number[]
  }>
}

// 饼图数据
export interface PieChartData {
  data: Array<{
    name: string
    value: number
  }>
}

// 雷达图数据
export interface RadarChartData {
  indicator: Array<{
    name: string
    max: number
  }>
  series: Array<{
    name: string
    data: number[]
  }>
}

// 仪表盘数据
export interface GaugeChartData {
  value: number
  min?: number
  max?: number
  unit?: string
}

// 数据查询响应（联合类型）
export type DataQueryResponse =
  | ChartSeriesData
  | PieChartData
  | RadarChartData
  | GaugeChartData
