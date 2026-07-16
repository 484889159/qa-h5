<template>
  <div class="question-card" @click="goToDetail">
    <div class="card-header">
      <span class="category" :style="{ background: getCategoryColor(question.category) }">
        {{ question.category }}
      </span>
      <span v-if="pinned" class="pinned-tag">📌 置顶</span>
    </div>
    
    <div class="card-title">{{ question.title }}</div>
    
    <div class="card-footer">
      <span class="author">{{ question.author }}</span>
      <span class="time">{{ question.time }}</span>
      <span class="stats">💬 {{ question.replyCount }}</span>
      <span class="stats">👍 {{ question.likeCount }}</span>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const props = defineProps({
  question: {
    type: Object,
    required: true
  },
  pinned: {
    type: Boolean,
    default: false
  }
})

const router = useRouter()

const getCategoryColor = (category) => {
  const colors = {
    '技术': '#1989fa',
    '生活': '#07c160',
    '情感': '#ee0a24',
    '职场': '#ff976a',
    '其他': '#969799'
  }
  return colors[category] || '#969799'
}

const goToDetail = () => {
  router.push(`/detail/${props.question.id}`)
}
</script>

<style scoped>
.question-card {
  background: #fff;
  padding: 14px 0;
  border-bottom: 1px solid #f5f6fa;
  cursor: pointer;
  transition: background 0.2s;
}

.question-card:active {
  background: #f5f6fa;
}

.card-header {
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
}

.category {
  font-size: 12px;
  color: #fff;
  padding: 1px 10px;
  border-radius: 10px;
  display: inline-block;
}

.pinned-tag {
  font-size: 12px;
  color: #ff976a;
}

.card-title {
  font-size: 15px;
  color: #333;
  line-height: 1.5;
  margin-bottom: 10px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-footer {
  font-size: 13px;
  color: #999;
  display: flex;
  gap: 12px;
  align-items: center;
}

.card-footer .stats {
  margin-left: auto;
}
</style>