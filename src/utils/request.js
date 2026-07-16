import axios from 'axios'

const baseURL = 'https://qa-backend-production-a82f.up.railway.app'

const instance = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

instance.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => Promise.reject(error)
)

instance.interceptors.response.use(
  response => {
    const res = response.data
    if (res.code !== 200) {
      if (res.code === 401) {
        localStorage.removeItem('token')
        localStorage.removeItem('userInfo')
        window.location.href = '/login'
      }
      return Promise.reject(new Error(res.msg || '请求失败'))
    }
    return res.data
  },
  error => {
    console.error('请求错误:', error)
    return Promise.reject(error)
  }
)

// ✅ 导出所有方法
export const request = (url, data = {}, method = 'GET') => {
  return instance({
    url,
    method,
    [method === 'GET' ? 'params' : 'data']: data
  })
}

export const get = (url, params) => request(url, params, 'GET')
export const post = (url, data) => request(url, data, 'POST')
export const put = (url, data) => request(url, data, 'PUT')
export const del = (url, data) => request(url, data, 'DELETE')

export default instance