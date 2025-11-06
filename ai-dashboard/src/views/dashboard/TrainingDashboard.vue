<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { Promotion, Refresh } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import { fetchTrainingTasks } from '@/api/dashboard'
import StatCard from '@/components/common/StatCard.vue'
import TrainingTaskTable from '@/components/dashboard/TrainingTaskTable.vue'
import type { MetricItem, TrainingTask } from '@/types/dashboard'

const router = useRouter()
const tasks = ref<TrainingTask[]>([])
const loading = ref(false)
const metrics = ref<MetricItem[]>([])

const fetchData = async () => {
  loading.value = true
  try {
    const taskRes = await fetchTrainingTasks()
    tasks.value = taskRes
    const total = taskRes.length
    const completed = taskRes.filter((item) => item.status === '已完成').length
    const inProgress = taskRes.filter((item) => item.status === '进行中').length

    metrics.value = [
      { id: 'total', title: '累计训练任务', value: total, unit: '个', delta: 3, trend: 'up' },
      { id: 'ongoing', title: '进行中任务', value: inProgress, unit: '个', delta: 1, trend: 'up' },
      {
        id: 'completion',
        title: '完成率',
        value: total ? Math.round((completed / total) * 100) : 0,
        unit: '%',
        delta: 6,
        trend: 'up',
      },
      { id: 'avg', title: '平均训练进度', value: Math.round(taskRes.reduce((acc, cur) => acc + cur.progress, 0) / (total || 1)), unit: '%', delta: -2, trend: 'down' },
    ]
  } finally {
    loading.value = false
  }
}

const handleViewDetail = (id: string) => {
  router.push({ name: 'TrainingDetail', params: { id } })
}

onMounted(() => {
  fetchData()
})

const modelInsights = [
  {
    title: '文本分类模型 V2',
    highlight: '在最新一轮训练中，准确率提升至 92.4%，召回率 89.6%。',
    action: '建议在客服自动分流场景中灰度上线。',
  },
  {
    title: '视觉质检模型',
    highlight: '新增数据增强策略后，误判率降低 18%。',
    action: '计划扩展至生产质检线，覆盖范围提升 35%。',
  },
]
</script>

<template>
  <section class="dashboard training-dashboard">
    <header class="dashboard__header">
      <div>
        <h2>AI 训练看板</h2>
        <p>掌握训练任务全生命周期状态，快速定位问题数据集与模型表现。</p>
      </div>
      <el-space>
        <el-button type="primary" plain>导入训练配置</el-button>
        <el-button type="primary">新建训练任务</el-button>
      </el-space>
    </header>

    <el-skeleton :rows="4" animated v-if="loading" />
    <template v-else>
      <el-row :gutter="16" class="metric-row">
        <el-col v-for="metric in metrics" :key="metric.id" :xs="24" :sm="12" :md="6">
          <StatCard :title="metric.title" :value="metric.value" :unit="metric.unit" :delta="metric.delta" :trend="metric.trend" />
        </el-col>
      </el-row>

      <TrainingTaskTable :tasks="tasks" @view-detail="handleViewDetail" />

      <el-card shadow="hover" class="insight-card">
        <template #header>
          <div class="insight-card__header">
            <div>
              <h3>
                <el-icon><Promotion /></el-icon>
                模型训练洞察
              </h3>
              <p>从训练日志中自动提炼的关键结论与建议行动。</p>
            </div>
            <el-button type="primary" text :icon="Refresh">刷新洞察</el-button>
          </div>
        </template>
        <el-row :gutter="16">
          <el-col v-for="item in modelInsights" :key="item.title" :xs="24" :md="12">
            <el-card shadow="never" class="insight-card__item">
              <h4>{{ item.title }}</h4>
              <p class="highlight">{{ item.highlight }}</p>
              <p class="action">{{ item.action }}</p>
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

.insight-card {
  border: none;

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: $spacing-lg;

    h3 {
      display: flex;
      align-items: center;
      gap: 6px;
      margin: 0;
    }

    p {
      margin: 4px 0 0;
      color: $text-secondary-color;
      font-size: 12px;
    }
  }

  &__item {
    border: 1px dashed rgba(58, 122, 254, 0.2);
    background: rgba(58, 122, 254, 0.04);
    border-radius: $radius-md;
    min-height: 160px;

    h4 {
      margin: 0 0 $spacing-sm;
      font-size: 16px;
    }

    .highlight {
      color: $text-main-color;
    }

    .action {
      color: $primary-color;
      font-weight: 500;
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

