import type {
  CertificationItem,
  CourseItem,
  MetricItem,
  TrendPoint,
  TrainingTask,
} from '../types/dashboard'

const delay = (ms = 320) => new Promise((resolve) => window.setTimeout(resolve, ms))

export const fetchMaturityMetrics = async (): Promise<MetricItem[]> => {
  await delay()
  return [
    { id: 'coverage', title: '覆盖组织数', value: 128, unit: '个', delta: 12, trend: 'up' },
    { id: 'roles', title: '覆盖岗位数', value: 46, unit: '个', delta: 5, trend: 'up' },
    { id: 'adoption', title: '整体成熟度', value: 78, unit: '分', delta: 6, trend: 'up' },
    { id: 'automation', title: '流程自动化率', value: 62, unit: '%', delta: -4, trend: 'down' },
  ]
}

export const fetchMaturityTrend = async (): Promise<TrendPoint[]> => {
  await delay()
  return [
    { label: '04-01', value: 48 },
    { label: '04-08', value: 52 },
    { label: '04-15', value: 58 },
    { label: '04-22', value: 63 },
    { label: '04-29', value: 66 },
    { label: '05-06', value: 70 },
    { label: '05-13', value: 74 },
    { label: '05-20', value: 78 },
  ]
}

export const fetchTrainingTasks = async (): Promise<TrainingTask[]> => {
  await delay()
  return [
    {
      id: 'tt-001',
      name: '文本分类模型 V2',
      owner: '王琪',
      status: '进行中',
      progress: 72,
      dataset: '客服会话语料 V5',
      updatedAt: '2025-05-18 14:20',
    },
    {
      id: 'tt-002',
      name: '智能推荐模型 A/B 测试',
      owner: '陈宇',
      status: '待启动',
      progress: 0,
      dataset: '用户行为特征集',
      updatedAt: '2025-05-16 10:05',
    },
    {
      id: 'tt-003',
      name: '视觉质检模型迭代',
      owner: '李华',
      status: '进行中',
      progress: 54,
      dataset: '质检图像数据集',
      updatedAt: '2025-05-15 18:32',
    },
    {
      id: 'tt-004',
      name: '智能问答知识蒸馏',
      owner: '赵敏',
      status: '已完成',
      progress: 100,
      dataset: 'FAQ 标准语料',
      updatedAt: '2025-05-12 09:18',
    },
  ]
}

export const fetchCourses = async (): Promise<CourseItem[]> => {
  await delay()
  return [
    {
      id: 'course-01',
      title: 'AI 赋能基础课程',
      category: '基础能力',
      learners: 1284,
      completionRate: 86,
      updatedAt: '2025-05-18',
    },
    {
      id: 'course-02',
      title: '大模型提示词设计实践',
      category: 'Prompt 工程',
      learners: 982,
      completionRate: 78,
      updatedAt: '2025-05-17',
    },
    {
      id: 'course-03',
      title: '数据标注质量控制',
      category: '数据治理',
      learners: 624,
      completionRate: 64,
      updatedAt: '2025-05-15',
    },
  ]
}

export const fetchCertifications = async (): Promise<CertificationItem[]> => {
  await delay()
  return [
    {
      id: 'cert-001',
      name: 'AI 业务专家认证',
      level: '高级',
      participants: 168,
      passRate: 68,
      status: '报名中',
      updatedAt: '2025-05-15',
    },
    {
      id: 'cert-002',
      name: 'AI 训练工程师认证',
      level: '中级',
      participants: 245,
      passRate: 74,
      status: '进行中',
      updatedAt: '2025-05-12',
    },
    {
      id: 'cert-003',
      name: 'AI 学习导师认证',
      level: '初级',
      participants: 312,
      passRate: 82,
      status: '已结束',
      updatedAt: '2025-05-10',
    },
  ]
}

export const fetchCertificationDetail = async (id: string): Promise<CertificationItem | undefined> => {
  const list = await fetchCertifications()
  return list.find((item) => item.id === id)
}

export const fetchCourseDetail = async (id: string): Promise<CourseItem | undefined> => {
  const list = await fetchCourses()
  return list.find((item) => item.id === id)
}

export const fetchTrainingDetail = async (id: string): Promise<TrainingTask | undefined> => {
  const list = await fetchTrainingTasks()
  return list.find((item) => item.id === id)
}

