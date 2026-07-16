<template>
  <div class="index-page">
    <!-- 顶部 -->
    <div class="header">
      <div class="header-top">
        <div class="logo">🏫 肇医新生解惑平台</div>
        <div class="header-right">
          <span class="icon-btn" @click="addWall">➕</span>
        </div>
      </div>
    </div>

    <!-- 功能网格 - 从 localStorage 读取 -->
    <div class="grid-nav">
      <div 
        v-for="item in moduleList" 
        :key="item.id"
        class="grid-item"
        @click="handleGridClick(item)"
      >
        <div class="grid-icon">
          <img v-if="item.image" :src="item.image" class="grid-img" />
          <span v-else>{{ item.icon || '📌' }}</span>
        </div>
        <div class="grid-name">{{ item.name }}</div>
      </div>
    </div>

    <!-- AI 智能问答入口 -->
    <div class="ai-entry" @click="goToAIAsk">
      <div class="ai-entry-content">
        <span class="ai-icon">🤖</span>
        <div class="ai-text">
          <span class="ai-title">新生智能问答</span>
          <span class="ai-desc">有问题随时问，AI 帮你解答</span>
        </div>
        <span class="ai-arrow">→</span>
      </div>
    </div>

    <!-- 二维码卡片 -->
    <div class="qr-section" v-for="(item, index) in cardList" :key="index">
      <div class="qr-card" @click="openQRPopup(item)">
        <div class="qr-left">
          <img :src="item.image || '/qrcode.png'" alt="二维码" class="qr-code" />
        </div>
        <div class="qr-right">
          <div class="qr-title">{{ item.title || '📱 扫码关注' }}</div>
          <div class="qr-desc">{{ item.desc1 || '' }}</div>
          <div class="qr-desc">{{ item.desc2 || '' }}</div>
          <div class="qr-desc">{{ item.desc3 || '' }}</div>
          <div class="qr-tip">{{ item.tip || '👆 点击放大' }}</div>
        </div>
      </div>
    </div>

    <!-- 问答列表 -->
    <div class="section">
      <div 
        v-for="item in questionList" 
        :key="item.id" 
        class="question-card"
        @click="goToDetail(item.id)"
      >
        <div class="card-title">{{ item.title }}</div>
        <div class="card-footer">
          <span class="category">{{ item.categoryName || '未分类' }}</span>
          <span>{{ item.nickname || '匿名' }}</span>
          <span>💬 {{ item.replyCount || 0 }}</span>
        </div>
      </div>
    </div>

    <!-- 底部导航 -->
    <van-tabbar v-model="active">
      <van-tabbar-item icon="wap-home">首页</van-tabbar-item>
    </van-tabbar>

    <!-- 二维码放大弹窗 -->
    <van-overlay :show="showQRPopup" @click="showQRPopup = false">
      <div class="qr-overlay" @click.stop>
        <div class="qr-modal">
          <div class="qr-close" @click="showQRPopup = false">✕</div>
          <img :src="currentQR?.image || '/qrcode.png'" alt="二维码" class="qr-big" />
          <div class="qr-modal-title">{{ currentQR?.title || '📱 扫码关注我们' }}</div>
          <div class="qr-modal-desc">{{ currentQR?.desc1 || '获取更多新生资讯和校园指南' }}</div>
        </div>
      </div>
    </van-overlay>

    <!-- 管理入口 -->
    <div class="admin-entry" @click="goToAdmin">⚙️</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'

const router = useRouter()
const active = ref(0)
const searchKeyword = ref('')
const questionList = ref([])

// ========== 模块数据（从 localStorage 读取） ==========
const moduleList = ref([])

