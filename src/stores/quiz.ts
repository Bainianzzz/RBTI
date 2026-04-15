import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

import { petByMbti, pets } from '@/data/pets'
import { questions } from '@/data/questions'
import type { Dimension, Question, RocoPet } from '@/types'

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
  const selectedOptions = ref<Array<number>>(questions.map(() => -1))

  const totalQuestions = questions.length
  const currentQuestion = computed<Question | null>(() => questions[currentIndex.value] ?? null)
  const isCompleted = computed<boolean>(() => currentIndex.value >= totalQuestions)
  const progress = computed<number>(() => (currentIndex.value / totalQuestions) * 100)

  const finalMbti = computed<string>(() => {
    const choose = (left: Dimension, right: Dimension): Dimension =>
      scores.value[left] >= scores.value[right] ? left : right

    return `${choose('E', 'I')}${choose('S', 'N')}${choose('T', 'F')}${choose('J', 'P')}`
  })
  const matchedPet = computed<RocoPet>(() => petByMbti[finalMbti.value] ?? pets[0]!)

  const applyWeights = (weights: Partial<Record<Dimension, number>>): void => {
    for (const key of dimensions) {
      const delta = weights[key] ?? 0
      if (delta !== 0) {
        scores.value[key] += delta
      }
    }
  }

  const revertWeights = (weights: Partial<Record<Dimension, number>>): void => {
    for (const key of dimensions) {
      const delta = weights[key] ?? 0
      if (delta !== 0) {
        scores.value[key] -= delta
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

    const previousOptionIndex = selectedOptions.value[currentIndex.value] ?? -1
    if (previousOptionIndex >= 0) {
      const previousOption = question.options[previousOptionIndex]
      if (previousOption) {
        revertWeights(previousOption.weights)
      }
    }

    applyWeights(option.weights)
    selectedOptions.value[currentIndex.value] = optionIndex
    currentIndex.value += 1
  }

  const previousQuestion = (): void => {
    if (currentIndex.value <= 0) {
      return
    }

    const previousIndex = currentIndex.value - 1
    const question = questions[previousIndex]
    const selectedOptionIndex = selectedOptions.value[previousIndex] ?? -1
    if (question && selectedOptionIndex >= 0) {
      const selectedOption = question.options[selectedOptionIndex]
      if (selectedOption) {
        revertWeights(selectedOption.weights)
      }
      selectedOptions.value[previousIndex] = -1
    }

    currentIndex.value = previousIndex
  }

  const restart = (): void => {
    currentIndex.value = 0
    scores.value = createInitialScores()
    selectedOptions.value = questions.map(() => -1)
  }

  return {
    currentIndex,
    currentQuestion,
    totalQuestions,
    progress,
    scores,
    isCompleted,
    finalMbti,
    matchedPet,
    answerQuestion,
    previousQuestion,
    restart,
  }
})
