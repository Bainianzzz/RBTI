<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useTransition } from '@vueuse/core'
import { ArrowLeft, RefreshCcw, Sparkles } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import QuizProgressBar from '@/views/quiz/_components/QuizProgressBar.vue'
import { useQuizStore } from '@/stores/quiz'

defineOptions({
  name: 'QuizView',
})

const quizStore = useQuizStore()
const router = useRouter()
const { t } = useI18n()

const direction = ref<'next' | 'prev'>('next')
const progressSource = computed<number>(() => quizStore.progress)
const animatedProgress = useTransition(progressSource, { duration: 360 })

watch(
  () => quizStore.isCompleted,
  (completed) => {
    if (completed) {
      void router.push('/result')
    }
  },
  { immediate: true },
)

const answer = (optionIndex: number): void => {
  direction.value = 'next'
  quizStore.answerQuestion(optionIndex)
}

const goToPreviousQuestion = (): void => {
  if (quizStore.currentIndex <= 0) {
    return
  }
  direction.value = 'prev'
  quizStore.previousQuestion()
}

const restartQuiz = (): void => {
  direction.value = 'next'
  quizStore.restart()
}

const transitionName = computed<string>(() =>
  direction.value === 'next' ? 'slide-forward' : 'slide-backward',
)

const progressCurrent = computed<number>(() =>
  Math.min(quizStore.currentIndex + 1, quizStore.totalQuestions),
)

const canGoBack = computed<boolean>(() => quizStore.currentIndex > 0)
</script>

<template>
  <main
    class="bg-light flex min-h-dvh items-center overflow-hidden px-3 py-4 pb-[calc(env(safe-area-inset-bottom)+1rem)] sm:px-4 md:px-8 md:py-8"
  >
    <div class="mx-auto flex w-full max-w-5xl flex-col justify-center">
      <div class="bg-light relative rounded-3xl border-0 p-4 shadow-none backdrop-blur-xl sm:p-5 md:border md:border-light-muted md:p-10 md:shadow-[var(--shadow-warm-card)]">
        <div class="absolute right-4 top-3 z-10 flex items-center gap-2 md:right-6 md:top-6">
          <Button
            type="button"
            variant="outline"
            size="sm"
            class="bg-light text-dark-muted border-dark-hover text-dark-strong-enabled-hover hidden gap-1.5 rounded-full border border-soft bg-light-hover md:inline-flex"
            :disabled="!canGoBack"
            @click="restartQuiz"
          >
            <RefreshCcw aria-hidden="true" class="h-4 w-4" />
            <span>{{ t('quiz.restart') }}</span>
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            class="bg-light text-dark-muted border-dark-hover text-dark-strong-enabled-hover gap-1.5 rounded-full border border-soft bg-light-hover"
            :disabled="!canGoBack"
            @click="goToPreviousQuestion"
          >
            <ArrowLeft aria-hidden="true" class="h-4 w-4" />
            <span>{{ t('quiz.previous') }}</span>
          </Button>
        </div>
        <div class="pointer-events-none absolute inset-0 hidden rounded-3xl border border-[#ece6d9] md:block" />

        <div class="mb-0 space-y-3">
          <Badge class="w-fit gap-2 border border-[#f2df9f] bg-[#f7e9b8] px-3 py-1 text-xs font-semibold tracking-[0.08em] text-[#8c7232]">
            <Sparkles class="h-4 w-4" />
            {{ t('quiz.badgeTitle') }}
          </Badge>
          <QuizProgressBar :value="animatedProgress" />
          <p class="text-dark-muted text-sm">
            {{ t('quiz.progressLabel', { current: progressCurrent, total: quizStore.totalQuestions }) }}
          </p>
        </div>

        <div class="pt-5 md:pt-6">
          <Transition :name="transitionName" mode="out-in">
            <article v-if="quizStore.currentQuestion" :key="quizStore.currentQuestion.id" class="space-y-6">
              <h1 class="text-xl font-bold leading-relaxed text-[#8c7232] sm:text-2xl md:text-3xl">
                {{ t(quizStore.currentQuestion.textKey) }}
              </h1>

              <div class="space-y-3">
                <Button
                  v-for="(option, optionIndex) in quizStore.currentQuestion.options"
                  :key="option.textKey"
                  type="button"
                  variant="outline"
                  class="bg-light border-dark-hover shadow-warm-glow-active h-auto w-full justify-start rounded-2xl border border-soft px-4 py-3.5 text-left text-[0.95rem] whitespace-normal break-words leading-relaxed text-[#2f2f2f] transition duration-150 bg-light-hover active:scale-[0.98] sm:px-5 sm:py-4 sm:text-base"
                  @click="answer(optionIndex)"
                >
                  <span class="block font-medium tracking-wide text-inherit">{{ t(option.textKey) }}</span>
                </Button>
              </div>
            </article>
          </Transition>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
.slide-forward-enter-active,
.slide-forward-leave-active,
.slide-backward-enter-active,
.slide-backward-leave-active {
  transition: all 0.28s ease;
}

.slide-forward-enter-from,
.slide-backward-leave-to {
  transform: translateX(48px);
  opacity: 0;
}

.slide-forward-leave-to,
.slide-backward-enter-from {
  transform: translateX(-48px);
  opacity: 0;
}

</style>
