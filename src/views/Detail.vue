<template>
  <div class="detail-page">
    <!-- 头部 -->
    <van-nav-bar
      title="问题详情"
      left-text="返回"
      left-arrow
      @click-left="router.back()"
    />

    <!-- 问题内容 -->
    <div class="question-content" v-if="question.id">
      <div class="title">{{ question.title }}</div>
      <div class="meta">
        <span class="author">{{ question.nickname || '匿名用户' }}</span>
        <span class="time">{{ question.createTime }}</span>
        <span class="category">{{ question.categoryName }}</span>
      </div>
      <div class="body">{{ question.content }}</div>
      <div class="stats">
        <span>👁️ {{ question.viewCount || 0 }}</span>
        <span>💬 {{ question.replyCount || 0 }}</span>
        <span>👍 {{ question.likeCount || 0 }}</span>
      </div>
    </div>

    <!-- 回复列表 -->
    <div class="reply-section">
      <div class="section-header">
        <span>全部回复 ({{ replyList.length }})</span>
      </div>
      
      <ReplyItem 
        v-for="reply in replyList" 
        :key="reply.id"
        :reply="reply"
      />
      
      <div v-if="replyList.length === 0" class="empty-reply">
        还没有回复，快来抢沙发吧～
      </div>
    </div>

    <!-- 底部回复输入框 -->
    <div class="reply-input-bar">
      <van-field
        v-model="replyContent"
        placeholder="写下你的回答..."
        type="textarea"
        autosize
        maxlength="200"
        class="reply-field"
      />
      <van-button 
        type="primary" 
        size="small" 
        @click="submitReply"
        :loading="replySubmitting"
      >
        发送
      </van-button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { showToast } from 'vant'
import ReplyItem from '@/components/ReplyItem.vue'
import { questionApi, replyApi } from '@/api'

const router = useRouter()
const route = useRoute()
const replyContent = ref('')
const replySubmitting = ref(false)

const question = ref({})
const replyList = ref([])

// 加载问题详情
const loadQuestionDetail = async () => {
  try {
    const id = route.params.id
    const res = await questionApi.getDetail(id)
    question.value = res
  } catch (error) {
    showToast('加载问题失败')
  }
}

// 加载回复列表
const loadReplies = async () => {
  try {
    const id = route.params.id
    const res = await replyApi.getList(id)
    replyList.value = res || []
  } catch (error) {
    showToast('加载回复失败')
  }
}

// 提交回复
const submitReply = async () => {
  if (!replyContent.value.trim()) {
    showToast('请输入回复内容')
    return
  }

  replySubmitting.value = true
  
  try {
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}')
    
    const data = {
      questionId: parseInt(route.params.id),
      userId: userInfo.userId || 1,
      content: replyContent.value
    }
    
    await replyApi.add(data)
    showToast('回复成功，等待审核！')
    replyContent.value = ''
    // 重新加载回复列表
    await loadReplies()
  } catch (error) {
    showToast(error.message || '回复失败')
  } finally {
    replySubmitting.value = false
  }
}

onMounted(() => {
  loadQuestionDetail()
  loadReplies()
})
</script>

<style scoped>
.detail-page {
  min-height: 100vh;
  background: #f5f6fa;
  padding-bottom: 80px;
}

.question-content {
  margin: 12px;
  background: #fff;
  border-radius: 12px;
  padding: 16px;
}

.question-content .title {
  font-size: 18px;
  font-weight: bold;
  color: #333;
  line-height: 1.6;
}

.question-content .meta {
  margin: 12px 0;
  font-size: 13px;
  color: #999;
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.question-content .meta .category {
  background: #ecf5ff;
  color: #1989fa;
  padding: 2px 10px;
  border-radius: 10px;
}

.question-content .body {
  font-size: 15px;
  color: #444;
  line-height: 1.8;
  margin: 12px 0;
}

.question-content .stats {
  display: flex;
  gap: 20px;
  font-size: 13px;
  color: #999;
  padding-top: 12px;
  border-top: 1px solid #f0f0f0;
}

.reply-section {
  margin: 12px;
  background: #fff;
  border-radius: 12px;
  padding: 0 16px;
}

.section-header {
  padding: 14px 0;
  font-size: 15px;
  font-weight: bold;
  border-bottom: 1px solid #f0f0f0;
}

.empty-reply {
  padding: 40px 0;
  text-align: center;
  color: #999;
  font-size: 14px;
}

.reply-input-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #fff;
  padding: 8px 12px;
  padding-bottom: env(safe-area-inset-bottom);
  display: flex;
  align-items: flex-end;
  gap: 10px;
  border-top: 1px solid #eee;
  z-index: 100;
}

.reply-input-bar .reply-field {
  flex: 1;
  background: #f5f6fa;
  border-radius: 20px;
  padding: 4px 12px;
}
</style>