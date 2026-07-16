<template>
  <div class="detail-page">
    <van-nav-bar
      title="详情"
      left-text="返回"
      left-arrow
      @click-left="$router.back()"
    />

    <div class="content" v-if="module">
      <div class="icon">{{ module.icon }}</div>
      <div class="title">{{ module.title }}</div>
      <div class="desc">{{ module.desc }}</div>
      <div class="stats">
        <span>👁️ {{ module.views }} 浏览</span>
        <span>👍 {{ module.likes }} 赞</span>
      </div>
    </div>

    <div v-else class="empty">内容不存在</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const module = ref(null)

onMounted(() => {
  const id = parseInt(route.params.id)
  const saved = localStorage.getItem('campus_modules')
  if (saved) {
    try {
      const list = JSON.parse(saved)
      module.value = list.find(item => item.id === id)
    } catch (e) {}
  }
})
</script>

<style scoped>
.detail-page {
  min-height: 100vh;
  background: #f5f6fa;
  padding: 16px;
}

.content {
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  text-align: center;
}

.icon {
  font-size: 64px;
  margin-bottom: 16px;
}

.title {
  font-size: 22px;
  font-weight: bold;
  color: #333;
  margin-bottom: 12px;
}

.desc {
  font-size: 16px;
  color: #666;
  line-height: 1.8;
  text-align: left;
  margin: 16px 0;
}

.stats {
  display: flex;
  justify-content: center;
  gap: 32px;
  color: #999;
  font-size: 14px;
  padding-top: 16px;
  border-top: 1px solid #f0f0f0;
}

.empty {
  text-align: center;
  padding: 60px 0;
  color: #999;
}
</style>