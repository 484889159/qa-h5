import { get, post, put, del } from '@/utils/request'

// ========== 用户相关 ==========
export const userApi = {
  // 登录
  login: (data) => post('/api/user/login', data),
  
  // 获取用户信息
  getUserInfo: () => get('/api/user/info'),
}

// ========== 分类相关 ==========
export const categoryApi = {
  // 获取分类列表
  getList: () => get('/api/category/list'),
}

// ========== 问题相关 ==========
export const questionApi = {
  // 发布问题
  add: (data) => post('/api/question/add', data),
  
  // 获取问题列表
  getList: (params) => get('/api/question/list', params),
  
  // 获取问题详情
  getDetail: (id) => get(`/api/question/detail/${id}`),
  
  // 审核问题（管理员）
  updateStatus: (data) => put('/api/question/status', data),
  
  // 删除问题
  delete: (id) => del(`/api/question/${id}`),
  
  // 置顶问题
  pin: (data) => put('/api/question/pin', data),
}

// ========== 回复相关 ==========
export const replyApi = {
  // 回复问题
  add: (data) => post('/api/reply/add', data),
  
  // 获取回复列表
  getList: (questionId) => get(`/api/reply/list/${questionId}`),
  
  // 审核回复（管理员）
  updateStatus: (data) => put('/api/reply/status', data),
  
  // 删除回复
  delete: (id) => del(`/api/reply/${id}`),
}