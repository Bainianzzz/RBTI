import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

import { questions } from '@/data/questions'
import type { Dimension, Question } from '@/types'

const dimensions: Dimension[] = ['E', 'I', 'S', 'N', 'T', 'F', 'J', 'P']

const createInitialScores = (): Record<Dimension, number> => ({
  E: 0,
  I: 0,
  S: 0,
  N: 0,
  T: 0,
  F: 0,
  J: 0,
  P: 0,
})

export const useQuizStore = defineStore('quiz', () => {
  const currentIndex = ref(0)
  const scores = ref<Record<Dimension, number>>(createInitialScores())

  const totalQuestions = questions.length
  const currentQuestion = computed<Question | null>(() => questions[currentIndex.value] ?? null)
  const isCompleted = computed<boolean>(() => currentIndex.value >= totalQuestions)
  const progress = computed<number>(() => (currentIndex.value / totalQuestions) * 100)

  const finalMbti = computed<string>(() => {
    const choose = (left: Dimension, right: Dimension): Dimension =>
      scores.value[left] >= scores.value[right] ? left : right

    return `${choose('E', 'I')}${choose('S', 'N')}${choose('T', 'F')}${choose('J', 'P')}`
  })

  const applyWeights = (weights: Partial<Record<Dimension, number>>): void => {
    for (const key of dimensions) {
      const delta = weights[key] ?? 0
      if (delta !== 0) {
        scores.value[key] += delta
      }
    }
  }

  const answerQuestion = (optionIndex: number): void => {
    if (isCompleted.value) {
      return
    }

    const question = currentQuestion.value
    if (!question) {
      return
    }

    const option = question.options[optionIndex]
    if (!option) {
      return
    }

    applyWeights(option.weights)
    currentIndex.value += 1
  }

  const restart = (): void => {
    currentIndex.value = 0
    scores.value = createInitialScores()
  }

  return {
    currentIndex,
    currentQuestion,
    totalQuestions,
    progress,
    scores,
    isCompleted,
    finalMbti,
    answerQuestion,
    restart,
  }
})
