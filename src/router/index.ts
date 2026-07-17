import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'intro',
      component: () => import('@/views/intro/Intro.vue'),
    },
    {
      path: '/adventure',
      name: 'adventure',
      component: () => import('@/views/adventure/Adventure.vue'),
    },
    {
      path: '/result',
      name: 'result',
      component: () => import('@/views/result/Result.vue'),
    },
  ],
})

export default router
