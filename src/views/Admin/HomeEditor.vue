<template>
  <div class="editor-page">
    <van-nav-bar
      title="首页内容管理"
      left-text="返回"
      left-arrow
      @click-left="$router.back()"
    />

    <!-- 密码验证 -->
    <div v-if="!isAuthorized" class="auth-section">
      <div class="auth-title">🔐 管理员验证</div>
      <van-field
        v-model="password"
        type="password"
        placeholder="请输入管理密码"
        @keyup.enter="verifyPassword"
      />
      <van-button type="primary" block @click="verifyPassword">验证身份</van-button>
      <div v-if="authError" class="auth-error">❌ 密码错误</div>
      <div class="remember-section">
        <van-checkbox v-model="rememberMe">记住登录状态</van-checkbox>
      </div>
    </div>

    <!-- 编辑区域 -->
    <div v-else class="edit-section">
      <!-- 管理员状态 -->
      <div class="admin-status">
        <span>✅ 管理员已登录</span>
        <span class="logout-btn" @click="logout">退出</span>
      </div>

      <!-- ✅ 网格管理 -->
      <div class="edit-card">
        <div class="edit-title">📌 功能网格</div>
        <div class="grid-editor">
          <div v-for="(item, index) in gridItems" :key="index" class="grid-edit-item">
            <div class="grid-edit-left">
              <span class="grid-index">{{ index + 1 }}</span>
              <van-field v-model="item.icon" class="icon-field" placeholder="图标" maxlength="2" />
              <van-field v-model="item.name" class="name-field" placeholder="名称" />
              <van-field v-model="item.path" class="path-field" placeholder="路径" />
            </div>
            <div class="grid-edit-right">
              <span class="action-btn" @click="moveGridUp(index)" v-if="index > 0">⬆</span>
              <span class="action-btn" @click="moveGridDown(index)" v-if="index < gridItems.length - 1">⬇</span>
              <span class="action-btn delete" @click="deleteGridItem(index)">🗑</span>
            </div>
          </div>
        </div>
        <van-button size="small" type="primary" @click="addGridItem">＋ 添加网格</van-button>
      </div>

      <!-- 二维码管理 -->
      <div class="edit-card">
        <div class="edit-title">📱 二维码卡片</div>
        <div class="header-actions">
          <span>共 {{ cardList.length }} 个卡片</span>
          <van-button type="primary" size="small" @click="addCard">＋ 新增</van-button>
        </div>

        <div v-for="(item, index) in cardList" :key="index" class="card-item">
          <div class="card-header">
            <span>#{{ index + 1 }}</span>
            <span class="delete-btn" @click="deleteCard(index)">🗑</span>
          </div>
          <van-field v-model="item.title" label="标题" placeholder="标题" />
          <van-field v-model="item.desc1" label="描述1" placeholder="描述1" />
          <van-field v-model="item.desc2" label="描述2" placeholder="描述2" />
          <van-field v-model="item.desc3" label="描述3" placeholder="描述3" />
          <van-field v-model="item.tip" label="提示" placeholder="如：👆 点击放大" />
          <van-uploader
            v-model="item.imageList"
            :max-count="1"
            accept="image/*"
            @after-read="(file) => uploadCardImage(file, index)"
          />
        </div>
      </div>

      <!-- 保存 -->
      <van-button type="primary" block @click="saveAll" :loading="saving">
        💾 保存所有修改
      </van-button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'

const router = useRouter()
const password = ref('')
const isAuthorized = ref(false)
const authError = ref(false)
const saving = ref(false)
const rememberMe = ref(true)

// ✅ 网格数据
const gridItems = ref([])
const defaultGrid = [
  { id: 1, name: '校园百科', icon: '🏫', path: '/' },
  { id: 2, name: '添加墙墙', icon: '➕', path: '/publish' },
  { id: 3, name: '众顺达驾校', icon: '🚗', path: '' },
  { id: 4, name: '核猫档案', icon: '📋', path: '/mine' },
  { id: 5, name: '查课表', icon: '📅', path: '/ai-ask' }
]

// 二维码数据
const cardList = ref([])

const defaultCard = {
  title: '📱 扫码关注',
  desc1: '获取更多新生资讯',
  desc2: '学长学姐在线答疑',
  desc3: '校园生活指南',
  tip: '👆 点击放大',
  image: '/qrcode.png',
  imageList: []
}

// ✅ 加载数据 - 使用 campus_modules_data
const loadData = () => {
  // 加载网格 - 统一使用 campus_modules_data
  const savedGrid = localStorage.getItem('campus_modules_data')
  if (savedGrid) {
    try {
      const parsed = JSON.parse(savedGrid)
      if (parsed.length > 0) {
        gridItems.value = parsed
      } else {
        gridItems.value = defaultGrid
      }
    } catch (e) {
      gridItems.value = defaultGrid
    }
  } else {
    gridItems.value = defaultGrid
  }

  // 加载卡片
  const savedCards = localStorage.getItem('home_cards_data')
  if (savedCards) {
    try {
      cardList.value = JSON.parse(savedCards)
    } catch (e) {
      cardList.value = [{ ...defaultCard, imageList: [] }]
    }
  } else {
    cardList.value = [{ ...defaultCard, imageList: [] }]
  }
}

