<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { Medal, RefreshRight } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import { fetchCertificationDashboard } from '@/api/dashboard'
import { normalizeRoleOptions } from '@/constants/roles'
import { useDepartmentFilter } from '@/composables/useDepartmentFilter'
import StatCard from '@/components/common/StatCard.vue'
import CertificationSummaryTable from '@/components/dashboard/CertificationSummaryTable.vue'
import BarLineChart from '@/components/dashboard/BarLineChart.vue'
import type {
  CertificationDashboardData,
  CertificationDashboardFilters,
  StaffChartPoint,
} from '@/types/dashboard'

const router = useRouter()
const loading = ref(false)
const dashboardData = ref<CertificationDashboardData | null>(null)
const filters = ref<CertificationDashboardFilters>({
  role: '0',
  departmentPath: [],
})

const {
  departmentTree: departmentOptions,
  cascaderProps,
  initDepartmentTree,
} = useDepartmentFilter()

const roleOptions = computed(() => normalizeRoleOptions(dashboardData.value?.filters.roles ?? []))
const maturityOptions = computed(() => dashboardData.value?.filters.maturityOptions ?? [])

const departmentStatistics = computed(() => dashboardData.value?.employeeCertStatistics?.departmentStatistics ?? [])
const departmentStatsPoints = computed<StaffChartPoint[]>(() =>
  departmentStatistics.value.map((item) => ({
    label: item.deptName?.trim().length ? item.deptName : item.deptCode,
    count: item.certifiedCount ?? 0,
    rate: Number(item.certRate ?? 0),
  }))
)
const hasDepartmentStats = computed(() => departmentStatsPoints.value.length > 0)
const fallbackDepartmentPoints = computed<StaffChartPoint[]>(
  () => dashboardData.value?.allStaff.departmentAppointment ?? []
)
const departmentChartPoints = computed<StaffChartPoint[]>(() =>
  hasDepartmentStats.value ? departmentStatsPoints.value : fallbackDepartmentPoints.value
)
const departmentCountLabel = computed(() => (hasDepartmentStats.value ? '认证人数' : '任职人数'))
const departmentLegendTotals = computed<Record<string, string> | undefined>(() => {
  if (!hasDepartmentStats.value) return undefined
  const total = dashboardData.value?.employeeCertStatistics?.totalStatistics
  if (!total) return undefined
  return {
    [departmentCountLabel.value]: `${total.certifiedCount ?? 0}人`,
    占比: `${Number(total.certRate ?? 0).toFixed(1)}%`,
  }
})

const fetchData = async () => {
  loading.value = true
  try {
    dashboardData.value = await fetchCertificationDashboard({
      ...filters.value,
      departmentPath: filters.value.departmentPath?.length
        ? [...(filters.value.departmentPath ?? [])]
        : undefined,
    })
  } finally {
    loading.value = false
  }
}

const handleCellClick = (row: Record<string, unknown>, column: string) => {
  router.push({
    name: 'CertificationDetail',
    params: { id: 'detail' },
    query: {
      column,
      maturity: (row.maturityLevel as string) ?? '',
      jobCategory: (row.jobCategory as string) ?? '',
      role: filters.value.role,
    },
  })
}

const resetFilters = () => {
  filters.value = {
    role: '0',
    departmentPath: [],
    maturity: '全部',
  }
}

watch(
  filters,
  () => {
    fetchData()
  },
  { deep: true }
)

onMounted(() => {
  initDepartmentTree()
  fetchData()
})
</script>

