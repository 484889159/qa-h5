<template>
  <div class="mine-page">
    <div class="user-info">
      <div class="avatar">
        <img :src="userInfo.avatar || defaultAvatar" alt="avatar" />
      </div>
      <div class="info">
        <div class="name">{{ userInfo.nickname || '未登录' }}</div>
        <div class="desc">{{ userInfo.bio || '这个人很懒，什么都没写' }}</div>
      </div>
      <van-button size="small" plain type="primary" @click="handleLogin">
        {{ userInfo.id ? '编辑资料' : '去登录' }}
      </van-button>
    </div>

    <div class="stats">
      <div class="stat-item">
        <span class="num">{{ stats.questions }}</span>
        <span class="label">提问</span>
      </div>
      <div class="stat-item">
        <span class="num">{{ stats.replies }}</span>
        <span class="label">回复</span>
      </div>
      <div class="stat-item">
        <span class="num">{{ stats.likes }}</span>
        <span class="label">获赞</span>
      </div>
    </div>

    <van-tabs v-model:active="activeTab">
      <van-tab title="我的提问">
        <div v-for="item in myQuestions" :key="item.id" class="list-item">
          <div class="item-title">{{ item.title }}</div>
          <div class="item-meta">💬 {{ item.replyCount || 0 }} 回复</div>
        </div>
        <div v-if="myQuestions.length === 0" class="empty-state">
          <van-empty description="还没有提问" />
        </div>
      </van-tab>
      <van-tab title="我的回复">
        <div v-for="reply in myReplies" :key="reply.id" class="list-item">
          <div class="item-title">{{ reply.content }}</div>
          <div class="item-meta">{{ reply.createTime }}</div>
        </div>
        <div v-if="myReplies.length === 0" class="empty-state">
          <van-empty description="还没有回复" />
        </div>
      </van-tab>
    </van-tabs>

    <van-tabbar v-model="activeTabbar">
      <van-tabbar-item icon="wap-home" @click="$router.push('/')">首页</van-tabbar-item>
      <van-tabbar-item icon="plus" @click="$router.push('/publish')">发布</van-tabbar-item>
      <van-tabbar-item icon="user-o">我的</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { showToast } from 'vant'

const activeTab = ref(0)
const activeTabbar = ref(2)
const defaultAvatar = 'https://picsum.photos/80/80?random=1'

const userInfo = reactive({
  id: null,
  nickname: '未登录',
  avatar: '',
  bio: ''
})

const stats = reactive({
  questions: 0,
  replies: 0,
  likes: 0
})

const myQuestions = ref([])
const myReplies = ref([])

const handleLogin = () => {
  showToast('请先登录')
}

onMounted(() => {
  const stored = localStorage.getItem('userInfo')
  if (stored) {
    try {
      Object.assign(userInfo, JSON.parse(stored))
    } catch (e) {}
  }
})
</script>

<style scoped>
.mine-page {
  min-height: 100vh;
  background: #f5f6fa;
  padding-bottom: 60px;
}

.user-info {
  background: linear-gradient(135deg, #1989fa, #07c160);
  padding: 30px 20px 24px;
  display: flex;
  align-items: center;
  gap: 16px;
  color: #fff;
}

.user-info .avatar img {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  border: 3px solid rgba(255,255,255,0.4);
  object-fit: cover;
}

.user-info .info {
  flex: 1;
}

.user-info .name {
  font-size: 18px;
  font-weight: bold;
}

.user-info .desc {
  font-size: 13px;
  opacity: 0.85;
}

.stats {
  display: flex;
  background: #fff;
  margin: -12px 12px 12px;
  border-radius: 12px;
  padding: 16px 0;
}

.stat-item {
  flex: 1;
  text-align: center;
}

.stat-item .num {
  display: block;
  font-size: 22px;
  font-weight: bold;
  color: #333;
}

.stat-item .label {
  font-size: 13px;
  color: #999;
}

.list-item {
  padding: 14px 16px;
  border-bottom: 1px solid #f0f0f0;
  background: #fff;
}

.list-item .item-title {
  font-size: 15px;
  color: #333;
}

.list-item .item-meta {
  font-size: 13px;
  color: #999;
  margin-top: 4px;
}

.empty-state {
  padding: 40px 0;
}
</style>