<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { Copy, RefreshCcw, Star } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'

import { petByMbti, pets } from '@/data/pets'
import { useQuizStore } from '@/stores/quiz'
import type { RocoPet } from '@/types'

defineOptions({
  name: 'ResultView',
})

const quizStore = useQuizStore()
const router = useRouter()
const { t, tm } = useI18n()

const sharedState = ref<'idle' | 'success' | 'failed'>('idle')
const repositoryUrl = 'https://github.com/Bainianzzz/RBTI'

const resultMbti = computed<string>(() => quizStore.finalMbti)
const fallbackPet: RocoPet = pets[0] ?? {
  id: 'pet-fallback',
  nameKey: 'fallbackPet.name',
  mbti: 'INTJ',
  titleKey: 'fallbackPet.title',
  descriptionKey: 'fallbackPet.description',
  habitatKey: 'fallbackPet.habitat',
  wikiName: '星海守望兽',
  wikiUrl: 'https://wiki.biligame.com/rocom/',
  imageUrl: 'https://patchwiki.biligame.com/images/rocom/2/25/o64cvcxq1l6tlur77xjqbwx2s4imabd.png',
}
const pet = computed<RocoPet>(() => petByMbti[resultMbti.value] ?? fallbackPet)
const petName = computed<string>(() => t(pet.value.nameKey))
const petTitle = computed<string>(() => t(pet.value.titleKey))
const petDescription = computed<string>(() => t(pet.value.descriptionKey))
const petHabitat = computed<string>(() => t(pet.value.habitatKey))
const personalities = computed<string[]>(() => {
  const values = tm('result.personalities')
  return Array.isArray(values) ? values.map((item) => String(item)) : []
})

const randomPersonality = computed<string>(() => {
  const hash = [...resultMbti.value].reduce((accumulator, char) => accumulator + char.charCodeAt(0), 0)
  return personalities.value[hash % personalities.value.length] ?? ''
})

const shareText = computed<string>(
  () => t('result.shareText', { mbti: resultMbti.value, petName: petName.value }),
)

const shareToMoments = async (): Promise<void> => {
  try {
    const shareUrl = `${window.location.origin}/result?mbti=${resultMbti.value}`
    await navigator.clipboard.writeText(`${shareText.value} ${shareUrl}`)
    sharedState.value = 'success'
  } catch {
    sharedState.value = 'failed'
  } finally {
    window.setTimeout(() => {
      sharedState.value = 'idle'
    }, 1800)
  }
}

const restart = async (): Promise<void> => {
  quizStore.restart()
  await router.push('/')
}
</script>

<template>
  <main
    class="tw-page-bg min-h-dvh overflow-y-auto px-3 py-4 pb-[calc(env(safe-area-inset-bottom)+1rem)] sm:px-4 md:flex md:items-center md:px-8 md:py-10"
  >
    <section
      class="mx-auto max-w-5xl rounded-3xl border border-[#d6cebf] bg-[rgba(243,239,227,0.95)] p-4 shadow-[0_14px_35px_rgba(112,95,67,0.14)] backdrop-blur-xl sm:p-5 md:w-full md:p-8"
    >
      <header class="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p class="mt-1 text-lg font-extrabold tracking-[0.16em] text-[#1f1f1f] md:text-xl md:tracking-[0.2em]">
            {{ t('result.completed') }}
          </p>
        </div>
        <button
          type="button"
          class="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[#d6cebf] bg-[rgba(243,239,227,0.95)] px-4 py-2 text-sm text-[#1f1f1f] transition hover:border-[#1f1f1f] hover:bg-[#f7f2e7] sm:w-auto"
          @click="restart"
        >
          <RefreshCcw class="h-4 w-4" />
          {{ t('result.restart') }}
        </button>
      </header>

      <div class="grid gap-4 sm:gap-6 md:grid-cols-[1.2fr_1fr] bg-[#292b2e] rounded-4xl">
        <aside class="rounded-2xl bg-[#f2f2f2] p-1 sm:p-2">
          <img
            :src="pet.imageUrl"
            :alt="petName"
            class="mx-auto max-h-72 w-auto max-w-full shrink-0"
          />
          <p class="mt-2 text-center text-xs text-[#3b3832]">{{ t('result.portraitSource') }}</p>
        </aside>

        <article class="rounded-2xl bg-[#292b2e] p-5">
          <div class="flex flex-wrap items-baseline gap-x-3 gap-y-2">
            <h2 class="text-2xl font-semibold text-[#f2f2f2]">{{ petName }}</h2>
            <span class="rounded-full border border-[#4a4d52] bg-[#292b2e] px-3 py-1 text-xs tracking-widest text-[#f2f2f2]">
              {{ petTitle }}
            </span>
            <span class="rounded-full border border-[#4a4d52] bg-[#292b2e] px-3 py-1 text-xs tracking-widest text-[#f2f2f2]">
              {{ t('result.personality') }}：{{ randomPersonality }}
            </span>
          </div>
          <p class="mt-4 text-sm leading-7 text-[#f2f2f2]">{{ petDescription }}</p>
          <p class="mt-3 text-sm text-[#f2f2f2]">{{ t('result.habitat') }}：{{ petHabitat }}</p>
          <a
            :href="pet.wikiUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="mt-4 inline-flex text-sm text-[var(--theme-title)] underline-offset-4 hover:underline"
          >
            {{ t('result.viewWiki') }}
          </a>
        </article>
      </div>

      <div class="mt-4 p-0 sm:mt-6">
        <div class="grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            class="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[#d6cebf] bg-[rgba(243,239,227,0.95)] px-4 py-3.5 text-sm text-[#1f1f1f] transition hover:border-[#1f1f1f] hover:bg-[#f7f2e7] active:scale-[0.98]"
            @click="shareToMoments"
          >
            <Copy class="h-4 w-4" />
            {{ t('result.shareToMoments') }}
          </button>
          <a
            :href="repositoryUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[#d6cebf] bg-[rgba(243,239,227,0.95)] px-4 py-3.5 text-sm text-[#8c7232] transition hover:border-[#1f1f1f] hover:bg-[#f7f2e7]"
          >
            <Star class="h-4 w-4" />
            {{ t('result.githubStar') }}
          </a>
        </div>
        <p v-if="sharedState === 'success'" class="mt-2 text-xs text-[#2f6d28]">{{ t('result.copySuccess') }}</p>
        <p v-else-if="sharedState === 'failed'" class="mt-2 text-xs text-[#a14f47]">{{ t('result.copyFailed') }}</p>
      </div>
    </section>
  </main>
</template>
