<script setup lang="ts">
import { useRouter } from 'vue-router'
import { Info, RefreshCcw, Star } from 'lucide-vue-next'
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

const restart = async (): Promise<void> => {
  quizStore.restart()
  await router.push('/')
}
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
        <Button
          type="button"
          variant="outline"
          class="border-light bg-light text-dark border-dark-hover bg-light-hover w-full rounded-xl text-sm sm:w-auto"
          @click="restart"
        >
          <RefreshCcw class="h-4 w-4" />
          {{ t('result.restart') }}
        </Button>
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
