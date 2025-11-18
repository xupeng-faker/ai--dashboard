import type {
  DepartmentCertStatistic,
  AppointmentAuditRecord,
  CadreAppointmentSummaryRow,
  CadreCertificationSummaryRow,
  CertificationAuditRecord,
  CertificationDashboardData,
  CertificationDashboardFilters,
  CertificationDetailData,
  CertificationDetailFilters,
  CertificationItem,
  CourseItem,
  DepartmentInfoVO,
  DepartmentNode,
  EmployeeCertStatisticsResponse,
  ExpertAppointmentSummaryRow,
  ExpertCertificationSummaryRow,
  MetricItem,
  Result,
  SchoolDashboardData,
  SchoolDashboardFilters,
  SchoolDetailData,
  SchoolDetailFilters,
  StaffChartPoint,
  TrendPoint,
  TrainingAllStaffSummaryGroup,
  TrainingDashboardData,
  TrainingDashboardFilters,
  TrainingExpertCadreSummary,
  TrainingDetailData,
  TrainingDetailFilters,
  TrainingBattleRecord,
  TrainingCoursePlanRecord,
  TrainingPlanningResource,
  TrainingRole,
  TrainingRoleSummaryRow,
  TrainingTask,
} from '../types/dashboard'
import { get } from '../utils/request'

const delay = (ms = 320) => new Promise((resolve) => window.setTimeout(resolve, ms))

const resolveDepartmentCode = (deptPath?: string[]) => {
  if (!deptPath || deptPath.length === 0) {
    return '0'
  }
  const last = deptPath[deptPath.length - 1]
  return last && last.trim().length ? last : '0'
}

const mapDepartmentCertStatsToCharts = (stats?: DepartmentCertStatistic[]) => {
  if (!stats || stats.length === 0) {
    return null
  }

  const normalizeLabel = (name?: string, code?: string) => {
    if (name && name.trim().length) {
      return name
    }
    if (code && code.trim().length) {
      return code
    }
    return '未知部门'
  }

  return {
    appointment: stats.map((item) => ({
      label: normalizeLabel(item.deptName, item.deptCode),
      count: item.totalCount ?? 0,
      rate: Number(item.certRate ?? 0),
    })),
    certification: stats.map((item) => ({
      label: normalizeLabel(item.deptName, item.deptCode),
      count: item.certifiedCount ?? 0,
      rate: Number(item.certRate ?? 0),
    })),
  }
}

const fetchEmployeeCertStatistics = async (
  deptCode: string,
  personType: string
): Promise<EmployeeCertStatisticsResponse | null> => {
  try {
    const query = new URLSearchParams({
      deptCode: deptCode || '0',
      personType: personType || '0',
    })
    const response = await get<Result<EmployeeCertStatisticsResponse>>(
      `/ai_transform/webapi/expert-cert-statistics/employee-cert-statistics?${query.toString()}`
    )
    if (response.code === 200) {
      return response.data
    }
    console.warn('获取员工任职/认证数据失败：', response.message)
    return null
  } catch (error) {
    console.error('获取员工任职/认证数据异常：', error)
    return null
  }
}

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
      name: 'AI 训战工程师认证',
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

export const fetchCertificationDashboard = async (
  _filters?: CertificationDashboardFilters
): Promise<CertificationDashboardData> => {
  await delay()
  const deptCode = resolveDepartmentCode(_filters?.departmentPath)
  const personType = _filters?.role ?? '0'
  const [expertData, cadreData, allStaffData, deptTree, employeeCertStats] = await Promise.all([
    fetchExpertCertificationSummary(),
    fetchCadreCertificationSummary(),
    fetchOverallCertificationTrends(),
    fetchDepartmentTree(),
    fetchEmployeeCertStatistics(deptCode, personType),
  ])

  const departmentCharts = mapDepartmentCertStatsToCharts(employeeCertStats?.departmentStatistics)

  return {
    metrics: [
      { id: 'expert-cert', title: '专家认证总数', value: 62, unit: '人', delta: 8, trend: 'up' },
      { id: 'cadre-cert', title: '干部认证总数', value: 99, unit: '人', delta: 12, trend: 'up' },
      { id: 'all-appointed', title: '全员任职人数', value: 270, unit: '人', delta: 18, trend: 'up' },
      { id: 'all-certified', title: '全员认证人数', value: 280, unit: '人', delta: 22, trend: 'up' },
    ],
    expertCertification: expertData.certification,
    expertAppointment: expertData.appointment,
    cadreCertification: cadreData.certification,
    cadreAppointment: cadreData.appointment,
    allStaff: {
      departmentAppointment: departmentCharts?.appointment?.length
        ? departmentCharts.appointment
        : allStaffData.departmentAppointment,
      organizationAppointment: allStaffData.organizationAppointment,
      jobCategoryAppointment: allStaffData.jobCategoryAppointment,
      departmentCertification: departmentCharts?.certification?.length
        ? departmentCharts.certification
        : allStaffData.departmentCertification,
      organizationCertification: allStaffData.organizationCertification,
      jobCategoryCertification: allStaffData.jobCategoryCertification,
    },
    employeeCertStatistics: employeeCertStats ?? null,
    filters: {
      departmentTree: deptTree,
      roles: [
        { label: '全员', value: '0' },
        { label: '干部', value: '1' },
        { label: '专家', value: '2' },
        { label: '基层主管', value: '3' },
      ],
      maturityOptions: [
        { label: '全部', value: '全部' },
        { label: 'L1', value: 'L1' },
        { label: 'L2', value: 'L2' },
        { label: 'L3', value: 'L3' },
      ],
    },
  }
}

export const fetchCertificationDetailData = async (
  id: string,
  _filters?: CertificationDetailFilters
): Promise<CertificationDetailData> => {
  await delay()
  const [auditData, deptTree] = await Promise.all([fetchCertificationAuditRecords(), fetchDepartmentTree()])

  return {
    summary: {
      id,
      name: 'AI 任职认证详情',
      level: '高级',
      participants: 168,
      passRate: 68,
      status: '进行中',
      updatedAt: '2025-05-15',
    },
    certificationRecords: auditData.certificateAudits,
    appointmentRecords: auditData.appointmentAudits,
    filters: {
      departmentTree: deptTree,
      jobFamilies: ['技术类', '管理类', '业务类'],
      jobCategories: ['AI 架构师', '数据科学家', '算法专家', '营销干部', '运营干部', '客服干部'],
      jobSubCategories: ['CV', 'NLP', '流程优化', '渠道拓展'],
      roles: [
        { label: '全员', value: '0' },
        { label: '干部', value: '1' },
        { label: '专家', value: '2' },
        { label: '基层主管', value: '3' },
      ],
      maturityOptions: [
        { label: '全部', value: '全部' },
        { label: 'L1', value: 'L1' },
        { label: 'L2', value: 'L2' },
        { label: 'L3', value: 'L3' },
      ],
    },
  }
}

export const fetchCourseDetail = async (id: string): Promise<CourseItem | undefined> => {
  const list = await fetchCourses()
  return list.find((item) => item.id === id)
}

