<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useTransition } from '@vueuse/core'
import { Sparkles } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'

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
)

const answer = (optionIndex: number): void => {
  direction.value = 'next'
  quizStore.answerQuestion(optionIndex)
}

const transitionName = computed<string>(() =>
  direction.value === 'next' ? 'slide-forward' : 'slide-backward',
)
</script>

<template>
  <main
    class="tw-page-bg flex min-h-dvh items-center overflow-hidden px-3 py-4 pb-[calc(env(safe-area-inset-bottom)+1rem)] sm:px-4 md:px-8 md:py-8"
  >
    <div class="mx-auto flex w-full max-w-5xl flex-col justify-center">
      <section
        class="relative rounded-3xl border border-transparent bg-[rgba(243,239,227,0.95)] p-4 shadow-none backdrop-blur-xl sm:p-5 md:border-[#d8d1c3] md:p-10 md:shadow-[0_14px_35px_rgba(112,95,67,0.14)]"
      >
        <div class="pointer-events-none absolute inset-0 hidden rounded-3xl border border-[#ece6d9] md:block" />
        <header class="mb-5 md:mb-6">
          <p
            class="mb-3 inline-flex items-center gap-2 rounded-full border border-[#f2df9f] bg-[#f7e9b8] px-3 py-1 text-xs font-semibold tracking-[0.08em] text-[#8c7232]"
          >
            <Sparkles class="h-4 w-4" />
            {{ t('quiz.badgeTitle') }}
          </p>
          <div class="mb-3 h-2 rounded-full bg-[#ddd8cd]">
            <div
              class="h-full rounded-full bg-gradient-to-r from-[#f0cc61] via-[#f4d978] to-[#f6e4a6]"
              :style="{ width: `${animatedProgress}%` }"
            />
          </div>
          <p class="text-sm text-[#6a6670]">
            {{ t('quiz.progressLabel', { current: quizStore.currentIndex + 1, total: quizStore.totalQuestions }) }}
          </p>
        </header>

        <Transition :name="transitionName" mode="out-in">
          <article v-if="quizStore.currentQuestion" :key="quizStore.currentQuestion.id" class="space-y-6">
            <h1 class="text-xl font-bold leading-relaxed text-[#8c7232] sm:text-2xl md:text-3xl">
              {{ t(quizStore.currentQuestion.textKey) }}
            </h1>

            <div class="space-y-3">
              <button
                v-for="(option, optionIndex) in quizStore.currentQuestion.options"
                :key="option.textKey"
                type="button"
                class="answer-option group w-full rounded-2xl border border-[#d8d1c3] bg-[rgba(243,239,227,0.95)] px-4 py-3.5 text-left text-[0.95rem] text-[#2f2f2f] transition duration-150 hover:border-[#f0cc61] hover:bg-[#f7f2e7] active:scale-[0.98] active:shadow-[0_0_14px_rgba(240,204,97,0.3)] sm:px-5 sm:py-4 sm:text-base"
                @click="answer(optionIndex)"
              >
                <span class="answer-option-label block font-medium tracking-wide">{{ t(option.textKey) }}</span>
              </button>
            </div>
          </article>
        </Transition>
      </section>
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

.answer-option:hover .answer-option-label,
.answer-option:active .answer-option-label {
  color: #111111;
}
</style>
