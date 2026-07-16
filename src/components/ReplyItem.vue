<template>
  <div class="reply-item">
    <div class="reply-header">
      <img :src="reply.avatar || defaultAvatar" class="avatar" />
      <span class="author">{{ reply.author }}</span>
      <span class="time">{{ reply.time }}</span>
    </div>
    <div class="reply-body">{{ reply.content }}</div>
    <div class="reply-actions">
      <span class="like" @click="toggleLike">
        👍 {{ reply.likeCount }}
      </span>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  reply: {
    type: Object,
    required: true
  }
})

const defaultAvatar = 'https://picsum.photos/40/40?random=999'

const toggleLike = () => {
  props.reply.likeCount += 1
  console.log('点赞成功')
}
</script>

<style scoped>
.reply-item {
  padding: 14px 0;
  border-bottom: 1px solid #f5f6fa;
}

.reply-item:last-child {
  border-bottom: none;
}

.reply-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
}

.reply-header .avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
}

.reply-header .author {
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

.reply-header .time {
  font-size: 12px;
  color: #bbb;
  margin-left: auto;
}

.reply-body {
  font-size: 14px;
  color: #444;
  line-height: 1.6;
  padding-left: 42px;
}

.reply-actions {
  padding-left: 42px;
  margin-top: 8px;
}

.reply-actions .like {
  font-size: 13px;
  color: #999;
  cursor: pointer;
}
</style>