// 默认模块数据
const defaultModules = [
  { 
    id: 1, 
    icon: '🏫', 
    name: '校园百科', 
    desc: '新生入学指南', 
    path: '/', 
    views: 4998, 
    likes: 256,
    image: ''
  },
  { 
    id: 2, 
    icon: '➕', 
    name: '添加墙墙', 
    desc: '发布动态分享', 
    path: '/add-wall',  // ✅ 改成 /add-wall
    views: 3210, 
    likes: 189,
    image: ''
  },
  { 
    id: 3, 
    icon: '🚗', 
    name: '众顺达驾校', 
    desc: '学车报名咨询', 
    path: '', 
    views: 1200, 
    likes: 67,
    image: ''
  },
  { 
    id: 4, 
    icon: '📋', 
    name: '核猫档案', 
    desc: '校园档案查询', 
    path: '/mine', 
    views: 856, 
    likes: 43,
    image: ''
  },
  { 
    id: 5, 
    icon: '📅', 
    name: '查课表', 
    desc: '课程安排查询', 
    path: '/ai-ask', 
    views: 2340, 
    likes: 178,
    image: ''
  }
]

// 加载模块数据
const loadModuleData = () => {
  const saved = localStorage.getItem('campus_modules_data')
  if (saved) {
    try {
      const parsed = JSON.parse(saved)
      if (parsed.length > 0) {
        moduleList.value = parsed
        return
      }
    } catch (e) {}
  }
  moduleList.value = defaultModules
}

// ========== 二维码卡片数据 ==========
const cardList = ref([])

// 加载卡片数据
const loadCards = () => {
  const saved = localStorage.getItem('home_cards_data')
  if (saved) {
    try {
      cardList.value = JSON.parse(saved)
    } catch (e) {
      cardList.value = [{
        title: '📱 扫码关注',
        desc1: '获取更多新生资讯',
        desc2: '学长学姐在线答疑',
        desc3: '校园生活指南',
        tip: '👆 点击放大',
        image: '/qrcode.png'
      }]
    }
  } else {
    cardList.value = [{
      title: '📱 扫码关注',
      desc1: '获取更多新生资讯',
      desc2: '学长学姐在线答疑',
      desc3: '校园生活指南',
      tip: '👆 点击放大',
      image: '/qrcode.png'
    }]
  }
}

// ========== 弹窗控制 ==========
const showQRPopup = ref(false)
const currentQR = ref(null)

// 打开二维码弹窗
const openQRPopup = (item) => {
  currentQR.value = item
  showQRPopup.value = true
}

// ========== 点击事件 ==========

// 点击网格项
// 点击网格项
const handleGridClick = (item) => {
  // ✅ 如果没有路径，或者路径是 '/' 或空，显示"即将上线"
  if (!item.path || item.path === '/' || item.path === '') {
    showToast('🚀 即将上线: ' + item.name)
    return
  }
  
  // 判断外部链接
  if (item.path.startsWith('http')) {
    window.location.href = item.path
    return
  }
  
  // 跳转内部页面
  router.push(item.path)
}

// 搜索
const goToSearch = () => {
  showToast('🔍 搜索功能')
}

// ✅ 右上角 ➕ - 跳转到添加墙墙页面
const addWall = () => {
  router.push('/add-wall')  // 
}

// 跳转详情
const goToDetail = (id) => {
  router.push(`/detail/${id}`)
}

// 跳转AI问答
const goToAIAsk = () => {
  router.push('/ai-ask')
}

// 跳转管理后台
const goToAdmin = () => {
  router.push('/admin/home-editor')
}

// ========== 生命周期 ==========
onMounted(() => {
  loadModuleData()
  loadCards()
  console.log('🏫 校园百科首页加载')
})
</script>

<style scoped>
.index-page {
  padding-bottom: 60px;
  background: #f5f6fa;
  min-height: 100vh;
}

/* ===== 顶部 ===== */
.header {
  background: linear-gradient(135deg, #1989fa, #07c160);
  padding: 16px 16px 12px;
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  color: #fff;
  font-size: 20px;
  font-weight: bold;
}

.header-right {
  display: flex;
  gap: 16px;
  align-items: center;
}

.icon-btn {
  color: #fff;
  font-size: 18px;
  cursor: pointer;
  padding: 4px;
}

/* ===== 功能网格 ===== */
.grid-nav {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 8px;
  padding: 12px 12px 8px;
  background: #fff;
  margin: 0 12px 8px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
}

.grid-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 8px 4px;
  cursor: pointer;
  border-radius: 8px;
  transition: background 0.2s;
}

