import type { RouteRecordRaw, RouterScrollBehavior } from 'vue-router'

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/pages/home/HomePage.vue'),
  },
  {
    // group не включён в URL для краткости — chapter.id уникален внутри subsection
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

export const scrollBehavior: RouterScrollBehavior = (to, _from, savedPosition) => {
  if (savedPosition) return savedPosition
  if (to.hash) return { el: to.hash, behavior: 'smooth' }
  return { top: 0, behavior: 'smooth' }
}
