export type TrendType = 'up' | 'down' | 'flat'

export interface MetricItem {
  id: string
  title: string
  value: number
  unit?: string
  delta?: number
  trend?: TrendType
}

export interface TrendPoint {
  label: string
  value: number
}

export interface TrainingTask {
  id: string
  name: string
  owner: string
  status: '进行中' | '待启动' | '已完成'
  progress: number
  dataset: string
  updatedAt: string
}

export interface CourseItem {
  id: string
  title: string
  category: string
  learners: number
  completionRate: number
  updatedAt: string
}

export interface CertificationItem {
  id: string
  name: string
  level: '初级' | '中级' | '高级'
  participants: number
  passRate: number
  status: '报名中' | '进行中' | '已结束'
  updatedAt: string
}

