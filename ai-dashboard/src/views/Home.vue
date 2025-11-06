<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { ArrowRight } from '@element-plus/icons-vue'
import { fetchMaturityMetrics, fetchMaturityTrend } from '@/api/dashboard'
import StatCard from '@/components/common/StatCard.vue'
import TrendChartCard from '@/components/common/TrendChartCard.vue'
import { useDashboardTabs } from '@/composables/useDashboardTabs'
import type { MetricItem, TrendPoint } from '@/types/dashboard'

const { tabs, activeTab, goTo } = useDashboardTabs()
const metrics = ref<MetricItem[]>([])
const trendPoints = ref<TrendPoint[]>([])
const loading = ref(false)

const handleContinue = () => {
  goTo(activeTab.value)
}

const fetchOverview = async () => {
  try {
    loading.value = true
    const [metricRes, trendRes] = await Promise.all([
      fetchMaturityMetrics(),
      fetchMaturityTrend(),
    ])
    metrics.value = metricRes
    trendPoints.value = trendRes
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchOverview()
})
</script>

<template>
  <section class="home-view">
    <el-skeleton :rows="3" animated v-if="loading" />
    <template v-else>
      <div class="hero">
        <div class="hero__content">
          <h2>智能赋能运营驾驶舱</h2>
          <p>
            通过组织/岗位成熟度、AI 训练、AI School、任职认证四大体系，构建企业级 AI 运营闭环，助力业务持续进化。
          </p>
          <div class="hero__actions">
            <el-button type="primary" @click="goTo('maturity')" round>
              开始浏览看板
              <el-icon class="el-icon--right"><ArrowRight /></el-icon>
            </el-button>
            <el-button text @click="handleContinue">继续上次任务</el-button>
          </div>
        </div>
        <el-card class="hero__summary" shadow="never">
          <p class="summary-title">核心指标速览</p>
          <ul>
            <li>近 30 天新增 AI 使用岗位 <strong>46</strong> 个</li>
            <li>Prompt 复用率提升 <strong>18%</strong></li>
            <li>AI 赋能满意度达到 <strong>92%</strong></li>
          </ul>
        </el-card>
      </div>

      <el-row :gutter="16" class="metric-row">
        <el-col v-for="metric in metrics" :key="metric.id" :xs="24" :sm="12" :md="6">
          <StatCard
            :title="metric.title"
            :value="metric.value"
            :unit="metric.unit"
            :delta="metric.delta"
            :trend="metric.trend"
          />
        </el-col>
      </el-row>

      <trend-chart-card
        title="AI 成熟度趋势"
        description="反映组织/岗位 AI 能力的持续提升情况"
        :points="trendPoints"
      />

      <div class="tab-entry">
        <div class="tab-entry__header">
          <h3>核心能力模块</h3>
          <p>通过页签快速跳转至各类看板，查看运营详情或进入深度分析。</p>
        </div>
        <el-tabs v-model="activeTab" class="tab-entry__tabs">
          <el-tab-pane v-for="tab in tabs" :key="tab.name" :name="tab.name" lazy>
            <template #label>
              <span class="tab-label">
                <el-icon><component :is="tab.icon" /></el-icon>
                {{ tab.label }}
              </span>
            </template>
            <div class="tab-entry__panel">
              <p>跳转到 {{ tab.label }}，查看实时数据及深度分析。</p>
              <el-button type="primary" size="small" round @click="goTo(tab.name)">
                进入看板
              </el-button>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </template>
  </section>
</template>

<style scoped lang="scss">
.home-view {
  display: flex;
  flex-direction: column;
  gap: $spacing-lg;
}

.hero {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: $spacing-lg;
  align-items: stretch;

  &__content {
    padding: $spacing-xl;
    border-radius: $radius-lg;
    background: linear-gradient(135deg, rgba(58, 122, 254, 0.12), rgba(155, 92, 255, 0.1));
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.2);

    h2 {
      margin: 0;
      font-size: 28px;
      font-weight: 700;
      color: #122136;
    }

    p {
      color: rgba(18, 33, 54, 0.75);
      line-height: 1.6;
      margin: $spacing-md 0;
    }
  }

  &__actions {
    display: flex;
    align-items: center;
    gap: $spacing-md;
    margin-top: $spacing-lg;
  }

  &__summary {
    border-radius: $radius-lg;
    border: none;
    background: #fff;

    .summary-title {
      margin: 0 0 $spacing-sm;
      font-weight: 600;
    }

    ul {
      margin: 0;
      padding-left: 20px;
      display: flex;
      flex-direction: column;
      gap: $spacing-sm;
      color: $text-secondary-color;

      strong {
        color: $primary-color;
      }
    }
  }
}

.metric-row {
  margin-top: $spacing-sm;
}

.tab-entry {
  border-radius: $radius-lg;
  padding: $spacing-lg;
  background: #fff;
  box-shadow: $shadow-card;

  &__header {
    margin-bottom: $spacing-md;

    h3 {
      margin: 0;
      font-size: 20px;
      font-weight: 600;
    }

    p {
      margin: $spacing-xs 0 0;
      color: $text-secondary-color;
    }
  }

  &__tabs {
    ::v-deep(.el-tabs__nav-wrap::after) {
      display: none;
    }
  }

  &__panel {
    margin-top: $spacing-md;
    padding: $spacing-lg;
    border-radius: $radius-md;
    background: linear-gradient(135deg, rgba(58, 122, 254, 0.08), rgba(58, 122, 254, 0.02));
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: $spacing-md;

    p {
      margin: 0;
      color: $text-secondary-color;
    }
  }
}

.tab-label {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

@media (max-width: 768px) {
  .hero__actions {
    flex-direction: column;
    align-items: stretch;
  }

  .tab-entry__panel {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>