// 验证密码
const verifyPassword = () => {
  if (password.value === 'admin123') {
    isAuthorized.value = true
    authError.value = false
    if (rememberMe.value) localStorage.setItem('admin_token', 'logged_in')
    showToast('✅ 验证成功')
    loadData()
  } else {
    authError.value = true
    showToast('❌ 密码错误')
  }
}

const checkAuth = () => {
  if (localStorage.getItem('admin_token') === 'logged_in') {
    isAuthorized.value = true
    loadData()
  }
}

const logout = () => {
  localStorage.removeItem('admin_token')
  isAuthorized.value = false
  showToast('已退出')
}

// 网格操作
const addGridItem = () => {
  const newId = Date.now()
  gridItems.value.push({ id: newId, name: '新功能', icon: '📌', path: '/' })
  showToast('✅ 已添加')
}

const deleteGridItem = (index) => {
  if (gridItems.value.length <= 1) {
    showToast('至少保留一个')
    return
  }
  gridItems.value.splice(index, 1)
  showToast('🗑 已删除')
}

const moveGridUp = (index) => {
  if (index > 0) {
    const temp = gridItems.value[index]
    gridItems.value[index] = gridItems.value[index - 1]
    gridItems.value[index - 1] = temp
  }
}

const moveGridDown = (index) => {
  if (index < gridItems.value.length - 1) {
    const temp = gridItems.value[index]
    gridItems.value[index] = gridItems.value[index + 1]
    gridItems.value[index + 1] = temp
  }
}

// 卡片操作
const addCard = () => {
  cardList.value.push({
    title: '📱 扫码关注',
    desc1: '请输入描述',
    desc2: '请输入描述',
    desc3: '请输入描述',
    tip: '👆 点击放大',
    image: '/qrcode.png',
    imageList: []
  })
  showToast('✅ 已添加卡片')
}

const deleteCard = (index) => {
  if (cardList.value.length <= 1) {
    showToast('至少保留一个')
    return
  }
  cardList.value.splice(index, 1)
  showToast('🗑 已删除')
}

const uploadCardImage = (file, index) => {
  const reader = new FileReader()
  reader.onload = (e) => {
    cardList.value[index].image = e.target.result
    showToast('✅ 图片已上传')
  }
  reader.readAsDataURL(file.file)
}

// ✅ 保存所有 - 统一使用 campus_modules_data
const saveAll = () => {
  saving.value = true
  try {
    // 保存网格数据 - 使用 campus_modules_data
    localStorage.setItem('campus_modules_data', JSON.stringify(gridItems.value))
    // 保存卡片数据
    const dataToSave = cardList.value.map(({ imageList, ...rest }) => rest)
    localStorage.setItem('home_cards_data', JSON.stringify(dataToSave))
    showToast('✅ 全部保存成功！')
  } catch (e) {
    showToast('❌ 保存失败')
  } finally {
    saving.value = false
  }
}

onMounted(() => checkAuth())
</script>

<style scoped>
.editor-page {
  min-height: 100vh;
  background: #f5f6fa;
  padding: 16px;
  padding-bottom: 80px;
}

.auth-section {
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  margin-top: 20px;
}

.auth-title {
  font-size: 20px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 20px;
}

.auth-error {
  color: #ee0a24;
  text-align: center;
  margin-top: 12px;
}

.remember-section {
  margin-top: 16px;
  padding-top: 12px;
  border-top: 1px solid #f0f0f0;
}

.admin-status {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #e8f5e9;
  border-radius: 8px;
  padding: 10px 16px;
  margin-bottom: 16px;
  font-size: 14px;
  color: #2e7d32;
}

.logout-btn {
  color: #ee0a24;
  cursor: pointer;
  font-weight: bold;
}

.edit-section {
  margin-top: 16px;
}

.edit-card {
  background: #fff;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 16px;
}

.edit-title {
  font-size: 16px;
  font-weight: bold;
  color: #333;
  margin-bottom: 12px;
  padding-bottom: 12px;
  border-bottom: 1px solid #f0f0f0;
}

/* 网格编辑 */
.grid-editor {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.grid-edit-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f5f6fa;
  border-radius: 8px;
  padding: 8px 12px;
}

.grid-edit-left {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
}

.grid-index {
  font-weight: bold;
  color: #1989fa;
  font-size: 14px;
  min-width: 24px;
}

.icon-field {
  width: 50px;
}
.name-field {
  flex: 1;
}
.path-field {
  flex: 0.8;
  min-width: 100px;
}

.grid-edit-right {
  display: flex;
  gap: 4px;
}

/* 卡片列表 */
.header-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.card-item {
  background: #f5f6fa;
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 12px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.delete-btn {
  color: #ee0a24;
  cursor: pointer;
}

.action-btn {
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  background: #e8ecf0;
  font-size: 14px;
}

.action-btn.delete:active {
  background: #ff6b6b;
  color: #fff;
}

:deep(.van-field) {
  padding: 4px 0;
}
</style>