<template>
  <div class="ai-ask-page">
    <!-- 头部 -->
    <van-nav-bar
      title="新生智能问答"
      left-text="返回"
      left-arrow
      @click-left="$router.back()"
    />

    <!-- 聊天区域 -->
    <div class="chat-area" ref="chatAreaRef">
      <div 
        v-for="(msg, index) in messages" 
        :key="index"
        class="message"
        :class="msg.role"
      >
        <div class="avatar">
          <img :src="msg.role === 'user' ? userAvatar : aiAvatar" />
        </div>
        <div class="bubble">
          <div class="content">{{ msg.content }}</div>
          <div class="time">{{ msg.time }}</div>
        </div>
      </div>
      
      <!-- 热门问题 -->
      <div v-if="messages.length === 1" class="hot-questions">
        <div class="title">💡 热门问题</div>
        <div 
          v-for="(answer, question) in hotQuestions" 
          :key="question"
          class="hot-item"
          @click="askQuestion(question)"
        >
          {{ question }}
        </div>
      </div>
    </div>

    <!-- 底部输入框 -->
    <div class="input-bar">
      <van-field
        v-model="inputQuestion"
        placeholder="输入你的问题..."
        type="textarea"
        autosize
        maxlength="200"
        class="input-field"
        @keyup.enter="sendQuestion"
      />
      <van-button 
        type="primary" 
        size="small" 
        @click="sendQuestion"
        :loading="loading"
      >
        发送
      </van-button>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick } from 'vue'
import { showToast } from 'vant'

const chatAreaRef = ref(null)
const inputQuestion = ref('')
const loading = ref(false)
const userAvatar = 'https://picsum.photos/40/40?random=1'
const aiAvatar = 'https://picsum.photos/40/40?random=2'

const messages = ref([
  {
    role: 'ai',
    content: '👋 你好！我是新生智能助手，有什么问题可以问我哦～',
    time: getCurrentTime()
  }
])

const hotQuestions = ref({
  '宿舍怎么样？': '',
  '军训多久？': '',
  '怎么选课？': '',
  '食堂好吃吗？': ''
})

// 发送问题到后端 AI
const sendQuestion = async () => {
  const question = inputQuestion.value.trim()
  if (!question) {
    showToast('请输入问题')
    return
  }

  messages.value.push({
    role: 'user',
    content: question,
    time: getCurrentTime()
  })
  inputQuestion.value = ''
  loading.value = true

  await nextTick()
  scrollToBottom()

  try {
    console.log('📤 发送请求:', question)
    
    const response = await fetch('http://localhost:8080/api/ai/ask', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ question })
    })
    
    console.log('📥 响应状态:', response.status)
    const result = await response.json()
    console.log('📥 响应数据:', result)
    
    let answer = ''
    if (result.code === 200 && result.data) {
      answer = result.data.answer
    } else {
      answer = result.msg || 'AI 暂时无法回答，请稍后再试'
    }
    
    messages.value.push({
      role: 'ai',
      content: answer,
      time: getCurrentTime()
    })
  } catch (error) {
    console.error('❌ 请求失败:', error)
    messages.value.push({
      role: 'ai',
      content: '❌ 连接失败，请检查后端是否启动 (http://localhost:8080)',
      time: getCurrentTime()
    })
  } finally {
    loading.value = false
    await nextTick()
    scrollToBottom()
  }
}

const askQuestion = (question) => {
  inputQuestion.value = question
  sendQuestion()
}

const scrollToBottom = () => {
  if (chatAreaRef.value) {
    chatAreaRef.value.scrollTop = chatAreaRef.value.scrollHeight
  }
}

function getCurrentTime() {
  const now = new Date()
  return now.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
}
</script>

<style scoped>
.ai-ask-page {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f5f6fa;
}

.chat-area {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  padding-bottom: 80px;
}

.message {
  display: flex;
  margin-bottom: 16px;
  gap: 10px;
}

.message.user {
  flex-direction: row-reverse;
}

.message .avatar {
  width: 40px;
  height: 40px;
  flex-shrink: 0;
}

.message .avatar img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
}

.message .bubble {
  max-width: 70%;
  padding: 12px 16px;
  border-radius: 12px;
  word-wrap: break-word;
}

.message.ai .bubble {
  background: #fff;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
}

.message.user .bubble {
  background: #1989fa;
  color: #fff;
}

.message .bubble .content {
  font-size: 15px;
  line-height: 1.6;
  white-space: pre-wrap;
}

.message .bubble .time {
  font-size: 11px;
  color: #999;
  margin-top: 6px;
  text-align: right;
}

.message.user .bubble .time {
  color: rgba(255,255,255,0.7);
}

.hot-questions {
  background: #fff;
  border-radius: 12px;
  padding: 16px;
  margin-top: 12px;
}

.hot-questions .title {
  font-size: 16px;
  font-weight: bold;
  color: #333;
  margin-bottom: 12px;
}

.hot-questions .hot-item {
  padding: 10px 14px;
  background: #f5f6fa;
  border-radius: 8px;
  margin-bottom: 8px;
  cursor: pointer;
  font-size: 14px;
  color: #333;
  transition: background 0.2s;
}

.hot-questions .hot-item:active {
  background: #e8ecf0;
}

.input-bar {
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

.input-bar .input-field {
  flex: 1;
  background: #f5f6fa;
  border-radius: 20px;
  padding: 4px 12px;
}
</style>