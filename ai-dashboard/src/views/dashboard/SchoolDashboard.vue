<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { Notebook, UploadFilled } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import { fetchCourses } from '@/api/dashboard'
import StatCard from '@/components/common/StatCard.vue'
import CourseGrid from '@/components/dashboard/CourseGrid.vue'
import type { CourseItem, MetricItem } from '@/types/dashboard'

const router = useRouter()
const courses = ref<CourseItem[]>([])
const loading = ref(false)
const metrics = ref<MetricItem[]>([])

const fetchData = async () => {
  loading.value = true
  try {
    const courseRes = await fetchCourses()
    courses.value = courseRes
    const totalLearners = courseRes.reduce((acc, cur) => acc + cur.learners, 0)
    const averageCompletion = Math.round(courseRes.reduce((acc, cur) => acc + cur.completionRate, 0) / (courseRes.length || 1))
    metrics.value = [
      { id: 'course-total', title: '上线课程', value: 36, unit: '门', delta: 4, trend: 'up' },
      { id: 'students', title: '累计学习人数', value: totalLearners, unit: '人', delta: 128, trend: 'up' },
      { id: 'avg-completion', title: '平均完成率', value: averageCompletion, unit: '%', delta: 5, trend: 'up' },
      { id: 'mentor', title: '认证导师', value: 42, unit: '位', delta: 2, trend: 'up' },
    ]
  } finally {
    loading.value = false
  }
}

const handleViewDetail = (id: string) => {
  router.push({ name: 'SchoolDetail', params: { id } })
}

onMounted(() => {
  fetchData()
})

const learningPlan = [
  {
    phase: '启航阶段',
    focus: 'AI 认知与基础工具熟悉',
    weeks: 'Week 1-2',
  },
  {
    phase: '提升阶段',
    focus: 'Prompt 工程与业务场景实践',
    weeks: 'Week 3-5',
  },
  {
    phase: '突破阶段',
    focus: '真实业务案例实战与复盘',
    weeks: 'Week 6-8',
  },
]
</script>

<template>
  <section class="dashboard school-dashboard">
    <header class="dashboard__header">
      <div>
        <h2>AI School 看板</h2>
        <p>构建 AI 学习闭环，追踪课程上线与学习效果，让赋能触达全员。</p>
      </div>
      <el-space>
        <el-button type="primary" plain :icon="UploadFilled">上传课程</el-button>
        <el-button type="primary">新建学习计划</el-button>
      </el-space>
    </header>

    <el-skeleton :rows="4" animated v-if="loading" />
    <template v-else>
      <el-row :gutter="16" class="metric-row">
        <el-col v-for="metric in metrics" :key="metric.id" :xs="24" :sm="12" :md="6">
          <StatCard :title="metric.title" :value="metric.value" :unit="metric.unit" :delta="metric.delta" :trend="metric.trend" />
        </el-col>
      </el-row>

      <CourseGrid :courses="courses" @view-detail="handleViewDetail" />

      <el-card shadow="hover" class="plan-card">
        <template #header>
          <div class="plan-card__header">
            <h3>
              <el-icon><Notebook /></el-icon>
              学习路径规划
            </h3>
            <span>帮助不同阶段的学员快速匹配学习资源</span>
          </div>
        </template>
        <el-row :gutter="16">
          <el-col v-for="item in learningPlan" :key="item.phase" :xs="24" :md="8">
            <el-card shadow="never" class="plan-card__item">
              <h4>{{ item.phase }}</h4>
              <p class="weeks">{{ item.weeks }}</p>
              <p class="focus">{{ item.focus }}</p>
              <el-button type="primary" link>查看推荐课程</el-button>
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

.plan-card {
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

    .weeks {
      color: $primary-color;
      font-weight: 500;
    }

    .focus {
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

