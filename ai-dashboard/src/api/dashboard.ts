import type {
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
  DepartmentNode,
  ExpertAppointmentSummaryRow,
  ExpertCertificationSummaryRow,
  MetricItem,
  StaffChartPoint,
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

export const fetchCertificationDashboard = async (
  _filters?: CertificationDashboardFilters
): Promise<CertificationDashboardData> => {
  await delay()
  const [expertData, cadreData, allStaffData, deptTree] = await Promise.all([
    fetchExpertCertificationSummary(),
    fetchCadreCertificationSummary(),
    fetchOverallCertificationTrends(),
    fetchDepartmentTree(),
  ])

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
      departmentAppointment: allStaffData.departmentAppointment,
      organizationAppointment: allStaffData.organizationAppointment,
      jobCategoryAppointment: allStaffData.jobCategoryAppointment,
      departmentCertification: allStaffData.departmentCertification,
      organizationCertification: allStaffData.organizationCertification,
      jobCategoryCertification: allStaffData.jobCategoryCertification,
    },
    filters: {
      departmentTree: deptTree,
      roles: [
        { label: '全员', value: '全员' },
        { label: '干部', value: '干部' },
        { label: '专家', value: '专家' },
        { label: '基层主管', value: '基层主管' },
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
        { label: '全员', value: '全员' },
        { label: '干部', value: '干部' },
        { label: '专家', value: '专家' },
        { label: '基层主管', value: '基层主管' },
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

export const fetchTrainingDetail = async (id: string): Promise<TrainingTask | undefined> => {
  const list = await fetchTrainingTasks()
  return list.find((item) => item.id === id)
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

