<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { Copy, Info, RefreshCcw, Star } from 'lucide-vue-next'
import { toast } from 'vue-sonner'
import { useI18n } from 'vue-i18n'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { petByMbti, pets } from '@/data/pets'
import { useQuizStore } from '@/stores/quiz'
import type { RocoPet } from '@/types'

defineOptions({
  name: 'ResultView',
})

const quizStore = useQuizStore()
const router = useRouter()
const { t, tm } = useI18n()

const repositoryUrl = 'https://github.com/Bainianzzz/RBTI'

const resultMbti = computed<string>(() => quizStore.finalMbti)
const pet = computed<RocoPet>(() => petByMbti[resultMbti.value] ?? pets[0]!)
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
  () => t('result.shareText', { petName: petName.value }),
)

const shareToMoments = async (): Promise<void> => {
  try {
    const shareUrl = `${window.location.origin}`
    await navigator.clipboard.writeText(`${shareText.value} ${shareUrl}/RBTI`)
    toast.success(t('result.copySuccess'))
  } catch {
    toast.error(t('result.copyFailed'))
  }
}

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

      <div>
        <div class="bg-dark grid gap-4 rounded-3xl sm:gap-6 md:grid-cols-[1.2fr_1fr]">
        <aside class="rounded-2xl bg-[#f2f2f2] p-1 sm:p-2">
          <img
            :src="pet.imageUrl"
            :alt="petName"
            loading="lazy"
            decoding="async"
            class="mx-auto max-h-72 w-auto max-w-full shrink-0"
          />
          <p class="mt-2 text-center text-xs text-[#3b3832]">{{ t('result.portraitSource') }}</p>
        </aside>

        <article class="bg-dark rounded-2xl p-5">
          <div class="flex flex-wrap items-baseline gap-x-3 gap-y-2">
            <h2 class="text-light text-2xl font-semibold">{{ petName }}</h2>
            <Badge class="border-dark-muted bg-dark text-light rounded-full border px-3 py-1 text-xs tracking-widest">
              {{ petTitle }}
            </Badge>
            <Badge class="border-dark-muted bg-dark text-light rounded-full border px-3 py-1 text-xs tracking-widest">
              {{ t('result.personality') }}: {{ randomPersonality }}
            </Badge>
          </div>
          <p class="text-light mt-4 text-sm leading-7">{{ petDescription }}</p>
          <p class="text-light mt-3 text-sm">{{ t('result.habitat') }}：{{ petHabitat }}</p>
          <a
            :href="pet.wikiUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="text-brand-accent mt-4 inline-flex text-sm underline-offset-4 hover:underline !text-brand-accent visited:!text-brand-accent hover:!text-brand-accent active:!text-brand-accent"
          >
            {{ t('result.viewWiki') }}
          </a>
        </article>
        </div>
      </div>

      <Separator class="bg-[#d8d1c3]" />

      <div class="w-full">
        <div class="grid w-full gap-3 sm:grid-cols-2">
          <Button
            type="button"
            variant="outline"
            class="border-light bg-light text-dark border-dark-hover bg-light-hover h-auto w-full rounded-xl py-3.5 text-sm transition active:scale-[0.98]"
            @click="shareToMoments"
          >
            <Copy class="h-4 w-4" />
            {{ t('result.shareToMoments') }}
          </Button>
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
