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

export interface DepartmentNode {
  label: string
  value: string
  children?: DepartmentNode[]
}

export interface ExpertCertificationSummaryRow {
  maturityLevel: string
  jobCategory: string
  baseline: number
  certified: number
  certificationRate: number
}

export interface ExpertAppointmentSummaryRow {
  maturityLevel: string
  jobCategory: string
  baseline: number
  appointed: number
  appointedByRequirement: number
  appointmentRate: number
  certificationCompliance: number
}

export interface CadreCertificationSummaryRow {
  maturityLevel: string
  jobCategory: string
  baseline: number
  aiCertificateHolders: number
  subjectTwoPassed: number
  certificateRate: number
  subjectTwoRate: number
  complianceRate: number
}

export interface CadreAppointmentSummaryRow {
  maturityLevel: string
  jobCategory: string
  baseline: number
  appointed: number
  appointedByRequirement: number
  appointmentRate: number
  certificationCompliance: number
}

export type CertificationRole = '全员' | '干部' | '专家' | '基层主管'

export interface OverallCertificationTrendRow {
  role: CertificationRole
  dimension: string
  category: string
  appointed: number
  appointedRate: number
  certified: number
  certifiedRate: number
}

export interface CertificationAuditRecord {
  id: string
  name: string
  employeeId: string
  positionCategory: string
  positionSubCategory: string
  departmentLevel1: string
  departmentLevel2: string
  departmentLevel3: string
  departmentLevel4: string
  departmentLevel5: string
  departmentLevel6: string
  minDepartment: string
  certificateName: string
  certificateEffectiveDate: string
  subjectTwoPassed: boolean
  isCadre: boolean
  cadreType?: string
  isExpert: boolean
  isFrontlineManager: boolean
  organizationMaturity: 'L1' | 'L2' | 'L3'
  positionMaturity: 'L1' | 'L2' | 'L3'
  requiredCertificate: string
  isQualified: boolean
}

export interface AppointmentAuditRecord {
  id: string
  name: string
  employeeId: string
  positionCategory: string
  positionSubCategory: string
  departmentLevel1: string
  departmentLevel2: string
  departmentLevel3: string
  departmentLevel4: string
  departmentLevel5: string
  departmentLevel6: string
  minDepartment: string
  professionalCategory: string
  expertCategory: string
  professionalSubCategory: string
  qualificationDirection: string
  qualificationLevel: string
  acquisitionMethod: string
  effectiveDate: string
  expiryDate: string
  isCadre: boolean
  cadreType?: string
  isExpert: boolean
  isFrontlineManager: boolean
  organizationMaturity: 'L1' | 'L2' | 'L3'
  positionMaturity: 'L1' | 'L2' | 'L3'
  requiredCertificate: string
  isQualified: boolean
}

export interface StaffChartPoint {
  label: string
  count: number
  rate: number
}

export interface SelectOption<T extends string> {
  label: string
  value: T
}

export interface CertificationDashboardFilters {
  departmentPath?: string[]
  role?: CertificationRole
  maturity?: '全部' | 'L1' | 'L2' | 'L3'
}

export interface CertificationDashboardData {
  metrics: MetricItem[]
  expertCertification: ExpertCertificationSummaryRow[]
  expertAppointment: ExpertAppointmentSummaryRow[]
  cadreCertification: CadreCertificationSummaryRow[]
  cadreAppointment: CadreAppointmentSummaryRow[]
  allStaff: {
    departmentAppointment: StaffChartPoint[]
    organizationAppointment: StaffChartPoint[]
    jobCategoryAppointment: StaffChartPoint[]
    departmentCertification: StaffChartPoint[]
    organizationCertification: StaffChartPoint[]
    jobCategoryCertification: StaffChartPoint[]
  }
  filters: {
    departmentTree: DepartmentNode[]
    roles: SelectOption<CertificationRole>[]
    maturityOptions: SelectOption<'全部' | 'L1' | 'L2' | 'L3'>[]
  }
}

export interface CertificationDetailFilters {
  departmentPath?: string[]
  jobFamily?: string
  jobCategory?: string
  jobSubCategory?: string
  role?: CertificationRole
  maturity?: '全部' | 'L1' | 'L2' | 'L3'
}

export interface CertificationDetailData {
  summary: CertificationItem | null
  certificationRecords: CertificationAuditRecord[]
  appointmentRecords: AppointmentAuditRecord[]
  filters: {
    departmentTree: DepartmentNode[]
    jobFamilies: string[]
    jobCategories: string[]
    jobSubCategories: string[]
    roles: SelectOption<CertificationRole>[]
    maturityOptions: SelectOption<'全部' | 'L1' | 'L2' | 'L3'>[]
  }
}

