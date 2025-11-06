<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { Medal } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import { fetchCertifications } from '@/api/dashboard'
import StatCard from '@/components/common/StatCard.vue'
import CertificationOverview from '@/components/dashboard/CertificationOverview.vue'
import type { CertificationItem, MetricItem } from '@/types/dashboard'

const router = useRouter()
const certifications = ref<CertificationItem[]>([])
const loading = ref(false)
const metrics = ref<MetricItem[]>([])

const fetchData = async () => {
  loading.value = true
  try {
    const certRes = await fetchCertifications()
    certifications.value = certRes
    const total = certRes.length
    const participants = certRes.reduce((acc, cur) => acc + cur.participants, 0)
    const averagePass = Math.round(certRes.reduce((acc, cur) => acc + cur.passRate, 0) / (total || 1))
    metrics.value = [
      { id: 'cert-total', title: '认证体系', value: total, unit: '项', delta: 1, trend: 'up' },
      { id: 'participants', title: '累计参与人数', value: participants, unit: '人', delta: 86, trend: 'up' },
      { id: 'average-pass', title: '平均通过率', value: averagePass, unit: '%', delta: 3, trend: 'up' },
      { id: 'active', title: '进行中认证', value: certRes.filter((item) => item.status === '进行中').length, unit: '项', delta: 1, trend: 'up' },
    ]
  } finally {
    loading.value = false
  }
}

const handleViewDetail = (id: string) => {
  router.push({ name: 'CertificationDetail', params: { id } })
}

onMounted(() => {
  fetchData()
})

const capabilityMatrix = [
  { dimension: '业务理解', description: '洞察业务痛点，设计可落地的 AI 方案', score: 86 },
  { dimension: '技术掌握', description: '掌握模型训练、Prompt 设计与部署流程', score: 78 },
  { dimension: '运营赋能', description: '具备组织推动力与培训交付能力', score: 74 },
]
</script>

<template>
  <section class="dashboard certification-dashboard">
    <header class="dashboard__header">
      <div>
        <h2>AI 任职认证看板</h2>
        <p>保障 AI 人才体系建设，监控认证报名与通过效果，驱动能力闭环。</p>
      </div>
      <el-space>
        <el-button type="primary" plain>导出认证成绩</el-button>
        <el-button type="primary">创建认证计划</el-button>
      </el-space>
    </header>

    <el-skeleton :rows="4" animated v-if="loading" />
    <template v-else>
      <el-row :gutter="16" class="metric-row">
        <el-col v-for="metric in metrics" :key="metric.id" :xs="24" :sm="12" :md="6">
          <StatCard :title="metric.title" :value="metric.value" :unit="metric.unit" :delta="metric.delta" :trend="metric.trend" />
        </el-col>
      </el-row>

      <CertificationOverview :certifications="certifications" @view-detail="handleViewDetail" />

      <el-card shadow="hover" class="matrix-card">
        <template #header>
          <div class="matrix-card__header">
            <h3>
              <el-icon><Medal /></el-icon>
              能力画像指标
            </h3>
            <span>辅助洞察认证人才的能力结构与短板</span>
          </div>
        </template>
        <el-row :gutter="16">
          <el-col v-for="item in capabilityMatrix" :key="item.dimension" :xs="24" :md="8">
            <el-card shadow="never" class="matrix-card__item">
              <h4>{{ item.dimension }}</h4>
              <p>{{ item.description }}</p>
              <el-progress :percentage="item.score" :stroke-width="6" />
            </el-card>
          </el-col>
        </el-row>
      </el-card>
    </template>
  </section>
</template>

<style scoped lang="scss">
.dashboard {
  display: flex;
  flex-direction: column;
  gap: $spacing-lg;

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: $spacing-lg;

    h2 {
      margin: 0;
      font-size: 24px;
    }

    p {
      margin: $spacing-xs 0 0;
      color: $text-secondary-color;
    }
  }
}

.metric-row {
  margin-top: $spacing-xs;
}

.matrix-card {
  border: none;

  &__header {
    display: flex;
    align-items: center;
    gap: $spacing-md;

    h3 {
      display: flex;
      align-items: center;
      gap: 6px;
      margin: 0;
    }

    span {
      color: $text-secondary-color;
      font-size: 12px;
    }
  }

  &__item {
    border-radius: $radius-md;
    border: 1px solid rgba(58, 122, 254, 0.08);
    background: rgba(255, 255, 255, 0.95);
    min-height: 160px;

    h4 {
      margin: 0;
      font-size: 16px;
      font-weight: 600;
    }

    p {
      color: $text-secondary-color;
      min-height: 48px;
    }
  }
}

@media (max-width: 768px) {
  .dashboard__header {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>

