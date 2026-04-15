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
  const quizStore = useQuizStore()

  if (to.name === 'quiz' && quizStore.hasResult) {
    return { name: 'result' }
  }

  if (to.name === 'result' && !quizStore.hasResult) {
    return { name: 'quiz' }
  }

  return true
})

export default router
