<template>
  <div class="editor-page">
    <van-nav-bar
      title="模块内容管理"
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
      <div class="admin-status">
        <span>✅ 管理员已登录</span>
        <span class="logout-btn" @click="logout">退出</span>
      </div>

      <!-- ✅ 模块列表 -->
      <div class="edit-card">
        <div class="edit-title">📌 模块管理</div>
        <div class="header-actions">
          <span>共 {{ moduleList.length }} 个模块</span>
          <van-button type="primary" size="small" @click="addModule">＋ 新增</van-button>
        </div>

        <div v-for="(item, index) in moduleList" :key="index" class="module-item">
          <div class="module-header">
            <span class="module-index">#{{ index + 1 }}</span>
            <div class="module-actions">
              <span class="action-btn" @click="moveUp(index)" v-if="index > 0">⬆</span>
              <span class="action-btn" @click="moveDown(index)" v-if="index < moduleList.length - 1">⬇</span>
              <span class="action-btn delete" @click="deleteModule(index)">🗑</span>
            </div>
          </div>

          <!-- 图标 -->
          <van-field v-model="item.icon" label="图标" placeholder="如：📖" maxlength="2" />
          
          <!-- 名称 -->
          <van-field v-model="item.name" label="名称" placeholder="请输入模块名称" />
          
          <!-- 描述 -->
          <van-field v-model="item.desc" label="描述" placeholder="请输入描述文字" />
          
          <!-- 跳转路径 -->
          <van-field v-model="item.path" label="跳转路径" placeholder="如：/publish 或 https://xxx.com" />
          
          <!-- 浏览数 -->
          <van-field v-model.number="item.views" label="浏览数" type="number" placeholder="0" />
          
          <!-- 点赞数 -->
          <van-field v-model.number="item.likes" label="点赞数" type="number" placeholder="0" />

          <!-- ✅ 图片上传 -->
          <div class="upload-section">
            <div class="upload-label">📷 模块图片</div>
            <div class="upload-wrapper">
              <img 
                v-if="item.image" 
                :src="item.image" 
                class="preview-image" 
              />
              <div v-else class="placeholder-image">无图片</div>
              <van-uploader
                v-model="item.imageList"
                :max-count="1"
                accept="image/*"
                @after-read="(file) => uploadImage(file, index)"
              />
            </div>
            <div class="upload-hint">点击上传图片，支持 JPG/PNG</div>
          </div>
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

// ========== 模块数据 ==========
const moduleList = ref([])

// 默认数据
const defaultModules = [
  { 
    id: 1, 
    icon: '🏫', 
    name: '校园百科', 
    desc: '新生入学指南、校园生活攻略', 
    path: '/', 
    views: 4998, 
    likes: 256,
    image: ''
  },
  { 
    id: 2, 
    icon: '➕', 
    name: '添加墙墙', 
    desc: '发布动态、分享生活', 
    path: '/publish', 
    views: 3210, 
    likes: 189,
    image: ''
  },
  { 
    id: 3, 
    icon: '🚗', 
    name: '众顺达驾校', 
    desc: '学车报名、驾考咨询', 
    path: '', 
    views: 1200, 
    likes: 67,
    image: ''
  },
  { 
    id: 4, 
    icon: '📋', 
    name: '核猫档案', 
    desc: '查看个人信息、校园档案', 
    path: '/mine', 
    views: 856, 
    likes: 43,
    image: ''
  },
  { 
    id: 5, 
    icon: '📅', 
    name: '查课表', 
    desc: '查看课程安排、考试时间', 
    path: '/ai-ask', 
    views: 2340, 
    likes: 178,
    image: ''
  }
]

// 加载数据
const loadData = () => {
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

// 新增模块
const addModule = () => {
  moduleList.value.push({
    id: Date.now(),
    icon: '📌',
    name: '新模块',
    desc: '请输入描述',
    path: '/',
    views: 0,
    likes: 0,
    image: '',
    imageList: []
  })
  showToast('✅ 已添加新模块')
}

// 删除模块
const deleteModule = (index) => {
  if (moduleList.value.length <= 1) {
    showToast('至少保留一个模块')
    return
  }
  moduleList.value.splice(index, 1)
  showToast('🗑 已删除')
}

// 上移
const moveUp = (index) => {
  if (index > 0) {
    const temp = moduleList.value[index]
    moduleList.value[index] = moduleList.value[index - 1]
    moduleList.value[index - 1] = temp
  }
}

// 下移
const moveDown = (index) => {
  if (index < moduleList.value.length - 1) {
    const temp = moduleList.value[index]
    moduleList.value[index] = moduleList.value[index + 1]
    moduleList.value[index + 1] = temp
  }
}

// ✅ 上传图片
const uploadImage = (file, index) => {
  const reader = new FileReader()
  reader.onload = (e) => {
    moduleList.value[index].image = e.target.result
    showToast('✅ 图片上传成功')
  }
  reader.readAsDataURL(file.file)
}

// ✅ 保存所有
const saveAll = () => {
  saving.value = true
  try {
    const dataToSave = moduleList.value.map(({ imageList, ...rest }) => rest)
    localStorage.setItem('campus_modules_data', JSON.stringify(dataToSave))
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

.header-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.module-item {
  background: #f5f6fa;
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 12px;
}

.module-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.module-index {
  font-weight: bold;
  color: #1989fa;
  font-size: 14px;
}

.module-actions {
  display: flex;
  gap: 4px;
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

/* 图片上传 */
.upload-section {
  padding: 12px 0;
  border-top: 1px solid #f0f0f0;
  margin-top: 8px;
}

.upload-label {
  font-size: 14px;
  color: #333;
  margin-bottom: 8px;
  font-weight: bold;
}

.upload-wrapper {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.preview-image {
  width: 80px;
  height: 80px;
  border-radius: 8px;
  object-fit: cover;
  border: 2px solid #e8ecf0;
}

.placeholder-image {
  width: 80px;
  height: 80px;
  border-radius: 8px;
  background: #e8ecf0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  color: #999;
}

.upload-hint {
  font-size: 12px;
  color: #999;
  margin-top: 8px;
}

:deep(.van-field) {
  padding: 4px 0;
}
</style>