export const fetchTrainingDetail = async (
  _id: string,
  _filters?: TrainingDetailFilters
): Promise<TrainingDetailData> => {
  await delay()
  const [deptTree] = await Promise.all([fetchDepartmentTree()])

  const records: TrainingBattleRecord[] = [
    {
      id: 'tb-001',
      name: '李莉',
      employeeId: 'E1024',
      jobFamily: '技术类',
      jobCategory: '算法专家',
      jobSubCategory: 'CV',
      departmentPath: ['总部', '数字化部', 'AI 运营中心', '业务赋能组', '区域一组', 'A 区域'],
      departmentLevel1: '总部',
      departmentLevel2: '数字化部',
      departmentLevel3: 'AI 运营中心',
      departmentLevel4: '业务赋能组',
      departmentLevel5: '区域一组',
      departmentLevel6: 'A 区域',
      minDepartment: 'AI 赋能站 A1',
      trainingCategory: '初阶训练',
      courseCategory: '模型精调',
      courseName: '视觉质检模型调优',
      isTargetCourse: true,
      isCompleted: true,
      completionDate: '2025-05-06',
      isCadre: false,
      cadreType: undefined,
      isExpert: true,
      isFrontlineManager: false,
      organizationMaturity: 'L3',
      positionMaturity: 'L3',
    },
    {
      id: 'tb-002',
      name: '王凯',
      employeeId: 'E1056',
      jobFamily: '管理类',
      jobCategory: '运营干部',
      jobSubCategory: '流程优化',
      departmentPath: ['华东大区', '上海分部', 'AI 实施中心', '第一项目组', '实施一队', '东区'],
      departmentLevel1: '华东大区',
      departmentLevel2: '上海分部',
      departmentLevel3: 'AI 实施中心',
      departmentLevel4: '第一项目组',
      departmentLevel5: '实施一队',
      departmentLevel6: '东区',
      minDepartment: '实施一队 A 组',
      trainingCategory: '中阶训练',
      courseCategory: '流程治理',
      courseName: 'AI 驱动流程重构',
      isTargetCourse: true,
      isCompleted: true,
      completionDate: '2025-05-12',
      isCadre: true,
      cadreType: '管理干部',
      isExpert: false,
      isFrontlineManager: true,
      organizationMaturity: 'L2',
      positionMaturity: 'L2',
    },
    {
      id: 'tb-003',
      name: '赵敏',
      employeeId: 'E1066',
      jobFamily: '业务类',
      jobCategory: '营销干部',
      jobSubCategory: '渠道拓展',
      departmentPath: ['华东大区', '杭州分部', 'AI 体验中心', '渠道二部', '拓展组', '南区'],
      departmentLevel1: '华东大区',
      departmentLevel2: '杭州分部',
      departmentLevel3: 'AI 体验中心',
      departmentLevel4: '渠道二部',
      departmentLevel5: '拓展组',
      departmentLevel6: '南区',
      minDepartment: '拓展组 B',
      trainingCategory: '实战演练',
      courseCategory: '渠道经营',
      courseName: 'AI 客户增长实战营',
      isTargetCourse: true,
      isCompleted: false,
      completionDate: undefined,
      isCadre: true,
      cadreType: '业务干部',
      isExpert: false,
      isFrontlineManager: true,
      organizationMaturity: 'L1',
      positionMaturity: 'L1',
    },
    {
      id: 'tb-004',
      name: '陈宇',
      employeeId: 'E1120',
      jobFamily: '技术类',
      jobCategory: '数据科学家',
      jobSubCategory: 'NLP',
      departmentPath: ['总部', '数字化部', '数据科学组', '文本智能小组', '模型实验室', '北区'],
      departmentLevel1: '总部',
      departmentLevel2: '数字化部',
      departmentLevel3: '数据科学组',
      departmentLevel4: '文本智能小组',
      departmentLevel5: '模型实验室',
      departmentLevel6: '北区',
      minDepartment: '文本智能北区组',
      trainingCategory: '高阶训练',
      courseCategory: '模型精调',
      courseName: '大模型提示词工程',
      isTargetCourse: false,
      isCompleted: true,
      completionDate: '2025-04-28',
      isCadre: false,
      cadreType: undefined,
      isExpert: true,
      isFrontlineManager: false,
      organizationMaturity: 'L2',
      positionMaturity: 'L2',
    },
    {
      id: 'tb-005',
      name: '周敏',
      employeeId: 'E1188',
      jobFamily: '管理类',
      jobCategory: '基层主管',
      jobSubCategory: '服务运营',
      departmentPath: ['华南大区', '深圳分部', 'AI 创新中心', '运营进阶部', '客服运营组', '南区'],
      departmentLevel1: '华南大区',
      departmentLevel2: '深圳分部',
      departmentLevel3: 'AI 创新中心',
      departmentLevel4: '运营进阶部',
      departmentLevel5: '客服运营组',
      departmentLevel6: '南区',
      minDepartment: '客服运营南区站',
      trainingCategory: '实战演练',
      courseCategory: '服务创新',
      courseName: 'AI 赋能客服质检',
      isTargetCourse: false,
      isCompleted: true,
      completionDate: '2025-05-02',
      isCadre: true,
      cadreType: '基层主管',
      isExpert: false,
      isFrontlineManager: true,
      organizationMaturity: 'L2',
      positionMaturity: 'L2',
    },
    {
      id: 'tb-006',
      name: '刘洋',
      employeeId: 'E1210',
      jobFamily: '业务类',
      jobCategory: '产品经理',
      jobSubCategory: '智能产品',
      departmentPath: ['总部', '智能产品部', '体验设计组', '产品运营组', '创新项目组', '东区'],
      departmentLevel1: '总部',
      departmentLevel2: '智能产品部',
      departmentLevel3: '体验设计组',
      departmentLevel4: '产品运营组',
      departmentLevel5: '创新项目组',
      departmentLevel6: '东区',
      minDepartment: '创新项目东区组',
      trainingCategory: '中阶训练',
      courseCategory: '产品创新',
      courseName: 'AI 产品落地实践',
      isTargetCourse: true,
      isCompleted: false,
      completionDate: undefined,
      isCadre: false,
      cadreType: undefined,
      isExpert: false,
      isFrontlineManager: false,
      organizationMaturity: 'L2',
      positionMaturity: 'L1',
    },
  ]

  const coursePlans: TrainingCoursePlanRecord[] = [
    {
      id: 'plan-001',
      trainingCategory: '初阶训练',
      courseName: 'AI 基础素养进阶',
      courseCode: 'AI101',
      targetAudience: '全员',
      credits: 12,
      courseUrl: 'https://example.com/course/AI101',
    },
    {
      id: 'plan-002',
      trainingCategory: '中阶训练',
      courseName: '智能流程重构实战',
      courseCode: 'AI205',
      targetAudience: '干部/基层主管',
      credits: 18,
      courseUrl: 'https://example.com/course/AI205',
    },
    {
      id: 'plan-003',
      trainingCategory: '高阶训练',
      courseName: '多模态模型融合',
      courseCode: 'AI308',
      targetAudience: '专家',
      credits: 20,
      courseUrl: 'https://example.com/course/AI308',
    },
    {
      id: 'plan-004',
      trainingCategory: '实战演练',
      courseName: 'AIGC 客服迭代营',
      courseCode: 'AI402',
      targetAudience: '基层主管/运营骨干',
      credits: 16,
      courseUrl: 'https://example.com/course/AI402',
    },
    {
      id: 'plan-005',
      trainingCategory: '实战演练',
      courseName: '渠道增长数据驾车舱',
      courseCode: 'AI415',
      targetAudience: '营销干部',
      credits: 14,
      courseUrl: 'https://example.com/course/AI415',
    },
  ]

  return {
    records,
    coursePlans,
    filters: {
      departmentTree: deptTree,
      jobFamilies: ['技术类', '管理类', '业务类'],
      jobCategories: ['算法专家', '数据科学家', '运营干部', '营销干部', '基层主管', '产品经理'],
      jobSubCategories: ['CV', 'NLP', '流程优化', '渠道拓展', '服务运营', '智能产品'],
      roles: [
        { label: '全员', value: '0' },
        { label: '干部', value: '1' },
        { label: '专家', value: '2' },
        { label: '基层主管', value: '3' },
      ],
      maturityOptions: [
        { label: '全部', value: '全部' },
        { label: 'L1', value: 'L1' },
        { label: 'L2', value: 'L2' },
        { label: 'L3', value: 'L3' },
      ],
    },
  }
}

