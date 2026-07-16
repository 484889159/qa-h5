<template>
  <div class="add-wall-page">
    <!-- 顶部导航 -->
    <van-nav-bar
      title="添加墙墙"
      left-text="返回"
      left-arrow
      @click-left="$router.back()"
    />

    <!-- 二维码展示 -->
    <div class="qr-container">
      <div class="qr-title">📱 扫码添加墙墙</div>
      <div class="qr-wrapper">
        <img :src="qrImage" alt="二维码" class="qr-image" />
      </div>
      <div class="qr-desc">长按识别二维码添加墙墙</div>
      <div class="qr-tips">
        <div class="tip-item">💬 分享校园生活</div>
        <div class="tip-item">📢 发布失物招领</div>
        <div class="tip-item">🎉 活动宣传推广</div>
        <div class="tip-item">❤️ 表白交友互助</div>
      </div>
    </div>

    <!-- 底部操作按钮 -->
    <div class="bottom-actions">
      <van-button type="primary" block @click="saveImage" class="save-btn">
        💾 保存二维码
      </van-button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'

const router = useRouter()

// ✅ 二维码图片路径（可替换成你自己的）
const qrImage = ref('/qrcode.png')

// 保存二维码
const saveImage = () => {
  // 创建下载链接
  const link = document.createElement('a')
  link.href = qrImage.value
  link.download = '墙墙二维码.png'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  showToast('✅ 保存成功')
}
</script>

<style scoped>
.add-wall-page {
  min-height: 100vh;
  background: #f5f6fa;
  padding-bottom: 20px;
}

.qr-container {
  margin: 20px 16px;
  background: #fff;
  border-radius: 16px;
  padding: 30px 20px;
  text-align: center;
  box-shadow: 0 2px 12px rgba(0,0,0,0.08);
}

.qr-title {
  font-size: 20px;
  font-weight: bold;
  color: #333;
  margin-bottom: 20px;
}

.qr-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 12px;
  margin-bottom: 16px;
}

.qr-image {
  width: 220px;
  height: 220px;
  object-fit: contain;
}

.qr-desc {
  font-size: 14px;
  color: #999;
  margin-bottom: 20px;
}

.qr-tips {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  margin-top: 8px;
}

.tip-item {
  background: #f0f7ff;
  color: #1989fa;
  padding: 10px 8px;
  border-radius: 8px;
  font-size: 13px;
}

.bottom-actions {
  padding: 0 16px;
  margin-top: 10px;
}

.save-btn {
  border-radius: 12px;
  height: 48px;
  font-size: 16px;
}
</style>