<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

import { Badge } from '@/components/ui/badge'
import { useQuizStore } from '@/stores/quiz.ts'

const props = defineProps<{ exportMode?: boolean }>()

const quizStore = useQuizStore()
const { t, tm } = useI18n()

const pet = computed(() => quizStore.matchedPet)
const petName = computed<string>(() => t(pet.value.nameKey))
const petDescription = computed<string>(() => t(pet.value.descriptionKey))
const petHabitat = computed<string>(() => t(pet.value.habitatKey))
const personalities = computed<string[]>(() => {
  const values = tm('result.personalities')
  return Array.isArray(values) ? values.map((item) => String(item)) : []
})
const randomPersonality = computed<string>(() => {
  const hash = [...quizStore.finalMbti].reduce((accumulator, char) => accumulator + char.charCodeAt(0), 0)
  return personalities.value[hash % personalities.value.length] ?? ''
})
</script>

<template>
  <div
    :class="[
      'grid rounded-3xl bg-[#292b2e] opacity-100',
      props.exportMode ? 'gap-4 grid-cols-1' : 'gap-4 sm:gap-6 md:grid-cols-[1.2fr_1fr]',
    ]"
  >
    <aside :class="['rounded-2xl bg-[#f2f2f2]', props.exportMode ? 'p-1' : 'p-1 sm:p-2']">
      <img
        :src="pet.imageUrl"
        :alt="petName"
        :loading="props.exportMode ? 'eager' : 'lazy'"
        decoding="async"
        class="mx-auto max-h-72 w-auto max-w-full shrink-0"
      />
      <p class="mt-2 text-center text-xs text-[#3b3832]">{{ t('result.portraitSource') }}</p>
    </aside>

    <article class="rounded-2xl bg-[#292b2e] p-5 opacity-100">
      <div class="flex flex-wrap items-center gap-x-3 gap-y-2">
        <h2 class="text-light text-2xl font-semibold">{{ t('result.spiritPartnerLabel') }}: {{ petName }}</h2>
        <Badge class="border-dark-muted bg-[#292b2e] text-light rounded-full border px-3 py-1 text-xs tracking-widest">
          {{ t('result.personality') }}: {{ randomPersonality }}
        </Badge>
      </div>
      <p class="text-light mt-4 text-sm leading-7">{{ petDescription }}</p>
      <p
        v-if="!props.exportMode"
        class="text-light mt-3 text-sm"
      >
        {{ t('result.habitat') }}：{{ petHabitat }}
      </p>
      <a
        v-if="!props.exportMode"
        :href="pet.wikiUrl"
        target="_blank"
        rel="noopener noreferrer"
        class="text-brand-accent mt-4 inline-flex text-sm underline-offset-4 hover:underline !text-brand-accent visited:!text-brand-accent hover:!text-brand-accent active:!text-brand-accent"
      >
        {{ t('result.viewWiki') }}
      </a>
    </article>
  </div>
</template>
