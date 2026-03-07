import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'dashboard',
    component: () => import('@/pages/dashboard/DashboardPage.vue'),
  },
  {
    path: '/chapters',
    name: 'chapters',
    component: () => import('@/pages/chapters/ChaptersPage.vue'),
  },
  {
    path: '/chapters/:chapterId',
    name: 'chapter-detail',
    component: () => import('@/pages/chapter-detail/ChapterDetailPage.vue'),
  },
  {
    path: '/pipelines',
    name: 'pipelines',
    component: () => import('@/pages/pipelines/PipelinesPage.vue'),
  },
  {
    path: '/settings',
    name: 'settings',
    component: () => import('@/pages/settings/SettingsPage.vue'),
  },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})
