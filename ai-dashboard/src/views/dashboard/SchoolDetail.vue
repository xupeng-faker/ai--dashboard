<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { ArrowLeft, Check } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import { fetchCourseDetail } from '@/api/dashboard'
import type { CourseItem } from '@/types/dashboard'

const props = defineProps<{ id: string }>()
const router = useRouter()
const loading = ref(false)
const detail = ref<CourseItem | undefined>()

const fetchDetail = async () => {
  loading.value = true
  try {
    detail.value = await fetchCourseDetail(props.id)
  } finally {
    loading.value = false
  }
}

const handleBack = () => {
  router.push({ name: 'SchoolDashboard' })
}

onMounted(() => {
  fetchDetail()
})

const chapterList = [
  { title: 'AI 赋能概览与趋势', duration: '18 分钟', status: '完成' },
  { title: '业务痛点识别 & 案例拆解', duration: '24 分钟', status: '进行中' },
  { title: 'Prompt 设计工作坊', duration: '32 分钟', status: '未开始' },
]

const resources = [
  '课程讲义：AI 赋能方法论（PDF）',
  '实践模板：业务场景分析 Canvas',
  '录播回放：Prompt 设计技巧',
]
</script>

<template>
  <section class="detail-view course-detail">
    <header class="detail-view__header">
      <el-button type="primary" text :icon="ArrowLeft" @click="handleBack">返回课程列表</el-button>
      <div>
        <h2>{{ detail?.title ?? '课程详情' }}</h2>
        <p>掌握课程目标、章节进度与配套资源，助力学员高效学习。</p>
      </div>
      <el-space>
        <el-button type="primary" plain>下载课件</el-button>
        <el-button type="primary">继续学习</el-button>
      </el-space>
    </header>

    <el-skeleton :rows="6" animated v-if="loading" />
    <el-empty v-else-if="!detail" description="未找到对应课程" />
    <template v-else>
      <el-descriptions border :column="2" title="课程基础信息" class="detail-block">
        <el-descriptions-item label="课程分类">{{ detail.category }}</el-descriptions-item>
        <el-descriptions-item label="学习人数">{{ detail.learners }}</el-descriptions-item>
        <el-descriptions-item label="平均完成率">{{ detail.completionRate }}%</el-descriptions-item>
        <el-descriptions-item label="最近更新">{{ detail.updatedAt }}</el-descriptions-item>
      </el-descriptions>

      <el-card shadow="hover" class="detail-block">
        <template #header>
          <div class="card-header">
            <h3>课程章节</h3>
            <span>掌握每个章节的学习状态与建议时长</span>
          </div>
        </template>
        <el-steps direction="vertical" :active="1">
          <el-step
            v-for="chapter in chapterList"
            :key="chapter.title"
            :title="chapter.title"
            :description="`${chapter.duration} · ${chapter.status}`"
          />
        </el-steps>
      </el-card>

      <el-card shadow="hover" class="detail-block">
        <template #header>
          <div class="card-header">
            <h3>配套资源</h3>
            <span>支持下载或直接进入实践环境</span>
          </div>
        </template>
        <el-timeline>
          <el-timeline-item v-for="item in resources" :key="item" type="primary">
            <el-icon><Check /></el-icon>
            {{ item }}
          </el-timeline-item>
        </el-timeline>
      </el-card>
    </template>
  </section>
</template>

<style scoped lang="scss">
.detail-view {
  display: flex;
  flex-direction: column;
  gap: $spacing-lg;

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: $spacing-lg;

    h2 {
      margin: 0;
      font-size: 24px;
      font-weight: 600;
    }

    p {
      margin: $spacing-xs 0 0;
      color: $text-secondary-color;
    }
  }
}

.detail-block {
  border: none;
  border-radius: $radius-lg;
  background: #fff;
}

.card-header {
  display: flex;
  align-items: center;
  gap: $spacing-md;

  h3 {
    margin: 0;
    font-size: 18px;
  }

  span {
    color: $text-secondary-color;
    font-size: 12px;
  }
}

@media (max-width: 768px) {
  .detail-view__header {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>