export const fetchTrainingDashboard = async (
  filters?: TrainingDashboardFilters
): Promise<TrainingDashboardData> => {
  await delay()
  const departmentTree = await fetchDepartmentTree()
  const role: TrainingRole = (filters?.role ?? '0')

  const personalOverview = [
    {
      classification: '初阶',
      courseTotal: 18,
      targetCompleted: 15,
      actualCompleted: 13,
      completionRate: 68.4,
    },
    {
      classification: '中阶',
      courseTotal: 22,
      targetCompleted: 18,
      actualCompleted: 16,
      completionRate: 72.7,
    },
    {
      classification: '高阶',
      courseTotal: 14,
      targetCompleted: 12,
      actualCompleted: 9,
      completionRate: 64.3,
    },
    {
      classification: '实战',
      courseTotal: 10,
      targetCompleted: 8,
      actualCompleted: 6,
      completionRate: 60,
    },
    {
      classification: '总计',
      courseTotal: 64,
      targetCompleted: 53,
      actualCompleted: 44,
      completionRate: 68.8,
    },
  ]

  const expertSummary: TrainingRoleSummaryRow[] = [
    {
      maturityLevel: 'L1',
      personCount: 48,
      beginnerCourses: 16,
      intermediateCourses: 12,
      advancedCourses: 8,
      practiceCourses: 4,
      beginnerAvgLearners: 32,
      intermediateAvgLearners: 26,
      advancedAvgLearners: 18,
      practiceAvgLearners: 12,
      beginnerCompletionRate: 74.3,
      intermediateCompletionRate: 70.6,
      advancedCompletionRate: 65.2,
      practiceCompletionRate: 58.1,
    },
    {
      maturityLevel: 'L2',
      personCount: 62,
      beginnerCourses: 20,
      intermediateCourses: 16,
      advancedCourses: 12,
      practiceCourses: 6,
      beginnerAvgLearners: 36,
      intermediateAvgLearners: 30,
      advancedAvgLearners: 22,
      practiceAvgLearners: 16,
      beginnerCompletionRate: 78.5,
      intermediateCompletionRate: 73.4,
      advancedCompletionRate: 68.8,
      practiceCompletionRate: 61.9,
    },
    {
      maturityLevel: 'L3',
      personCount: 38,
      beginnerCourses: 12,
      intermediateCourses: 10,
      advancedCourses: 8,
      practiceCourses: 5,
      beginnerAvgLearners: 28,
      intermediateAvgLearners: 24,
      advancedAvgLearners: 18,
      practiceAvgLearners: 14,
      beginnerCompletionRate: 81.2,
      intermediateCompletionRate: 76.1,
      advancedCompletionRate: 72.4,
      practiceCompletionRate: 66.7,
    },
    {
      maturityLevel: '总计',
      personCount: 148,
      beginnerCourses: 48,
      intermediateCourses: 38,
      advancedCourses: 28,
      practiceCourses: 15,
      beginnerAvgLearners: 32,
      intermediateAvgLearners: 27,
      advancedAvgLearners: 19,
      practiceAvgLearners: 14,
      beginnerCompletionRate: 78.4,
      intermediateCompletionRate: 73.1,
      advancedCompletionRate: 68.5,
      practiceCompletionRate: 62.3,
    },
  ]

  const cadreSummary: TrainingRoleSummaryRow[] = [
    {
      maturityLevel: 'L1',
      personCount: 66,
      beginnerCourses: 18,
      intermediateCourses: 14,
      advancedCourses: 9,
      practiceCourses: 5,
      beginnerAvgLearners: 28,
      intermediateAvgLearners: 22,
      advancedAvgLearners: 16,
      practiceAvgLearners: 10,
      beginnerCompletionRate: 70.5,
      intermediateCompletionRate: 65.2,
      advancedCompletionRate: 60.3,
      practiceCompletionRate: 55.8,
    },
    {
      maturityLevel: 'L2',
      personCount: 72,
      beginnerCourses: 20,
      intermediateCourses: 16,
      advancedCourses: 11,
      practiceCourses: 6,
      beginnerAvgLearners: 30,
      intermediateAvgLearners: 24,
      advancedAvgLearners: 18,
      practiceAvgLearners: 12,
      beginnerCompletionRate: 74.8,
      intermediateCompletionRate: 68.6,
      advancedCompletionRate: 62.4,
      practiceCompletionRate: 58.5,
    },
    {
      maturityLevel: 'L3',
      personCount: 44,
      beginnerCourses: 12,
      intermediateCourses: 10,
      advancedCourses: 7,
      practiceCourses: 4,
      beginnerAvgLearners: 26,
      intermediateAvgLearners: 20,
      advancedAvgLearners: 15,
      practiceAvgLearners: 10,
      beginnerCompletionRate: 78.1,
      intermediateCompletionRate: 72.4,
      advancedCompletionRate: 66.8,
      practiceCompletionRate: 60.2,
    },
    {
      maturityLevel: '总计',
      personCount: 182,
      beginnerCourses: 50,
      intermediateCourses: 40,
      advancedCourses: 27,
      practiceCourses: 15,
      beginnerAvgLearners: 29,
      intermediateAvgLearners: 23,
      advancedAvgLearners: 17,
      practiceAvgLearners: 11,
      beginnerCompletionRate: 74.5,
      intermediateCompletionRate: 68.5,
      advancedCompletionRate: 63.1,
      practiceCompletionRate: 58.1,
    },
  ]

  const expertCadreSummary: TrainingExpertCadreSummary = {
    title: '部门维度',
    dimensionLabel: '部门',
    rows: [
      {
        dimension: '总部',
        personCount: 86,
        beginnerCourses: 28,
        intermediateCourses: 22,
        advancedCourses: 16,
        practiceCourses: 9,
        beginnerAvgLearners: 34,
        intermediateAvgLearners: 28,
        advancedAvgLearners: 21,
        practiceAvgLearners: 15,
        beginnerCompletionRate: 79.6,
        intermediateCompletionRate: 74.3,
        advancedCompletionRate: 69.1,
        practiceCompletionRate: 63.4,
      },
      {
        dimension: '华东大区',
        personCount: 74,
        beginnerCourses: 24,
        intermediateCourses: 20,
        advancedCourses: 14,
        practiceCourses: 8,
        beginnerAvgLearners: 31,
        intermediateAvgLearners: 25,
        advancedAvgLearners: 19,
        practiceAvgLearners: 13,
        beginnerCompletionRate: 76.2,
        intermediateCompletionRate: 71.5,
        advancedCompletionRate: 66.8,
        practiceCompletionRate: 60.1,
      },
      {
        dimension: '华南大区',
        personCount: 60,
        beginnerCourses: 22,
        intermediateCourses: 18,
        advancedCourses: 12,
        practiceCourses: 7,
        beginnerAvgLearners: 29,
        intermediateAvgLearners: 24,
        advancedAvgLearners: 18,
        practiceAvgLearners: 12,
        beginnerCompletionRate: 74.8,
        intermediateCompletionRate: 69.2,
        advancedCompletionRate: 64.5,
        practiceCompletionRate: 58.9,
      },
      {
        dimension: '总计',
        personCount: 220,
        beginnerCourses: 74,
        intermediateCourses: 60,
        advancedCourses: 42,
        practiceCourses: 24,
        beginnerAvgLearners: 31,
        intermediateAvgLearners: 26,
        advancedAvgLearners: 20,
        practiceAvgLearners: 14,
        beginnerCompletionRate: 77.2,
        intermediateCompletionRate: 71.7,
        advancedCompletionRate: 66.8,
        practiceCompletionRate: 61.0,
      },
    ],
  }

  const allStaffGroups: TrainingAllStaffSummaryGroup[] = [
    {
      title: '部门维度',
      dimensionLabel: '部门',
      rows: [
        {
          dimension: '总部',
          baseline: 320,
          beginnerCourses: 42,
          intermediateCourses: 34,
          advancedCourses: 26,
          practiceCourses: 16,
          beginnerAvgLearners: 260,
          intermediateAvgLearners: 198,
          advancedAvgLearners: 146,
          practiceAvgLearners: 96,
          beginnerCompletionRate: 72.8,
          intermediateCompletionRate: 68.2,
          advancedCompletionRate: 63.5,
          practiceCompletionRate: 58.4,
        },
        {
          dimension: '华东大区',
          baseline: 286,
          beginnerCourses: 38,
          intermediateCourses: 30,
          advancedCourses: 22,
          practiceCourses: 14,
          beginnerAvgLearners: 234,
          intermediateAvgLearners: 176,
          advancedAvgLearners: 128,
          practiceAvgLearners: 84,
          beginnerCompletionRate: 71.5,
          intermediateCompletionRate: 66.8,
          advancedCompletionRate: 62.1,
          practiceCompletionRate: 57.6,
        },
        {
          dimension: '华南大区',
          baseline: 214,
          beginnerCourses: 32,
          intermediateCourses: 26,
          advancedCourses: 18,
          practiceCourses: 12,
          beginnerAvgLearners: 196,
          intermediateAvgLearners: 150,
          advancedAvgLearners: 108,
          practiceAvgLearners: 72,
          beginnerCompletionRate: 73.2,
          intermediateCompletionRate: 68.4,
          advancedCompletionRate: 63.9,
          practiceCompletionRate: 59.2,
        },
        {
          dimension: '总计',
          baseline: 820,
          beginnerCourses: 112,
          intermediateCourses: 90,
          advancedCourses: 66,
          practiceCourses: 42,
          beginnerAvgLearners: 690,
          intermediateAvgLearners: 524,
          advancedAvgLearners: 382,
          practiceAvgLearners: 252,
          beginnerCompletionRate: 72.7,
          intermediateCompletionRate: 67.8,
          advancedCompletionRate: 63.3,
          practiceCompletionRate: 58.4,
        },
      ],
    },
    {
      title: '组织成熟度维度',
      dimensionLabel: '组织AI成熟度等级',
      rows: [
        {
          dimension: 'L1',
          baseline: 304,
          beginnerCourses: 46,
          intermediateCourses: 34,
          advancedCourses: 22,
          practiceCourses: 14,
          beginnerAvgLearners: 240,
          intermediateAvgLearners: 182,
          advancedAvgLearners: 128,
          practiceAvgLearners: 88,
          beginnerCompletionRate: 70.6,
          intermediateCompletionRate: 65.8,
          advancedCompletionRate: 60.5,
          practiceCompletionRate: 55.3,
        },
        {
          dimension: 'L2',
          baseline: 298,
          beginnerCourses: 40,
          intermediateCourses: 32,
          advancedCourses: 24,
          practiceCourses: 16,
          beginnerAvgLearners: 256,
          intermediateAvgLearners: 198,
          advancedAvgLearners: 144,
          practiceAvgLearners: 98,
          beginnerCompletionRate: 73.4,
          intermediateCompletionRate: 68.6,
          advancedCompletionRate: 64.1,
          practiceCompletionRate: 59.7,
        },
        {
          dimension: 'L3',
          baseline: 186,
          beginnerCourses: 26,
          intermediateCourses: 22,
          advancedCourses: 18,
          practiceCourses: 12,
          beginnerAvgLearners: 194,
          intermediateAvgLearners: 156,
          advancedAvgLearners: 116,
          practiceAvgLearners: 82,
          beginnerCompletionRate: 76.8,
          intermediateCompletionRate: 72.4,
          advancedCompletionRate: 67.9,
          practiceCompletionRate: 63.2,
        },
        {
          dimension: '总计',
          baseline: 788,
          beginnerCourses: 112,
          intermediateCourses: 88,
          advancedCourses: 64,
          practiceCourses: 42,
          beginnerAvgLearners: 690,
          intermediateAvgLearners: 536,
          advancedAvgLearners: 388,
          practiceAvgLearners: 268,
          beginnerCompletionRate: 73.6,
          intermediateCompletionRate: 68.9,
          advancedCompletionRate: 64.2,
          practiceCompletionRate: 59.3,
        },
      ],
    },
    {
      title: '职位维度',
      dimensionLabel: '职位',
      rows: [
        {
          dimension: '产品经理',
          baseline: 186,
          beginnerCourses: 34,
          intermediateCourses: 26,
          advancedCourses: 18,
          practiceCourses: 10,
          beginnerAvgLearners: 158,
          intermediateAvgLearners: 120,
          advancedAvgLearners: 84,
          practiceAvgLearners: 52,
          beginnerCompletionRate: 71.3,
          intermediateCompletionRate: 66.4,
          advancedCompletionRate: 61.2,
          practiceCompletionRate: 56.8,
        },
        {
          dimension: '算法工程师',
          baseline: 228,
          beginnerCourses: 40,
          intermediateCourses: 32,
          advancedCourses: 24,
          practiceCourses: 14,
          beginnerAvgLearners: 194,
          intermediateAvgLearners: 150,
          advancedAvgLearners: 112,
          practiceAvgLearners: 74,
          beginnerCompletionRate: 74.8,
          intermediateCompletionRate: 70.2,
          advancedCompletionRate: 66.1,
          practiceCompletionRate: 61.7,
        },
        {
          dimension: '运营主管',
          baseline: 168,
          beginnerCourses: 28,
          intermediateCourses: 22,
          advancedCourses: 16,
          practiceCourses: 10,
          beginnerAvgLearners: 148,
          intermediateAvgLearners: 112,
          advancedAvgLearners: 78,
          practiceAvgLearners: 54,
          beginnerCompletionRate: 72.8,
          intermediateCompletionRate: 68.1,
          advancedCompletionRate: 63.7,
          practiceCompletionRate: 58.3,
        },
        {
          dimension: '总计',
          baseline: 582,
          beginnerCourses: 102,
          intermediateCourses: 80,
          advancedCourses: 58,
          practiceCourses: 34,
          beginnerAvgLearners: 500,
          intermediateAvgLearners: 382,
          advancedAvgLearners: 274,
          practiceAvgLearners: 180,
          beginnerCompletionRate: 73.1,
          intermediateCompletionRate: 68.2,
          advancedCompletionRate: 63.7,
          practiceCompletionRate: 59.0,
        },
      ],
    },
  ]

  const planningResources: TrainingPlanningResource[] = [
    {
      id: 'plan-2025-q2',
      title: '2025 Q2 训战课程规划',
      owner: 'AI 训战中心',
      updatedAt: '2025-05-20',
      downloadUrl: 'https://example.com/docs/training-plan-2025-q2.xlsx',
      description: '覆盖专家、干部、基层主管季度训战目标与资源配置。',
    },
    {
      id: 'plan-benchmark',
      title: '重点岗位训战方案',
      owner: '人力发展部',
      updatedAt: '2025-05-16',
      downloadUrl: 'https://example.com/docs/training-plan-benchmark.pdf',
      description: '聚焦TOP10关键岗位的深度训战路径与评估方式。',
    },
    {
      id: 'plan-practice',
      title: '实战演练日历',
      owner: 'AI 运营学院',
      updatedAt: '2025-05-12',
      downloadUrl: 'https://example.com/docs/training-practice-calendar.xlsx',
      description: '列出全员实战演练排期与联合评估标准。',
    },
  ]

  return {
    personalOverview,
    expertSummary,
    cadreSummary,
    expertCadreSummary,
    allStaffSummary: {
      role,
      groups: allStaffGroups,
    },
    planningResources,
    filters: {
      departmentTree,
      roles: [
        { label: '全员', value: '0' },
        { label: '干部', value: '1' },
        { label: '专家', value: '2' },
        { label: '基层主管', value: '3' },
      ],
    },
  }
}