.grid-item:active {
  background: #f0f0f0;
}

.grid-icon {
  font-size: 28px;
  margin-bottom: 4px;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.grid-img {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  object-fit: cover;
}

.grid-name {
  font-size: 11px;
  color: #333;
  text-align: center;
  line-height: 1.2;
}

/* ===== AI 入口 ===== */
.ai-entry {
  margin: 8px 12px 4px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 12px;
  padding: 2px;
  cursor: pointer;
  transition: transform 0.2s;
}

.ai-entry:active {
  transform: scale(0.98);
}

.ai-entry-content {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  background: #fff;
  border-radius: 10px;
  gap: 12px;
}

.ai-entry .ai-icon {
  font-size: 28px;
  flex-shrink: 0;
}

.ai-entry .ai-text {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.ai-entry .ai-title {
  font-size: 15px;
  font-weight: bold;
  color: #333;
}

.ai-entry .ai-desc {
  font-size: 12px;
  color: #999;
}

.ai-entry .ai-arrow {
  font-size: 18px;
  color: #ccc;
  flex-shrink: 0;
}

/* ===== 二维码卡片 ===== */
.qr-section {
  margin: 8px 12px;
  cursor: pointer;
}

.qr-card {
  display: flex;
  align-items: center;
  background: #fff;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  gap: 16px;
  transition: transform 0.2s;
}

.qr-card:active {
  transform: scale(0.98);
}

.qr-left .qr-code {
  width: 100px;
  height: 100px;
  border-radius: 8px;
  background: #f0f0f0;
  object-fit: cover;
}

.qr-right {
  flex: 1;
}

.qr-title {
  font-size: 17px;
  font-weight: bold;
  color: #333;
  margin-bottom: 6px;
}

.qr-desc {
  font-size: 14px;
  color: #666;
  line-height: 1.8;
}

.qr-tip {
  font-size: 12px;
  color: #999;
  margin-top: 4px;
}

/* ===== 问答列表 ===== */
.section {
  margin: 12px 12px 0;
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  padding: 0 12px;
}

.question-card {
  padding: 14px 4px;
  border-bottom: 1px solid #f5f6fa;
  cursor: pointer;
}

.question-card:last-child {
  border-bottom: none;
}

.question-card .card-title {
  font-size: 15px;
  color: #333;
  margin-bottom: 8px;
}

.question-card .card-footer {
  font-size: 13px;
  color: #999;
  display: flex;
  gap: 12px;
}

.question-card .card-footer .category {
  background: #ecf5ff;
  color: #1989fa;
  padding: 0 8px;
  border-radius: 4px;
}

/* ===== 二维码弹窗 ===== */
.van-overlay {
  z-index: 999;
}

.qr-overlay {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  padding: 32px;
}

.qr-modal {
  background: #fff;
  border-radius: 16px;
  padding: 32px 24px 24px;
  text-align: center;
  max-width: 400px;
  width: 100%;
  position: relative;
  animation: zoomIn 0.3s ease;
}

.qr-close {
  position: absolute;
  top: 12px;
  right: 16px;
  font-size: 24px;
  color: #999;
  cursor: pointer;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background 0.2s;
}

.qr-close:active {
  background: #f0f0f0;
}

.qr-big {
  width: 200px;
  height: 200px;
  border-radius: 12px;
  margin: 8px auto 16px;
  background: #f0f0f0;
  object-fit: cover;
}

.qr-modal-title {
  font-size: 20px;
  font-weight: bold;
  color: #333;
  margin-bottom: 8px;
}

.qr-modal-desc {
  font-size: 14px;
  color: #999;
}

@keyframes zoomIn {
  from {
    transform: scale(0.8);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

/* ===== 管理入口 ===== */
.admin-entry {
  position: fixed;
  bottom: 80px;
  right: 12px;
  width: 32px;
  height: 32px;
  background: rgba(0,0,0,0.06);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  cursor: pointer;
  opacity: 0.3;
  z-index: 50;
  transition: opacity 0.2s;
}

.admin-entry:active {
  opacity: 1;
  transform: scale(0.9);
}
</style>