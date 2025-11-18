import type { DepartmentCertStatistic, EmployeeCertStatisticsResponse } from '../types'

type StatisticsStore = Record<string, DepartmentCertStatistic[]>

const baseStatsByDept: Record<string, DepartmentCertStatistic[]> = {
  '0': [
    {
      deptCode: 'dept-ict-core-ops',
      deptName: '云核心网运营部',
      totalCount: 320,
      certifiedCount: 208,
      certRate: 65,
      qualifiedCount: 208,
      qualifiedRate: 65,
    },
    {
      deptCode: 'dept-ict-core-dev',
      deptName: '云核心网研发部',
      totalCount: 280,
      certifiedCount: 190,
      certRate: 67.86,
      qualifiedCount: 190,
      qualifiedRate: 67.86,
    },
    {
      deptCode: 'dept-ict-core-solution',
      deptName: '云核心网解决方案部',
      totalCount: 240,
      certifiedCount: 168,
      certRate: 70,
      qualifiedCount: 168,
      qualifiedRate: 70,
    },
  ],
  'dept-ict-core-ops': [
    {
      deptCode: 'dept-ict-core-ops-asia',
      deptName: '亚太运营支撑处',
      totalCount: 140,
      certifiedCount: 96,
      certRate: 68.57,
      qualifiedCount: 96,
      qualifiedRate: 68.57,
    },
    {
      deptCode: 'dept-ict-core-ops-emea',
      deptName: '欧洲中东非运营支撑处',
      totalCount: 110,
      certifiedCount: 70,
      certRate: 63.64,
      qualifiedCount: 70,
      qualifiedRate: 63.64,
    },
  ],
  'dept-ict-core-dev': [
    {
      deptCode: 'dept-ict-core-dev-platform',
      deptName: '网络云平台研发室',
      totalCount: 150,
      certifiedCount: 108,
      certRate: 72,
      qualifiedCount: 108,
      qualifiedRate: 72,
    },
    {
      deptCode: 'dept-ict-core-dev-ai',
      deptName: 'AI 网络创新室',
      totalCount: 120,
      certifiedCount: 84,
      certRate: 70,
      qualifiedCount: 84,
      qualifiedRate: 70,
    },
  ],
  'dept-ict-core-solution': [
    {
      deptCode: 'dept-ict-core-solution-5g',
      deptName: '5G 解决方案办',
      totalCount: 130,
      certifiedCount: 86,
      certRate: 66.15,
      qualifiedCount: 86,
      qualifiedRate: 66.15,
    },
    {
      deptCode: 'dept-ict-core-solution-cloud',
      deptName: '云化核心网方案办',
      totalCount: 110,
      certifiedCount: 78,
      certRate: 70.91,
      qualifiedCount: 78,
      qualifiedRate: 70.91,
    },
  ],
}

const statisticsStore: StatisticsStore = {}

const calculateCertRate = (total: number, certified: number) => {
  if (!total) return 0
  return Number(((certified / total) * 100).toFixed(2))
}

const scaleStatistics = (stats: DepartmentCertStatistic[], multiplier: number) =>
  stats.map((item) => {
    const ratio = item.totalCount ? item.certifiedCount / item.totalCount : 0
    const qualifiedRatio = item.totalCount
      ? (item.qualifiedCount ?? item.certifiedCount ?? 0) / item.totalCount
      : 0
    const totalCount = Math.max(1, Math.round(item.totalCount * multiplier))
    const certifiedCount = Math.max(0, Math.min(totalCount, Math.round(totalCount * ratio)))
    const qualifiedCount = Math.max(0, Math.min(totalCount, Math.round(totalCount * qualifiedRatio)))
    return {
      ...item,
      totalCount,
      certifiedCount,
      certRate: calculateCertRate(totalCount, certifiedCount),
      qualifiedCount,
      qualifiedRate: calculateCertRate(totalCount, qualifiedCount),
    }
  })

const initStore = () => {
  const multipliers: Record<string, number> = {
    '0': 1,
    '1': 0.85,
    '2': 0.65,
    '3': 0.5,
  }

  Object.entries(multipliers).forEach(([personType, multiplier]) => {
    Object.entries(baseStatsByDept).forEach(([deptCode, stats]) => {
      statisticsStore[`${personType}:${deptCode}`] = scaleStatistics(stats, multiplier)
    })
  })
}

initStore()

const cloneStats = (stats: DepartmentCertStatistic[]) => stats.map((item) => ({ ...item }))

const buildTotalStatistics = (stats: DepartmentCertStatistic[]): DepartmentCertStatistic => {
  const totalCount = stats.reduce((sum, item) => sum + (item.totalCount ?? 0), 0)
  const certifiedCount = stats.reduce(
    (sum, item) => sum + (item.certifiedCount ?? item.qualifiedCount ?? 0),
    0
  )
  const qualifiedCount = stats.reduce(
    (sum, item) => sum + (item.qualifiedCount ?? item.certifiedCount ?? 0),
    0
  )
  return {
    deptCode: 'total',
    deptName: '总计',
    totalCount,
    certifiedCount,
    certRate: calculateCertRate(totalCount, certifiedCount),
    qualifiedCount,
    qualifiedRate: calculateCertRate(totalCount, qualifiedCount),
  }
}

export const getEmployeeCertStatistics = (
  deptCode: string,
  personType: string
): EmployeeCertStatisticsResponse => {
  const normalizedDeptCode = deptCode?.trim().length ? deptCode : '0'
  const normalizedPersonType = personType?.trim().length ? personType : '0'
  const key = `${normalizedPersonType}:${normalizedDeptCode}`
  const fallbackByDept = `${normalizedPersonType}:0`
  const fallbackDefault = '0:0'
  const stats =
    statisticsStore[key] ?? statisticsStore[fallbackByDept] ?? statisticsStore[fallbackDefault] ?? []

  const departmentStatistics = cloneStats(stats)
  const totalStatistics = buildTotalStatistics(departmentStatistics)

  return {
    departmentStatistics,
    totalStatistics,
  }
}

