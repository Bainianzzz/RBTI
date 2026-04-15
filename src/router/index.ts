import { createRouter, createWebHashHistory } from 'vue-router'
import { useQuizStore } from '@/stores/quiz'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'quiz',
      component: () => import('@/views/quiz/Quiz.vue'),
    },
    {
      path: '/result',
      name: 'result',
      component: () => import('@/views/result/Overview.vue'),
    },
  ],
})

router.beforeEach((to) => {
  if (to.name !== 'result') {
    return true
  }

  const quizStore = useQuizStore()
  if (!quizStore.isCompleted) {
    return { name: 'quiz' }
  }
  return true
})

export default router