<template>
  <section class="dashboard certification-dashboard">
    <header class="dashboard__header glass-card">
      <div class="header-info">
        <h2>AI 任职认证看板</h2>
        <p>
          覆盖专家、干部与全员多维度的任职与认证进度，支持六级部门级联筛选，帮助快速识别薄弱环节与提升方向。
        </p>
      </div>
      <el-space :size="12">
        <el-button type="primary" plain :icon="RefreshRight" @click="fetchData">刷新数据</el-button>
        <el-button type="primary">导出报告</el-button>
      </el-space>
    </header>

    <el-card shadow="hover" class="filter-card">
      <el-form :inline="true" :model="filters" label-width="92">
        <el-form-item label="部门筛选">
          <el-cascader
            v-model="filters.departmentPath"
            :options="departmentOptions"
            :props="cascaderProps"
            placeholder="可选择至六级部门"
            clearable
            separator=" / "
            style="width: 260px"
          />
        </el-form-item>
        <el-form-item label="组织成熟度">
          <el-select v-model="filters.maturity" placeholder="全部" clearable style="width: 160px">
            <el-option v-for="opt in maturityOptions" :key="opt.value" :label="opt.label" :value="opt.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="角色视图">
          <el-select v-model="filters.role" placeholder="全员" style="width: 160px">
            <el-option v-for="role in roleOptions" :key="role.value" :label="role.label" :value="role.value" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button text type="primary" @click="resetFilters">重置筛选</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-skeleton :rows="6" animated v-if="loading" />
    <template v-else-if="dashboardData">
      <el-row :gutter="16" class="metric-row">
        <el-col v-for="metric in dashboardData.metrics" :key="metric.id" :xs="24" :sm="12" :md="6">
          <StatCard
            :title="metric.title"
            :value="metric.value"
            :unit="metric.unit"
            :delta="metric.delta"
            :trend="metric.trend"
            subtitle="较上期"
          />
        </el-col>
      </el-row>

      <el-row :gutter="16" class="summary-table-grid">
        <el-col :xs="24" :lg="12">
          <CertificationSummaryTable
            title="专家AI任职认证数据表格1"
            :columns="[
              { prop: 'maturityLevel', label: '专家岗位AI成熟度评估', width: 180 },
              { prop: 'jobCategory', label: '职位类', width: 140 },
              {
                prop: 'baseline',
                label: '基线人数',
                width: 110,
                clickable: true,
                valueType: 'number',
              },
              {
                prop: 'certified',
                label: '已完成AI认证人数',
                width: 170,
                clickable: true,
                valueType: 'number',
              },
              {
                prop: 'certificationRate',
                label: 'AI认证人数占比',
                width: 150,
                valueType: 'percent',
              },
            ]"
            :data="dashboardData.expertCertification"
            :on-cell-click="handleCellClick"
          />
        </el-col>
        <el-col :xs="24" :lg="12">
          <CertificationSummaryTable
            title="专家AI任职认证数据表格2"
            :columns="[
              { prop: 'maturityLevel', label: '专家岗位AI成熟度评估', width: 180 },
              { prop: 'jobCategory', label: '职位类', width: 140 },
              {
                prop: 'baseline',
                label: '基线人数',
                width: 110,
                clickable: true,
                valueType: 'number',
              },
              {
                prop: 'appointed',
                label: 'AI任职人数',
                width: 130,
                clickable: true,
                valueType: 'number',
              },
              {
                prop: 'appointedByRequirement',
                label: '按要求AI任职人数',
                width: 180,
                clickable: true,
                valueType: 'number',
              },
              {
                prop: 'appointmentRate',
                label: 'AI任职率',
                width: 130,
                valueType: 'percent',
              },
              {
                prop: 'certificationCompliance',
                label: '按要求AI认证人数占比',
                width: 190,
                valueType: 'percent',
              },
            ]"
            :data="dashboardData.expertAppointment"
            :on-cell-click="handleCellClick"
          />
        </el-col>
        <el-col :xs="24" :lg="12">
          <CertificationSummaryTable
            title="干部AI任职认证数据表格1"
            :columns="[
              { prop: 'maturityLevel', label: '干部岗位AI成熟度评估', width: 180 },
              { prop: 'jobCategory', label: '职位类', width: 140 },
              {
                prop: 'baseline',
                label: '基线人数',
                width: 110,
                clickable: true,
                valueType: 'number',
              },
              {
                prop: 'aiCertificateHolders',
                label: 'AI专业级持证人数',
                width: 180,
                clickable: true,
                valueType: 'number',
              },
              {
                prop: 'subjectTwoPassed',
                label: '科目二通过人数',
                width: 160,
                valueType: 'number',
              },
              {
                prop: 'certificateRate',
                label: 'AI专业级持证率',
                width: 150,
                valueType: 'percent',
              },
              {
                prop: 'subjectTwoRate',
                label: '科目二通过率',
                width: 140,
                valueType: 'percent',
              },
              {
                prop: 'complianceRate',
                label: '按要求持证率',
                width: 130,
                valueType: 'percent',
              },
            ]"
            :data="dashboardData.cadreCertification"
            :on-cell-click="handleCellClick"
          />
        </el-col>
        <el-col :xs="24" :lg="12">
          <CertificationSummaryTable
            title="干部AI任职认证数据表格2"
            :columns="[
              { prop: 'maturityLevel', label: '干部岗位AI成熟度评估', width: 180 },
              { prop: 'jobCategory', label: '职位类', width: 140 },
              {
                prop: 'baseline',
                label: '基线人数',
                width: 110,
                clickable: true,
                valueType: 'number',
              },
              {
                prop: 'appointed',
                label: 'AI任职人数',
                width: 130,
                clickable: true,
                valueType: 'number',
              },
              {
                prop: 'appointedByRequirement',
                label: '按要求AI任职人数',
                width: 180,
                clickable: true,
                valueType: 'number',
              },
              {
                prop: 'appointmentRate',
                label: 'AI任职率',
                width: 130,
                valueType: 'percent',
              },
              {
                prop: 'certificationCompliance',
                label: '按要求AI认证人数占比',
                width: 190,
                valueType: 'percent',
              },
            ]"
            :data="dashboardData.cadreAppointment"
            :on-cell-click="handleCellClick"
          />
        </el-col>
      </el-row>

      <el-card shadow="hover" class="charts-section">
        <template #header>
          <div class="charts-header">
            <div class="charts-title">
              <el-icon><Medal /></el-icon>
              <div>
                <h3>全员任职/认证趋势</h3>
                <p>任职、认证人数使用柱状图展示，同时叠加占比折线辅助判读效率</p>
              </div>
            </div>
          </div>
        </template>
        <el-row :gutter="16">
          <el-col :xs="24" :lg="12">
            <BarLineChart
              title="部门任职数据"
              :points="departmentChartPoints"
              :count-label="departmentCountLabel"
              rate-label="占比"
              :legend-totals="departmentLegendTotals"
              :height="320"
            />
          </el-col>
          <el-col :xs="24" :lg="12">
            <BarLineChart
              title="部门认证数据"
              :points="dashboardData.allStaff.departmentCertification"
              count-label="认证人数"
              rate-label="占比"
              :height="320"
            />
          </el-col>
          <el-col :xs="24" :lg="12">
            <BarLineChart
              title="组织AI成熟度任职数据"
              :points="dashboardData.allStaff.organizationAppointment"
              count-label="任职人数"
              rate-label="占比"
              :height="320"
            />
          </el-col>
          <el-col :xs="24" :lg="12">
            <BarLineChart
              title="组织AI成熟度认证数据"
              :points="dashboardData.allStaff.organizationCertification"
              count-label="认证人数"
              rate-label="占比"
              :height="320"
            />
          </el-col>
          <el-col :xs="24" :lg="12">
            <BarLineChart
              title="职位类任职数据"
              :points="dashboardData.allStaff.jobCategoryAppointment"
              count-label="任职人数"
              rate-label="占比"
              :height="320"
            />
          </el-col>
          <el-col :xs="24" :lg="12">
            <BarLineChart
              title="职位类认证数据"
              :points="dashboardData.allStaff.jobCategoryCertification"
              count-label="认证人数"
              rate-label="占比"
              :height="320"
            />
          </el-col>
        </el-row>
      </el-card>
    </template>
    <el-empty v-else description="暂无数据" />
  </section>
