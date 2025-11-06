<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { ArrowLeft, Trophy } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import { fetchCertificationDetail } from '@/api/dashboard'
import type { CertificationItem } from '@/types/dashboard'

const props = defineProps<{ id: string }>()
const router = useRouter()
const loading = ref(false)
const detail = ref<CertificationItem | undefined>()

const fetchDetail = async () => {
  loading.value = true
  try {
    detail.value = await fetchCertificationDetail(props.id)
  } finally {
    loading.value = false
  }
}

const handleBack = () => {
  router.push({ name: 'CertificationDashboard' })
}

onMounted(() => {
  fetchDetail()
})

const assessmentStages = [
  { title: '报名审核', desc: '确认岗位匹配度与学习完成情况', status: '完成' },
  { title: '在线考试', desc: '60 分钟闭卷考试，满分 100 分', status: '进行中' },
  { title: '案例答辩', desc: '提交业务场景方案，现场评委问答', status: '待开始' },
]

const scoreDistribution = [
  { label: '知识理解', score: 86 },
  { label: '实践能力', score: 78 },
  { label: '影响力', score: 72 },
]
</script>

<template>
  <section class="detail-view cert-detail">
    <header class="detail-view__header">
      <el-button type="primary" text :icon="ArrowLeft" @click="handleBack">返回认证列表</el-button>
      <div>
        <h2>{{ detail?.name ?? '认证详情' }}</h2>
        <p>查看认证流程、成绩表现与提升建议，支撑人才体系建设。</p>
      </div>
      <el-space>
        <el-button type="primary" plain>导出成绩</el-button>
        <el-button type="primary">安排补考</el-button>
      </el-space>
    </header>

    <el-skeleton :rows="6" animated v-if="loading" />
    <el-empty v-else-if="!detail" description="未找到对应认证" />
    <template v-else>
      <el-descriptions border :column="2" title="认证基础信息" class="detail-block">
        <el-descriptions-item label="认证等级">{{ detail.level }}</el-descriptions-item>
        <el-descriptions-item label="参与人数">{{ detail.participants }}</el-descriptions-item>
        <el-descriptions-item label="平均通过率">{{ detail.passRate }}%</el-descriptions-item>
        <el-descriptions-item label="状态">{{ detail.status }}</el-descriptions-item>
        <el-descriptions-item label="最近更新">{{ detail.updatedAt }}</el-descriptions-item>
        <el-descriptions-item label="认证周期">T+30 天</el-descriptions-item>
      </el-descriptions>

      <el-card shadow="hover" class="detail-block">
        <template #header>
          <div class="card-header">
            <h3>认证流程</h3>
            <span>清晰掌握候选人的认证旅程</span>
          </div>
        </template>
        <el-steps direction="vertical" :active="1">
          <el-step v-for="stage in assessmentStages" :key="stage.title" :title="stage.title" :description="`${stage.desc} · ${stage.status}`" />
        </el-steps>
      </el-card>

      <el-card shadow="hover" class="detail-block">
        <template #header>
          <div class="card-header">
            <h3>
              <el-icon><Trophy /></el-icon>
              能力得分分布
            </h3>
            <span>基于认证成绩的维度化分析</span>
          </div>
        </template>
        <el-row :gutter="16">
          <el-col v-for="item in scoreDistribution" :key="item.label" :xs="24" :md="8">
            <el-card shadow="never" class="score-card">
              <p class="label">{{ item.label }}</p>
              <p class="score">{{ item.score }}<small>分</small></p>
              <el-progress :percentage="item.score" :stroke-width="6" />
            </el-card>
          </el-col>
        </el-row>
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
    display: flex;
    align-items: center;
    gap: 6px;
    margin: 0;
    font-size: 18px;
  }

  span {
    color: $text-secondary-color;
    font-size: 12px;
  }
}

.score-card {
  border-radius: $radius-md;
  border: 1px solid rgba(58, 122, 254, 0.08);
  background: rgba(255, 255, 255, 0.96);
  text-align: center;
  padding: $spacing-lg;

  .label {
    margin: 0;
    color: $text-secondary-color;
  }

  .score {
    margin: $spacing-sm 0;
    font-size: 28px;
    font-weight: 700;

    small {
      font-size: 14px;
    }
  }
}

@media (max-width: 768px) {
  .detail-view__header {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>

