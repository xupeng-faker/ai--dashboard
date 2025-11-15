export interface DepartmentInfo {
  deptCode: string
  deptName: string
  deptLevel: string
  parentDeptCode?: string
}

export interface ApiResponse<T> {
  code: number
  message: string
  data: T
  timestamp: number
}

export interface DepartmentCertStatistic {
  deptCode: string
  deptName: string
  totalCount: number
  certifiedCount: number
  certRate: number
}

export interface EmployeeCertStatisticsResponse {
  departmentStatistics: DepartmentCertStatistic[]
  totalStatistics: DepartmentCertStatistic
}