</template>

<style scoped lang="scss">
.dashboard {
  display: flex;
  flex-direction: column;
  gap: $spacing-lg;
}

.glass-card {
  border-radius: $radius-lg;
  background: linear-gradient(135deg, rgba(58, 122, 254, 0.18), rgba(155, 92, 255, 0.16));
  box-shadow: 0 18px 45px rgba(58, 122, 254, 0.12);
  padding: $spacing-lg;
  color: #fff;

  h2 {
    margin: 0;
    font-size: 26px;
    font-weight: 700;
  }

  p {
    margin: $spacing-sm 0 0;
    color: rgba(255, 255, 255, 0.86);
    max-width: 600px;
    line-height: 1.6;
  }
}

.header-info {
  max-width: 640px;
}

.filter-card {
  border: none;
  border-radius: $radius-lg;
  background: rgba(255, 255, 255, 0.96);
  box-shadow: $shadow-card;
}

.metric-row {
  margin-top: $spacing-xs;
}

.summary-table-grid {
  margin-top: $spacing-sm;
  row-gap: $spacing-lg;

  :deep(.el-col) {
    display: flex;
  }

  :deep(.summary-table-card) {
    width: 100%;
  }
}

.charts-section {
  border: none;
  border-radius: $radius-lg;
  background: rgba(255, 255, 255, 0.96);

  :deep(.el-card__body) {
    padding: $spacing-lg;
  }

  :deep(.el-row) {
    row-gap: $spacing-lg;
  }

  .charts-title {
    display: flex;
    align-items: center;
    gap: $spacing-md;

    h3 {
      margin: 0;
      font-size: 18px;
      font-weight: 600;
      color: $text-main-color;
    }

    p {
      margin: $spacing-xs 0 0;
      color: $text-secondary-color;
    }
  }
}

@media (max-width: 768px) {
  .glass-card {
    flex-direction: column;
    gap: $spacing-md;
  }
}
</style>
