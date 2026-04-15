<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Info, RefreshCcw, RotateCw, Star } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'

import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { useQuizStore } from '@/stores/quiz.ts'
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
  window.location.reload()
}

onMounted(() => {
  trackResultVisit()
})
</script>

<template>
  <main
    class="bg-light flex min-h-dvh flex-col items-center justify-center"
  >
    <section
      class="bg-light md:border md:border-light md:shadow-warm mx-auto w-full max-w-5xl space-y-6 rounded-3xl p-4 backdrop-blur-xl sm:space-y-7 sm:p-5 md:p-8"
    >
      <header class="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p class="mt-1 text-2xl font-extrabold tracking-[0.16em] text-[#1f1f1f] md:tracking-[0.2em]">
            {{ t('result.completed') }}
          </p>
        </div>
        <div class="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
          <Button
            type="button"
            variant="outline"
            class="border-light bg-light text-dark border-dark-hover bg-light-hover w-full rounded-xl text-sm sm:w-auto"
            @click="refreshPage"
          >
            <RotateCw class="h-4 w-4" />
            刷新页面
          </Button>
          <Button
            type="button"
            variant="outline"
            class="border-light bg-light text-dark border-dark-hover bg-light-hover w-full rounded-xl text-sm sm:w-auto"
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
        <div class="grid w-full gap-3 sm:grid-cols-2">
          <ShareResultDialog />
          <Button
            as-child
            variant="outline"
            class="border-light bg-light text-accent-warm border-dark-hover bg-light-hover h-auto w-full rounded-xl py-3.5 text-sm transition"
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

    <p class="flex flex-row gap-1 mt-4 items-center justify-center text-center text-sm text-gray-500">
      <Info class="h-4 w-4" />
      {{ t('result.entertainmentNotice') }}
    </p>
  </main>
</template>
