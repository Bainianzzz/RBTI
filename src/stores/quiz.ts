import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

import { petByMbti, pets } from '@/data/pets'
import { questions } from '@/data/questions'
import type { Dimension, Question, RocoPet } from '@/types'

const dimensions: Dimension[] = ['E', 'I', 'S', 'N', 'T', 'F', 'J', 'P']
const QUIZ_STORAGE_KEY = 'rbti:quiz-state'

type QuizSnapshot = {
  currentIndex: number
  scores: Record<Dimension, number>
  selectedOptions: Array<number>
}

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

const createInitialSelectedOptions = (): Array<number> => questions.map(() => -1)

const isValidScores = (value: unknown): value is Record<Dimension, number> => {
  if (!value || typeof value !== 'object') {
    return false
  }

  return dimensions.every((dimension) => Number.isFinite((value as Record<string, unknown>)[dimension]))
}

const isValidSelectedOptions = (value: unknown): value is Array<number> => {
  if (!Array.isArray(value) || value.length !== questions.length) {
    return false
  }

  return value.every((optionIndex, index) => {
    if (!Number.isInteger(optionIndex)) {
      return false
    }
    return optionIndex >= -1 && optionIndex < questions[index]!.options.length
  })
}

const loadSnapshot = (): QuizSnapshot | null => {
  if (typeof window === 'undefined') {
    return null
  }

  try {
    const raw = localStorage.getItem(QUIZ_STORAGE_KEY)
    if (!raw) {
      return null
    }

    const parsed = JSON.parse(raw) as Partial<QuizSnapshot>
    if (!Number.isInteger(parsed.currentIndex)) {
      return null
    }
    if (parsed.currentIndex! < 0 || parsed.currentIndex! > questions.length) {
      return null
    }
    if (!isValidScores(parsed.scores) || !isValidSelectedOptions(parsed.selectedOptions)) {
      return null
    }

    return {
      currentIndex: parsed.currentIndex!,
      scores: parsed.scores,
      selectedOptions: parsed.selectedOptions,
    }
  } catch {
    return null
  }
}

export const useQuizStore = defineStore('quiz', () => {
  const snapshot = loadSnapshot()
  const currentIndex = ref(snapshot?.currentIndex ?? 0)
  const scores = ref<Record<Dimension, number>>(snapshot?.scores ?? createInitialScores())
  const selectedOptions = ref<Array<number>>(snapshot?.selectedOptions ?? createInitialSelectedOptions())

  const persistSnapshot = (): void => {
    if (typeof window === 'undefined') {
      return
    }

    const data: QuizSnapshot = {
      currentIndex: currentIndex.value,
      scores: scores.value,
      selectedOptions: selectedOptions.value,
    }
    localStorage.setItem(QUIZ_STORAGE_KEY, JSON.stringify(data))
  }

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
    persistSnapshot()
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
    persistSnapshot()
  }

  const restart = (): void => {
    currentIndex.value = 0
    scores.value = createInitialScores()
    selectedOptions.value = createInitialSelectedOptions()
    persistSnapshot()
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
