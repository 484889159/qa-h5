<template>
  <div class="publish-page">
    <van-nav-bar
      title="发布问题"
      left-text="取消"
      @click-left="$router.back()"
    >
      <template #right>
        <van-button type="primary" size="small" :loading="submitting" @click="onSubmit">
          发布
        </van-button>
      </template>
    </van-nav-bar>

    <div class="form-content">
      <!-- 分类选择 -->
      <van-field
        v-model="form.categoryName"
        is-link
        readonly
        label="分类"
        placeholder="请选择问题分类"
        @click="showCategoryPicker = true"
      />
      
      <van-field
        v-model="form.title"
        label="标题"
        placeholder="请输入问题标题（20字以内）"
        maxlength="20"
        show-word-limit
      />

      <van-field
        v-model="form.content"
        label="内容"
        placeholder="请详细描述你的问题..."
        type="textarea"
        rows="6"
        maxlength="500"
        show-word-limit
      />

      <van-cell center>
        <template #title>
          <span class="custom-title">匿名提问</span>
        </template>
        <template #right-icon>
          <van-switch v-model="form.isAnonymous" size="20px" active-color="#1989fa" />
        </template>
      </van-cell>
    </div>

    <!-- 分类选择器 -->
    <van-popup 
      v-model:show="showCategoryPicker" 
      position="bottom"
      round
    >
      <div style="background: #fff; border-radius: 16px 16px 0 0; padding: 16px 0;">
        <div style="text-align: center; font-size: 16px; font-weight: bold; color: #333; padding-bottom: 12px; border-bottom: 1px solid #eee; margin: 0 16px;">
          选择分类
        </div>
        <van-picker
          :columns="categoryOptions"
          @confirm="onCategoryConfirm"
          @cancel="showCategoryPicker = false"
        />
      </div>
    </van-popup>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'

const router = useRouter()
const submitting = ref(false)
const showCategoryPicker = ref(false)

const form = reactive({
  categoryId: null,
  categoryName: '',
  title: '',
  content: '',
  isAnonymous: false
})

// 分类选项
const categoryOptions = [
  { text: '推荐', value: 1 },
  { text: '技术', value: 2 },
  { text: '生活', value: 3 },
  { text: '情感', value: 4 },
  { text: '职场', value: 5 }
]

// ✅ 修复：selectedValues 返回的是值数组
const onCategoryConfirm = ({ selectedValues }) => {
  console.log('selectedValues:', selectedValues) // 输出: [4]
  
  if (selectedValues && selectedValues.length > 0) {
    const selectedValue = selectedValues[0] // 4
    // 根据值查找对应的分类
    const category = categoryOptions.find(item => item.value === selectedValue)
    if (category) {
      form.categoryName = category.text  // '推荐'
      form.categoryId = category.value   // 4
      console.log('选中:', form.categoryName, form.categoryId)
    }
  }
  showCategoryPicker.value = false
}

const onSubmit = async () => {
  if (!form.categoryId) {
    showToast('请选择分类')
    return
  }
  if (!form.title.trim()) {
    showToast('请输入标题')
    return
  }
  if (!form.content.trim()) {
    showToast('请输入内容')
    return
  }

  submitting.value = true
  try {
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}')
    const data = {
      userId: userInfo.userId || 1,
      categoryId: form.categoryId,
      title: form.title,
      content: form.content,
      isAnonymous: form.isAnonymous ? 1 : 0
    }
    console.log('发布数据:', data)
    showToast('发布成功！')
    setTimeout(() => router.push('/'), 500)
  } catch (error) {
    showToast('发布失败')
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
.publish-page {
  min-height: 100vh;
  background: #f5f6fa;
  padding-bottom: 20px;
}

.form-content {
  margin: 12px;
  background: #ffffff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.custom-title {
  font-size: 14px;
  color: #333;
}

:deep(.van-field) {
  background: #fff;
}

:deep(.van-cell) {
  background: #fff;
}

:deep(.van-picker) {
  background: #fff;
}
</style>