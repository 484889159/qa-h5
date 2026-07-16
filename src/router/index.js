import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Index',
    component: () => import('@/views/Index.vue'),
    meta: { title: '首页' }
  },
  {
    path: '/publish',
    name: 'Publish',
    component: () => import('@/views/Publish.vue'),
    meta: { title: '发布问题' }
  },
  {
    path: '/detail/:id',
    name: 'Detail',
    component: () => import('@/views/Detail.vue'),
    meta: { title: '问题详情' }
  },
  {
    path: '/mine',
    name: 'Mine',
    component: () => import('@/views/Mine.vue'),
    meta: { title: '我的' }
  },
  {
    path: '/ai-ask',
    name: 'AIAsk',
    component: () => import('@/views/AIAsk.vue'),
    meta: { title: '智能问答' }
  },
  {
  path: '/admin/home-editor',
  name: 'HomeEditor',
  component: () => import('@/views/Admin/HomeEditor.vue'),
  meta: { title: '首页管理' }
 },
 {
  path: '/module-detail/:id',
  name: 'ModuleDetail',
  component: () => import('@/views/ModuleDetail.vue'),
  meta: { title: '详情' }
},
{
  path: '/admin/module-editor',
  name: 'ModuleEditor',
  component: () => import('@/views/Admin/ModuleEditor.vue'),
  meta: { title: '模块管理' }
},
{
  path: '/add-wall',
  name: 'AddWall',
  component: () => import('@/views/AddWall.vue'),
  meta: { title: '添加墙墙' }
},
{
  path: '/add-wall',
  name: 'AddWall',
  component: () => import('@/views/AddWall.vue'),
  meta: { title: '添加墙墙' }
}

]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// ✅ 修复：去掉 next()，直接返回
router.beforeEach((to) => {
  document.title = to.meta.title || '问答社区'
})

export default router