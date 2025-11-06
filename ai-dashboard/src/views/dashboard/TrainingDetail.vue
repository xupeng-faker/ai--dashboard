<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { ArrowLeft } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import { fetchTrainingDetail } from '@/api/dashboard'
import type { TrainingTask } from '@/types/dashboard'

const props = defineProps<{ id: string }>()
const router = useRouter()
const loading = ref(false)
const detail = ref<TrainingTask | undefined>()

const fetchDetail = async () => {
  loading.value = true
  try {
    detail.value = await fetchTrainingDetail(props.id)
  } finally {
    loading.value = false
  }
}

const handleBack = () => {
  router.push({ name: 'TrainingDashboard' })
}

onMounted(() => {
  fetchDetail()
})

const executionSteps = [
  { title: '数据准备', description: '数据清洗 & 样本均衡处理', status: 'finish' },
  { title: '特征工程', description: '自动特征选择 + Prompt 设计', status: 'finish' },
  { title: '模型训练', description: 'GPU 集群训练中', status: 'process' },
  { title: '评估部署', description: '待完成线上评估与版本发布', status: 'wait' },
]
</script>

<template>
  <section class="detail-view training-detail">
    <header class="detail-view__header">
      <el-button type="primary" text :icon="ArrowLeft" @click="handleBack">返回列表</el-button>
      <div>
        <h2>{{ detail?.name ?? '训练任务' }}</h2>
        <p>掌握训练进度、数据集及操作记录，确保模型持续迭代。</p>
      </div>
      <el-space>
        <el-button type="primary" plain>暂停训练</el-button>
        <el-button type="primary">重新启动</el-button>
      </el-space>
    </header>

    <el-skeleton :rows="6" animated v-if="loading" />
    <el-empty v-else-if="!detail" description="未找到对应的训练任务" />
    <template v-else>
      <el-descriptions border :column="2" title="任务基础信息" class="detail-block">
        <el-descriptions-item label="负责人">{{ detail.owner }}</el-descriptions-item>
        <el-descriptions-item label="最新进度">{{ detail.progress }}%</el-descriptions-item>
        <el-descriptions-item label="数据集">{{ detail.dataset }}</el-descriptions-item>
        <el-descriptions-item label="最后更新">{{ detail.updatedAt }}</el-descriptions-item>
        <el-descriptions-item label="训练状态">{{ detail.status }}</el-descriptions-item>
        <el-descriptions-item label="版本号">v2.3.5</el-descriptions-item>
      </el-descriptions>

      <el-card shadow="hover" class="detail-block">
        <template #header>
          <div class="card-header">
            <h3>训练执行流程</h3>
            <span>记录从数据准备到模型发布的全过程</span>
          </div>
        </template>
        <el-steps :active="2" finish-status="success">
          <el-step
            v-for="(step, index) in executionSteps"
            :key="step.title"
            :title="step.title"
            :description="step.description"
            :status="step.status as any"
          />
        </el-steps>
      </el-card>

      <el-card shadow="hover" class="detail-block">
        <template #header>
          <div class="card-header">
            <h3>训练日志快照</h3>
            <el-tag type="primary" effect="plain">近 100 条</el-tag>
          </div>
        </template>
        <el-timeline>
          <el-timeline-item timestamp="14:20" type="primary">
            评估集准确率从 89.6% 提升至 92.4%，F1 值 0.91。
          </el-timeline-item>
          <el-timeline-item timestamp="13:45" type="success">
            自动超参搜索完成，学习率调整为 1e-4。
          </el-timeline-item>
          <el-timeline-item timestamp="12:10" type="warning">
            检测到数据集存在标签噪声，自动触发清洗流程。
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

