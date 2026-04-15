<script setup lang="ts">
import { onMounted } from 'vue'
import { onBeforeRouteLeave, useRouter } from 'vue-router'
import { Info, RefreshCcw, Sparkles, Star } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'

import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { useQuizStore } from '@/stores/quiz'
import ResultShareCard from '@/views/result/_components/ResultShareCard.vue'
import ShareResultDialog from '@/views/result/_components/ShareResultDialog.vue'

defineOptions({
  name: 'ResultView',
})

const quizStore = useQuizStore()
const router = useRouter()
const { t } = useI18n()

const repositoryUrl = 'https://github.com/Bainianzzz/RBTI'
const visitCounterUrl = 'https://visitor-badge.laobi.icu/badge?page_id=bainianzzz.rbti-pages'

const trackResultVisit = (): void => {
  if (typeof window === 'undefined') {
    return
  }
  const tracker = new Image()
  tracker.src = `${visitCounterUrl}&t=${Date.now()}`
}

const restart = async (): Promise<void> => {
  quizStore.restart()
  await router.push('/')
}

const refreshPage = (): void => {
  if (typeof window === 'undefined') {
    return
  }
  router.go(0)
}

onMounted(() => {
  trackResultVisit()
})

onBeforeRouteLeave((to) => {
  if (to.name === 'quiz' && quizStore.currentIndex === quizStore.totalQuestions) {
    quizStore.previousQuestion()
  }
  return true
})
</script>

<template>
  <main
    class="bg-light flex min-h-dvh flex-col items-center justify-center px-2.5 py-3 sm:px-4 sm:py-5 md:px-6 md:py-8"
  >
    <section
      class="bg-light mx-auto w-full max-w-5xl space-y-4 rounded-3xl border border-soft p-3.5 backdrop-blur-xl sm:space-y-6 sm:p-6 md:space-y-8 md:p-8 md:shadow-warm"
    >
      <header class="flex flex-wrap items-start justify-between gap-3 sm:items-center">
        <div>
          <p class="text-2xl font-extrabold tracking-[0.16em] text-[#1f1f1f] md:tracking-[0.2em]">
            {{ t('result.completed') }}
          </p>
        </div>
        <div class="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
          <Button
            type="button"
            class="h-11 w-full rounded-xl border border-[#d28c00] bg-gradient-to-r from-[#ffd64d] to-[#ff9f1c] px-4 text-sm font-semibold text-[#4a2a00] shadow-[0_8px_20px_rgba(255,166,0,0.35)] transition hover:from-[#ffe07a] hover:to-[#ffb347] sm:w-auto sm:px-5"
            @click="refreshPage"
          >
            <Sparkles class="h-4 w-4" />
            {{ t('result.shinyRefresh') }}
          </Button>
          <Button
            type="button"
            variant="outline"
            class="border-light bg-light text-dark border-dark-hover bg-light-hover h-11 w-full rounded-xl border border-soft px-4 text-sm sm:w-auto sm:px-5"
            @click="restart"
          >
            <RefreshCcw class="h-4 w-4" />
            {{ t('result.restart') }}
          </Button>
        </div>
      </header>

      <div id="result-share-card">
        <ResultShareCard />
      </div>

      <Separator class="bg-[#d8d1c3]" />

      <div class="w-full">
        <div class="grid w-full gap-2.5 sm:grid-cols-2 sm:gap-3">
          <ShareResultDialog />
          <Button
            as-child
            variant="outline"
            class="border-light bg-light text-accent-warm border-dark-hover bg-light-hover h-11 w-full rounded-xl border border-soft px-4 text-sm transition"
          >
            <a
              :href="repositoryUrl"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Star class="h-4 w-4" />
              {{ t('result.githubStar') }}
            </a>
          </Button>
        </div>
      </div>
    </section>

    <p class="mt-4 flex flex-row items-center justify-center gap-1 px-2 text-center text-sm text-gray-500 sm:mt-5">
      <Info class="h-4 w-4" />
      {{ t('result.entertainmentNotice') }}
    </p>
  </main>
</template>
