import { createRouter, createWebHistory } from 'vue-router'
import { useQuizStore } from '@/stores/quiz'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'quiz',
      component: () => import('@/views/Quiz.vue'),
    },
    {
      path: '/result',
      name: 'result',
      component: () => import('@/views/Result.vue'),
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
