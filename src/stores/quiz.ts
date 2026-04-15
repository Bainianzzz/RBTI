import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

import { petByMbti, pets } from '@/data/pets'
import { questions } from '@/data/questions'
import type { Dimension, Question, RocoPet } from '@/types'

const dimensions: Dimension[] = ['E', 'I', 'S', 'N', 'T', 'F', 'J', 'P']
const RESULT_STORAGE_KEY = 'rbti:result-state'
const SHINY_APPEARANCE_RATE = 0.1

type ResultSnapshot = {
  mbti: string
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

const isValidMbti = (value: unknown): value is string => {
  if (typeof value !== 'string') {
    return false
  }
  return /^[EINSFTJP]{4}$/.test(value)
}

const loadResultSnapshot = (): ResultSnapshot | null => {
  if (typeof window === 'undefined') {
    return null
  }

  try {
    const raw = localStorage.getItem(RESULT_STORAGE_KEY)
    if (!raw) {
      return null
    }

    const parsed = JSON.parse(raw) as Partial<ResultSnapshot>
    if (!isValidMbti(parsed.mbti)) {
      return null
    }

    return {
      mbti: parsed.mbti,
    }
  } catch {
    return null
  }
}

const persistResultSnapshot = (snapshot: ResultSnapshot | null): void => {
  if (typeof window === 'undefined') {
    return
  }
  if (!snapshot) {
    localStorage.removeItem(RESULT_STORAGE_KEY)
    return
  }
  localStorage.setItem(RESULT_STORAGE_KEY, JSON.stringify(snapshot))
}

const rollShinyPet = (): boolean => Math.random() < SHINY_APPEARANCE_RATE

const calculateMbti = (scores: Record<Dimension, number>): string => {
  const choose = (left: Dimension, right: Dimension): Dimension =>
    scores[left] >= scores[right] ? left : right
  return `${choose('E', 'I')}${choose('S', 'N')}${choose('T', 'F')}${choose('J', 'P')}`
}

export const useQuizStore = defineStore('quiz', () => {
  const savedResult = loadResultSnapshot()
  const currentIndex = ref(0)
  const scores = ref<Record<Dimension, number>>(createInitialScores())
  const selectedOptions = ref<Array<number>>(createInitialSelectedOptions())
  const savedMbti = ref<string | null>(savedResult?.mbti ?? null)
  const isShinyResult = ref<boolean>(savedResult ? rollShinyPet() : false)

  const totalQuestions = questions.length
  const currentQuestion = computed<Question | null>(() => questions[currentIndex.value] ?? null)
  const isCompleted = computed<boolean>(() => currentIndex.value >= totalQuestions)
  const hasResult = computed<boolean>(() => savedMbti.value !== null)
  const progress = computed<number>(() => (currentIndex.value / totalQuestions) * 100)

  const calculatedMbti = computed<string>(() => calculateMbti(scores.value))
  const finalMbti = computed<string>(() => savedMbti.value ?? calculatedMbti.value)
  const matchedPet = computed<RocoPet>(() => {
    const pet = petByMbti[finalMbti.value] ?? pets[0]!
    return {
      ...pet,
      imageUrl: isShinyResult.value ? pet.shinyImageUrl : pet.imageUrl,
    }
  })

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
    if (currentIndex.value >= totalQuestions) {
      savedMbti.value = calculatedMbti.value
      isShinyResult.value = rollShinyPet()
      persistResultSnapshot({
        mbti: calculatedMbti.value,
      })
    }
  }

  const previousQuestion = (): void => {
    if (currentIndex.value <= 0) {
      return
    }
    if (savedMbti.value) {
      savedMbti.value = null
      persistResultSnapshot(null)
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
    if (currentIndex.value < totalQuestions) {
      isShinyResult.value = false
    }
  }

  const restart = (): void => {
    currentIndex.value = 0
    scores.value = createInitialScores()
    selectedOptions.value = createInitialSelectedOptions()
    savedMbti.value = null
    isShinyResult.value = false
    persistResultSnapshot(null)
  }

  return {
    currentIndex,
    currentQuestion,
    totalQuestions,
    progress,
    scores,
    isCompleted,
    hasResult,
    isShinyResult,
    finalMbti,
    matchedPet,
    answerQuestion,
    previousQuestion,
    restart,
  }
})