export const fetchDepartmentTree = async (): Promise<DepartmentNode[]> => {
  await delay()
  return [
    {
      label: '总部',
      value: 'dept-1',
      children: [
        {
          label: '数字化部',
          value: 'dept-1-1',
          children: [
            {
              label: 'AI 运营中心',
              value: 'dept-1-1-1',
              children: [
                {
                  label: '业务赋能组',
                  value: 'dept-1-1-1-1',
                  children: [
                    {
                      label: '区域一组',
                      value: 'dept-1-1-1-1-1',
                      children: [
                        { label: 'A 区域', value: 'dept-1-1-1-1-1-1' },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    {
      label: '华东大区',
      value: 'dept-2',
      children: [
        {
          label: '上海分部',
          value: 'dept-2-1',
          children: [
            {
              label: 'AI 实施中心',
              value: 'dept-2-1-1',
              children: [
                { label: '第一项目组', value: 'dept-2-1-1-1' },
                { label: '第二项目组', value: 'dept-2-1-1-2' },
              ],
            },
          ],
        },
      ],
    },
  ]
}

export const fetchExpertCertificationSummary = async (): Promise<{
  certification: ExpertCertificationSummaryRow[]
  appointment: ExpertAppointmentSummaryRow[]
}> => {
  await delay()
  return {
    certification: [
      {
        maturityLevel: 'L1',
        jobCategory: 'AI 架构师',
        baseline: 26,
        certified: 18,
        certificationRate: 0.69,
      },
      {
        maturityLevel: 'L2',
        jobCategory: '数据科学家',
        baseline: 34,
        certified: 28,
        certificationRate: 0.82,
      },
      {
        maturityLevel: 'L3',
        jobCategory: '算法专家',
        baseline: 18,
        certified: 16,
        certificationRate: 0.89,
      },
    ],
    appointment: [
      {
        maturityLevel: 'L1',
        jobCategory: 'AI 架构师',
        baseline: 26,
        appointed: 14,
        appointedByRequirement: 12,
        appointmentRate: 0.54,
        certificationCompliance: 0.86,
      },
      {
        maturityLevel: 'L2',
        jobCategory: '数据科学家',
        baseline: 34,
        appointed: 26,
        appointedByRequirement: 24,
        appointmentRate: 0.76,
        certificationCompliance: 0.92,
      },
      {
        maturityLevel: 'L3',
        jobCategory: '算法专家',
        baseline: 18,
        appointed: 15,
        appointedByRequirement: 15,
        appointmentRate: 0.83,
        certificationCompliance: 1,
      },
    ],
  }
}

export const fetchCadreCertificationSummary = async (): Promise<{
  certification: CadreCertificationSummaryRow[]
  appointment: CadreAppointmentSummaryRow[]
}> => {
  await delay()
  return {
    certification: [
      {
        maturityLevel: 'L1',
        jobCategory: '营销干部',
        baseline: 48,
        aiCertificateHolders: 30,
        subjectTwoPassed: 22,
        certificateRate: 0.63,
        subjectTwoRate: 0.46,
        complianceRate: 0.58,
      },
      {
        maturityLevel: 'L2',
        jobCategory: '运营干部',
        baseline: 52,
        aiCertificateHolders: 40,
        subjectTwoPassed: 35,
        certificateRate: 0.77,
        subjectTwoRate: 0.67,
        complianceRate: 0.71,
      },
      {
        maturityLevel: 'L3',
        jobCategory: '客服干部',
        baseline: 32,
        aiCertificateHolders: 29,
        subjectTwoPassed: 27,
        certificateRate: 0.91,
        subjectTwoRate: 0.84,
        complianceRate: 0.88,
      },
    ],
    appointment: [
      {
        maturityLevel: 'L1',
        jobCategory: '营销干部',
        baseline: 48,
        appointed: 28,
        appointedByRequirement: 24,
        appointmentRate: 0.58,
        certificationCompliance: 0.86,
      },
      {
        maturityLevel: 'L2',
        jobCategory: '运营干部',
        baseline: 52,
        appointed: 39,
        appointedByRequirement: 32,
        appointmentRate: 0.75,
        certificationCompliance: 0.82,
      },
      {
        maturityLevel: 'L3',
        jobCategory: '客服干部',
        baseline: 32,
        appointed: 26,
        appointedByRequirement: 23,
        appointmentRate: 0.81,
        certificationCompliance: 0.88,
      },
    ],
  }
}

export const fetchOverallCertificationTrends = async (): Promise<{
  departmentAppointment: StaffChartPoint[]
  organizationAppointment: StaffChartPoint[]
  jobCategoryAppointment: StaffChartPoint[]
  departmentCertification: StaffChartPoint[]
  organizationCertification: StaffChartPoint[]
  jobCategoryCertification: StaffChartPoint[]
}> => {
  await delay()
  return {
    departmentAppointment: [
      { label: '总部', count: 120, rate: 62 },
      { label: '华东大区', count: 86, rate: 66 },
      { label: '华南大区', count: 64, rate: 58 },
    ],
    organizationAppointment: [
      { label: 'L1', count: 64, rate: 48 },
      { label: 'L2', count: 92, rate: 66 },
      { label: 'L3', count: 50, rate: 78 },
    ],
    jobCategoryAppointment: [
      { label: 'AI 架构', count: 54, rate: 73 },
      { label: '算法优化', count: 70, rate: 69 },
      { label: '数据治理', count: 48, rate: 65 },
    ],
    departmentCertification: [
      { label: '总部', count: 118, rate: 61 },
      { label: '华东大区', count: 94, rate: 72 },
      { label: '华南大区', count: 68, rate: 62 },
    ],
    organizationCertification: [
      { label: 'L1', count: 58, rate: 43 },
      { label: 'L2', count: 88, rate: 63 },
      { label: 'L3', count: 56, rate: 84 },
    ],
    jobCategoryCertification: [
      { label: 'AI 架构', count: 60, rate: 81 },
      { label: '算法优化', count: 76, rate: 75 },
      { label: '数据治理', count: 52, rate: 71 },
    ],
  }
}

export const fetchCertificationAuditRecords = async (): Promise<{
  certificateAudits: CertificationAuditRecord[]
  appointmentAudits: AppointmentAuditRecord[]
}> => {
  await delay()
  return {
    certificateAudits: [
      {
        id: 'ca-001',
        name: '李莉',
        employeeId: 'E1024',
        positionCategory: '算法专家',
        positionSubCategory: 'CV',
        departmentLevel1: '总部',
        departmentLevel2: '数字化部',
        departmentLevel3: 'AI 运营中心',
        departmentLevel4: '业务赋能组',
        departmentLevel5: '区域一组',
        departmentLevel6: 'A 区域',
        minDepartment: 'AI 赋能站 A1',
        certificateName: 'AI 专家认证',
        certificateEffectiveDate: '2024-12-01',
        subjectTwoPassed: true,
        isCadre: false,
        cadreType: undefined,
        isExpert: true,
        isFrontlineManager: false,
        organizationMaturity: 'L3',
        positionMaturity: 'L3',
        requiredCertificate: '专家认证',
        isQualified: true,
      },
      {
        id: 'ca-002',
        name: '王凯',
        employeeId: 'E1056',
        positionCategory: '运营干部',
        positionSubCategory: '流程优化',
        departmentLevel1: '华东大区',
        departmentLevel2: '上海分部',
        departmentLevel3: 'AI 实施中心',
        departmentLevel4: '第一项目组',
        departmentLevel5: '实施一队',
        departmentLevel6: '东区',
        minDepartment: '实施一队 A 组',
        certificateName: 'AI 干部证书',
        certificateEffectiveDate: '2025-01-12',
        subjectTwoPassed: true,
        isCadre: true,
        cadreType: '管理干部',
        isExpert: false,
        isFrontlineManager: true,
        organizationMaturity: 'L2',
        positionMaturity: 'L2',
        requiredCertificate: '专业级',
        isQualified: true,
      },
      {
        id: 'ca-003',
        name: '赵敏',
        employeeId: 'E1066',
        positionCategory: '营销干部',
        positionSubCategory: '渠道拓展',
        departmentLevel1: '华东大区',
        departmentLevel2: '杭州分部',
        departmentLevel3: 'AI 体验中心',
        departmentLevel4: '渠道二部',
        departmentLevel5: '拓展组',
        departmentLevel6: '南区',
        minDepartment: '拓展组 B',
        certificateName: 'AI 任职证书',
        certificateEffectiveDate: '2025-03-21',
        subjectTwoPassed: false,
        isCadre: true,
        cadreType: '业务干部',
        isExpert: false,
        isFrontlineManager: true,
        organizationMaturity: 'L1',
        positionMaturity: 'L1',
        requiredCertificate: '专业级',
        isQualified: false,
      },
    ],
    appointmentAudits: [
      {
        id: 'aa-001',
        name: '李莉',
        employeeId: 'E1024',
        positionCategory: '算法专家',
        positionSubCategory: 'CV',
        departmentLevel1: '总部',
        departmentLevel2: '数字化部',
        departmentLevel3: 'AI 运营中心',
        departmentLevel4: '业务赋能组',
        departmentLevel5: '区域一组',
        departmentLevel6: 'A 区域',
        minDepartment: 'AI 赋能站 A1',
        professionalCategory: '专家认证',
        expertCategory: 'AI',
        professionalSubCategory: '图像识别',
        qualificationDirection: '智能质检',
        qualificationLevel: '高级',
        acquisitionMethod: '考试',
        effectiveDate: '2024-12-01',
        expiryDate: '2026-12-01',
        isCadre: false,
        cadreType: undefined,
        isExpert: true,
        isFrontlineManager: false,
        organizationMaturity: 'L3',
        positionMaturity: 'L3',
        requiredCertificate: '专家认证',
        isQualified: true,
      },
      {
        id: 'aa-002',
        name: '王凯',
        employeeId: 'E1056',
        positionCategory: '运营干部',
        positionSubCategory: '流程优化',
        departmentLevel1: '华东大区',
        departmentLevel2: '上海分部',
        departmentLevel3: 'AI 实施中心',
        departmentLevel4: '第一项目组',
        departmentLevel5: '实施一队',
        departmentLevel6: '东区',
        minDepartment: '实施一队 A 组',
        professionalCategory: '专业任职',
        expertCategory: 'AI 管理',
        professionalSubCategory: '流程治理',
        qualificationDirection: '流程重构',
        qualificationLevel: '中级',
        acquisitionMethod: '评审',
        effectiveDate: '2025-01-10',
        expiryDate: '2027-01-10',
        isCadre: true,
        cadreType: '管理干部',
        isExpert: false,
        isFrontlineManager: true,
        organizationMaturity: 'L2',
        positionMaturity: 'L2',
        requiredCertificate: '专业级',
        isQualified: true,
      },
      {
        id: 'aa-003',
        name: '赵敏',
        employeeId: 'E1066',
        positionCategory: '营销干部',
        positionSubCategory: '渠道拓展',
        departmentLevel1: '华东大区',
        departmentLevel2: '杭州分部',
        departmentLevel3: 'AI 体验中心',
        departmentLevel4: '渠道二部',
        departmentLevel5: '拓展组',
        departmentLevel6: '南区',
        minDepartment: '拓展组 B',
        professionalCategory: '专业任职',
        expertCategory: 'AI 渠道',
        professionalSubCategory: '渠道经营',
        qualificationDirection: '渠道数字化',
        qualificationLevel: '中级',
        acquisitionMethod: '考试',
        effectiveDate: '2024-11-10',
        expiryDate: '2026-11-10',
        isCadre: true,
        cadreType: '业务干部',
        isExpert: false,
        isFrontlineManager: true,
        organizationMaturity: 'L1',
        positionMaturity: 'L1',
        requiredCertificate: '专业级',
        isQualified: false,
      },
    ],
  }
}

export const fetchSchoolDashboard = async (
  _filters?: SchoolDashboardFilters
): Promise<SchoolDashboardData> => {
  await delay()
  const [deptTree] = await Promise.all([fetchDepartmentTree()])

  return {
    personalOverview: {
      targetCredits: 120,
      currentCredits: 85,
      completionRate: 70.8,
      benchmarkRate: 75.2,
      scheduleTarget: 90,
      expectedCompletionDate: '2025-08-15',
      status: '轻度预警',
      statusType: 'warning',
    },
    expertSummary: [
      {
        maturityLevel: 'L1',
        baseline: 26,
        maxCredits: 95,
        minCredits: 32,
        averageCredits: 68.5,
        targetCredits: 100,
        completionRate: 68.5,
        scheduleTarget: 75,
        status: '正常',
        statusType: 'success',
      },
      {
        maturityLevel: 'L2',
        baseline: 34,
        maxCredits: 112,
        minCredits: 45,
        averageCredits: 82.3,
        targetCredits: 120,
        completionRate: 68.6,
        scheduleTarget: 90,
        status: '正常',
        statusType: 'success',
      },
      {
        maturityLevel: 'L3',
        baseline: 18,
        maxCredits: 128,
        minCredits: 58,
        averageCredits: 95.6,
        targetCredits: 140,
        completionRate: 68.3,
        scheduleTarget: 105,
        status: '正常',
        statusType: 'success',
      },
      {
        maturityLevel: '总计',
        baseline: 78,
        maxCredits: 128,
        minCredits: 32,
        averageCredits: 82.1,
        targetCredits: 120,
        completionRate: 68.4,
        scheduleTarget: 90,
        status: '正常',
        statusType: 'success',
      },
    ],
    cadreSummary: [
      {
        maturityLevel: 'L1',
        baseline: 48,
        maxCredits: 88,
        minCredits: 28,
        averageCredits: 58.2,
        targetCredits: 90,
        completionRate: 64.7,
        scheduleTarget: 67.5,
        status: '正常',
        statusType: 'success',
      },
      {
        maturityLevel: 'L2',
        baseline: 52,
        maxCredits: 102,
        minCredits: 35,
        averageCredits: 72.8,
        targetCredits: 110,
        completionRate: 66.2,
        scheduleTarget: 82.5,
        status: '正常',
        statusType: 'success',
      },
      {
        maturityLevel: 'L3',
        baseline: 32,
        maxCredits: 118,
        minCredits: 48,
        averageCredits: 88.5,
        targetCredits: 130,
        completionRate: 68.1,
        scheduleTarget: 97.5,
        status: '正常',
        statusType: 'success',
      },
      {
        maturityLevel: '总计',
        baseline: 132,
        maxCredits: 118,
        minCredits: 28,
        averageCredits: 73.2,
        targetCredits: 110,
        completionRate: 66.5,
        scheduleTarget: 82.5,
        status: '正常',
        statusType: 'success',
      },
    ],
    allStaffSummary: {
      role: '0',
      groups: [
        {
          title: '部门维度',
          dimensionLabel: '部门',
          rows: [
            {
              dimension: '总部',
              baseline: 156,
              maxCredits: 128,
              minCredits: 25,
              averageCredits: 76.5,
              targetCredits: 120,
              completionRate: 63.8,
              scheduleTarget: 90,
              status: '正常',
              statusType: 'success',
            },
            {
              dimension: '华东大区',
              baseline: 142,
              maxCredits: 115,
              minCredits: 28,
              averageCredits: 72.3,
              targetCredits: 115,
              completionRate: 62.9,
              scheduleTarget: 86.25,
              status: '正常',
              statusType: 'success',
            },
            {
              dimension: '华南大区',
              baseline: 98,
              maxCredits: 108,
              minCredits: 22,
              averageCredits: 68.8,
              targetCredits: 105,
              completionRate: 65.5,
              scheduleTarget: 78.75,
              status: '正常',
              statusType: 'success',
            },
            {
              dimension: '总计',
              baseline: 396,
              maxCredits: 128,
              minCredits: 22,
              averageCredits: 72.5,
              targetCredits: 113.3,
              completionRate: 64.1,
              scheduleTarget: 85,
              status: '正常',
              statusType: 'success',
            },
          ],
        },
        {
          title: '组织成熟度维度',
          dimensionLabel: '组织AI成熟度等级',
          rows: [
            {
              dimension: 'L1',
              baseline: 128,
              maxCredits: 95,
              minCredits: 25,
              averageCredits: 58.2,
              targetCredits: 90,
              completionRate: 64.7,
              scheduleTarget: 67.5,
              status: '正常',
              statusType: 'success',
            },
            {
              dimension: 'L2',
              baseline: 186,
              maxCredits: 112,
              minCredits: 28,
              averageCredits: 75.8,
              targetCredits: 115,
              completionRate: 65.9,
              scheduleTarget: 86.25,
              status: '正常',
              statusType: 'success',
            },
            {
              dimension: 'L3',
              baseline: 82,
              maxCredits: 128,
              minCredits: 35,
              averageCredits: 92.3,
              targetCredits: 130,
              completionRate: 71.0,
              scheduleTarget: 97.5,
              status: '正常',
              statusType: 'success',
            },
            {
              dimension: '总计',
              baseline: 396,
              maxCredits: 128,
              minCredits: 25,
              averageCredits: 75.4,
              targetCredits: 111.7,
              completionRate: 67.5,
              scheduleTarget: 83.75,
              status: '正常',
              statusType: 'success',
            },
          ],
        },
        {
          title: '职位维度',
          dimensionLabel: '职位',
          rows: [
            {
              dimension: 'AI 架构师',
              baseline: 68,
              maxCredits: 118,
              minCredits: 35,
              averageCredits: 82.5,
              targetCredits: 125,
              completionRate: 66.0,
              scheduleTarget: 93.75,
              status: '正常',
              statusType: 'success',
            },
            {
              dimension: '数据科学家',
              baseline: 84,
              maxCredits: 112,
              minCredits: 28,
              averageCredits: 75.2,
              targetCredits: 120,
              completionRate: 62.7,
              scheduleTarget: 90,
              status: '正常',
              statusType: 'success',
            },
            {
              dimension: '算法专家',
              baseline: 52,
              maxCredits: 128,
              minCredits: 42,
              averageCredits: 88.6,
              targetCredits: 135,
              completionRate: 65.6,
              scheduleTarget: 101.25,
              status: '正常',
              statusType: 'success',
            },
            {
              dimension: '总计',
              baseline: 204,
              maxCredits: 128,
              minCredits: 28,
              averageCredits: 82.1,
              targetCredits: 126.7,
              completionRate: 64.8,
              scheduleTarget: 95,
              status: '正常',
              statusType: 'success',
            },
          ],
        },
      ],
    },
    filters: {
      departmentTree: deptTree,
      roles: [
        { label: '全员', value: '0' },
        { label: '干部', value: '1' },
        { label: '专家', value: '2' },
        { label: '基层主管', value: '3' },
      ],
    },
  }
}

/**
 * 根据部门ID查询子部门列表
 * @param deptId 部门ID（部门编码），为空或"0"时查询一级部门
 * @returns 子部门列表
 */
const departmentChildrenCache = new Map<string, DepartmentInfoVO[]>()
const departmentChildrenPromises = new Map<string, Promise<DepartmentInfoVO[]>>()

export const fetchDepartmentChildren = (
  deptId: string | number = '0',
  options?: { force?: boolean }
): Promise<DepartmentInfoVO[]> => {
  const cacheKey = String(deptId)
  if (!options?.force) {
    if (departmentChildrenCache.has(cacheKey)) {
      return Promise.resolve(departmentChildrenCache.get(cacheKey)!)
    }
    if (departmentChildrenPromises.has(cacheKey)) {
      return departmentChildrenPromises.get(cacheKey)!
    }
  }

  const requestPromise = (async () => {
    try {
      const response = await get<Result<DepartmentInfoVO[]>>(
        `/ai_transform/webapi/department-info/children?deptId=${deptId}`
      )
      if (response.code === 200 && response.data) {
        departmentChildrenCache.set(cacheKey, response.data)
        return response.data
      }
      throw new Error(response.message || '查询部门数据失败')
    } catch (error) {
      console.error('获取部门子节点失败:', error)
      throw error
    } finally {
      departmentChildrenPromises.delete(cacheKey)
    }
  })()

  departmentChildrenPromises.set(cacheKey, requestPromise)
  return requestPromise
}

export const fetchSchoolDetailData = async (
  _id: string,
  _filters?: SchoolDetailFilters
): Promise<SchoolDetailData> => {
  await delay()
  const [deptTree] = await Promise.all([fetchDepartmentTree()])

  return {
    records: [
      {
        id: 'sc-001',
        name: '李莉',
        employeeId: 'E1024',
        jobFamily: '技术类',
        jobCategory: '算法专家',
        jobSubCategory: 'CV',
        departmentPath: ['总部', '数字化部', 'AI 运营中心', '业务赋能组', '区域一组', 'A 区域'],
        departmentLevel1: '总部',
        departmentLevel2: '数字化部',
        departmentLevel3: 'AI 运营中心',
        departmentLevel4: '业务赋能组',
        departmentLevel5: '区域一组',
        departmentLevel6: 'A 区域',
        minDepartment: 'AI 赋能站 A1',
        isCadre: false,
        isExpert: true,
        isFrontlineManager: false,
        organizationMaturity: 'L3',
        positionMaturity: 'L3',
        currentCredits: 128,
        completionRate: 91.4,
        benchmarkRate: 88.5,
        completionDate: '2025-07-20',
        scheduleTarget: 105,
        status: '正常',
        statusType: 'success',
      },
      {
        id: 'sc-002',
        name: '王凯',
        employeeId: 'E1056',
        jobFamily: '管理类',
        jobCategory: '运营干部',
        jobSubCategory: '流程优化',
        departmentPath: ['华东大区', '上海分部', 'AI 实施中心', '第一项目组', '实施一队', '东区'],
        departmentLevel1: '华东大区',
        departmentLevel2: '上海分部',
        departmentLevel3: 'AI 实施中心',
        departmentLevel4: '第一项目组',
        departmentLevel5: '实施一队',
        departmentLevel6: '东区',
        minDepartment: '实施一队 A 组',
        isCadre: true,
        cadreType: '管理干部',
        isExpert: false,
        isFrontlineManager: true,
        organizationMaturity: 'L2',
        positionMaturity: 'L2',
        currentCredits: 88,
        completionRate: 80.0,
        benchmarkRate: 75.2,
        completionDate: '2025-08-10',
        scheduleTarget: 82.5,
        status: '正常',
        statusType: 'success',
      },
      {
        id: 'sc-003',
        name: '赵敏',
        employeeId: 'E1066',
        jobFamily: '业务类',
        jobCategory: '营销干部',
        jobSubCategory: '渠道拓展',
        departmentPath: ['华东大区', '杭州分部', 'AI 体验中心', '渠道二部', '拓展组', '南区'],
        departmentLevel1: '华东大区',
        departmentLevel2: '杭州分部',
        departmentLevel3: 'AI 体验中心',
        departmentLevel4: '渠道二部',
        departmentLevel5: '拓展组',
        departmentLevel6: '南区',
        minDepartment: '拓展组 B',
        isCadre: true,
        cadreType: '业务干部',
        isExpert: false,
        isFrontlineManager: true,
        organizationMaturity: 'L1',
        positionMaturity: 'L1',
        currentCredits: 52,
        completionRate: 57.8,
        benchmarkRate: 62.5,
        completionDate: '2025-09-25',
        scheduleTarget: 67.5,
        status: '轻度预警',
        statusType: 'warning',
      },
    ],
    rules: [
      {
        id: 'rule-001',
        sourceType: '课程学习',
        content: 'AI 赋能基础课程',
        credits: 20,
      },
      {
        id: 'rule-002',
        sourceType: '课程学习',
        content: '大模型提示词设计实践',
        credits: 25,
      },
      {
        id: 'rule-003',
        sourceType: '训练任务',
        content: '文本分类模型 V2',
        credits: 30,
      },
      {
        id: 'rule-004',
        sourceType: '认证考试',
        content: 'AI 业务专家认证',
        credits: 35,
      },
      {
        id: 'rule-005',
        sourceType: '项目实践',
        content: '智能推荐系统优化',
        credits: 40,
      },
    ],
    filters: {
      departmentTree: deptTree,
      jobFamilies: ['技术类', '管理类', '业务类'],
      jobCategories: ['AI 架构师', '数据科学家', '算法专家', '营销干部', '运营干部', '客服干部'],
      jobSubCategories: ['CV', 'NLP', '流程优化', '渠道拓展'],
      roles: [
        { label: '全员', value: '0' },
        { label: '干部', value: '1' },
        { label: '专家', value: '2' },
        { label: '基层主管', value: '3' },
      ],
      maturityOptions: [
        { label: '全部', value: '全部' },
        { label: 'L1', value: 'L1' },
        { label: 'L2', value: 'L2' },
        { label: 'L3', value: 'L3' },
      ],
    },
  }
}

