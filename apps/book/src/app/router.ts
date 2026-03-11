import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/pages/home/HomePage.vue'),
  },
  {
    path: '/:section/:subsection/:chapter',
    component: () => import('@/pages/chapter/ChapterLayout.vue'),
    children: [
      {
        path: '',
        name: 'chapter',
        component: () => import('@/pages/chapter/ChapterPage.vue'),
      },
      {
        path: 'tasks',
        name: 'chapter-tasks',
        component: () => import('@/pages/chapter/ChapterTasksPage.vue'),
      },
      {
        path: 'playground',
        name: 'chapter-playground',
        component: () => import('@/pages/chapter/ChapterPlaygroundPage.vue'),
      },
      {
        path: ':subchapter',
        name: 'subchapter',
        component: () => import('@/pages/chapter/SubchapterPage.vue'),
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/pages/not-found/NotFoundPage.vue'),
  },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, _from, savedPosition) {
    if (savedPosition) return savedPosition
    if (to.hash) return { el: to.hash, behavior: 'smooth' }
    return { top: 0, behavior: 'smooth' }
  },
})
