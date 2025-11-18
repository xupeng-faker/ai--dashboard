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

  const resolveQualifiedCount = (item: DepartmentCertStatistic) =>
    item.qualifiedCount ?? item.certifiedCount ?? 0
  const resolveQualifiedRate = (item: DepartmentCertStatistic) =>
    Number(item.qualifiedRate ?? item.certRate ?? 0)

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
      count: resolveQualifiedCount(item),
      rate: resolveQualifiedRate(item),
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
  return []
}

export const fetchMaturityTrend = async (): Promise<TrendPoint[]> => {
  return []
}

export const fetchTrainingTasks = async (): Promise<TrainingTask[]> => {
  return []
}

export const fetchCourses = async (): Promise<CourseItem[]> => {
  return []
}

export const fetchCertifications = async (): Promise<CertificationItem[]> => {
  return []
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
    metrics: [],
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
      name: '',
      level: '',
      participants: 0,
      passRate: 0,
      status: '',
      updatedAt: '',
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

  const records: TrainingBattleRecord[] = []

  const coursePlans: TrainingCoursePlanRecord[] = []

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

  const personalOverview: any[] = []

  const expertSummary: TrainingRoleSummaryRow[] = []

  const cadreSummary: TrainingRoleSummaryRow[] = []

  const expertCadreSummary: TrainingExpertCadreSummary = {
    title: '',
    dimensionLabel: '',
    rows: [],
  }

  const allStaffGroups: TrainingAllStaffSummaryGroup[] = []

  const planningResources: TrainingPlanningResource[] = []

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
  return []
}

export const fetchExpertCertificationSummary = async (): Promise<{
  certification: ExpertCertificationSummaryRow[]
  appointment: ExpertAppointmentSummaryRow[]
}> => {
  return {
    certification: [],
    appointment: [],
  }
}

export const fetchCadreCertificationSummary = async (): Promise<{
  certification: CadreCertificationSummaryRow[]
  appointment: CadreAppointmentSummaryRow[]
}> => {
  return {
    certification: [],
    appointment: [],
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
  return {
    departmentAppointment: [],
    organizationAppointment: [],
    jobCategoryAppointment: [],
    departmentCertification: [],
    organizationCertification: [],
    jobCategoryCertification: [],
  }
}

export const fetchCertificationAuditRecords = async (): Promise<{
  certificateAudits: CertificationAuditRecord[]
  appointmentAudits: AppointmentAuditRecord[]
}> => {
  return {
    certificateAudits: [],
    appointmentAudits: [],
  }
}

export const fetchSchoolDashboard = async (
  _filters?: SchoolDashboardFilters
): Promise<SchoolDashboardData> => {
  await delay()
  const [deptTree] = await Promise.all([fetchDepartmentTree()])

  return {
    personalOverview: {
      targetCredits: 0,
      currentCredits: 0,
      completionRate: 0,
      benchmarkRate: 0,
      scheduleTarget: 0,
      expectedCompletionDate: '',
      status: '',
      statusType: 'success',
    },
    expertSummary: [],
    cadreSummary: [],
    allStaffSummary: {
      role: '0',
      groups: [],
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

export const fetchSchoolDetailData = async (
  _id: string,
  _filters?: SchoolDetailFilters
): Promise<SchoolDetailData> => {
  await delay()
  const [deptTree] = await Promise.all([fetchDepartmentTree()])

  return {
    records: [],
    rules: [],
    filters: {
      departmentTree: deptTree,
      jobFamilies: [],
      jobCategories: [],
      jobSubCategories: [],
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
