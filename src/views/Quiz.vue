<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useTransition } from '@vueuse/core'
import { Sparkles } from 'lucide-vue-next'

import { useQuizStore } from '@/stores/quiz'

defineOptions({
  name: 'QuizView',
})

const quizStore = useQuizStore()
const router = useRouter()

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
  <main class="h-screen overflow-hidden px-4 py-8 md:px-8">
    <div class="mx-auto flex h-full max-w-4xl flex-col justify-center">
      <section
        class="relative rounded-3xl border border-[#d7b084]/55 bg-[#151110]/78 p-6 shadow-[0_0_55px_rgba(214,132,42,0.22)] backdrop-blur-xl md:p-10"
      >
        <div class="pointer-events-none absolute inset-0 rounded-3xl border border-[#f3ebd8]/10" />
        <header class="mb-6">
          <p class="mb-2 flex items-center gap-2 text-sm tracking-[0.24em] text-[#efc58f]">
            <Sparkles class="h-4 w-4" />
            洛克世界人格镜像
          </p>
          <div class="mb-3 h-2 rounded-full bg-[#2a211c]/85">
            <div
              class="h-full rounded-full bg-gradient-to-r from-[#bc7530] via-[#e2ad64] to-[#f2dfbd]"
              :style="{ width: `${animatedProgress}%` }"
            />
          </div>
          <p class="text-sm text-[#d3c4ad]">
            第 {{ quizStore.currentIndex + 1 }} / {{ quizStore.totalQuestions }} 题
          </p>
        </header>

        <Transition :name="transitionName" mode="out-in">
          <article v-if="quizStore.currentQuestion" :key="quizStore.currentQuestion.id" class="space-y-6">
            <h1 class="text-2xl font-bold leading-relaxed text-[#f3ebd8] md:text-3xl">
              {{ quizStore.currentQuestion.text }}
            </h1>

            <div class="space-y-3">
              <button
                v-for="(option, optionIndex) in quizStore.currentQuestion.options"
                :key="option.text"
                type="button"
                class="group w-full rounded-2xl border border-[#caa57b]/45 bg-[#211915]/78 px-5 py-4 text-left text-base text-[#f3ebd8] transition duration-150 hover:border-[#e3bf93] hover:bg-[#2b211c] active:scale-[0.98] active:shadow-[0_0_24px_rgba(218,143,56,0.45)]"
                @click="answer(optionIndex)"
              >
                <span class="block font-medium tracking-wide group-hover:text-[#f8e5c8]">{{ option.text }}</span>
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
</style>
