<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { VueWriter } from 'vue-writer'

import { Badge } from '@/components/ui/badge'
import { useQuizStore } from '@/stores/quiz.ts'
import HatchingPetPortrait from '@/views/result/_components/HatchingPetPortrait.vue'

const props = defineProps<{ exportMode?: boolean }>()

const quizStore = useQuizStore()
const { t, tm } = useI18n()

const pet = computed(() => quizStore.matchedPet)
const petName = computed<string>(() => t(pet.value.nameKey))
const petDescription = computed<string>(() => t(pet.value.descriptionKey))
const personalities = computed<string[]>(() => {
  const values = tm('result.personalities')
  return Array.isArray(values) ? values.map((item) => String(item)) : []
})
const randomPersonality = computed<string>(() => {
  const hash = [...quizStore.finalMbti].reduce((accumulator, char) => accumulator + char.charCodeAt(0), 0)
  return personalities.value[hash % personalities.value.length] ?? ''
})
const spiritTitleText = computed<string>(() => `${t('result.spiritPartnerLabel')}: ${petName.value}`)
</script>

<template>
  <div
    :class="[
      'grid rounded-3xl bg-[#292b2e] opacity-100',
      props.exportMode ? 'gap-4 grid-cols-1' : 'gap-4 sm:gap-6 md:grid-cols-[1.2fr_1fr]',
    ]"
  >
    <aside :class="['rounded-2xl bg-[#f2f2f2]', props.exportMode ? 'p-1' : 'p-1 sm:p-2']">
      <HatchingPetPortrait
        :pet-src="pet.imageUrl"
        :pet-name="petName"
        :loading="props.exportMode ? 'eager' : 'lazy'"
        :export-mode="props.exportMode"
      />
      <p 
        v-if="!props.exportMode"
        class="mt-2 text-center text-xs text-[#3b3832]">
        {{ t('result.portraitSource') }}
      </p>
    </aside>

    <article
      :class="[
        'rounded-2xl bg-[#292b2e] p-5 opacity-100',
        props.exportMode ? '' : 'result-text-enter',
      ]"
    >
      <div class="flex flex-wrap items-center gap-x-3 gap-y-2">
        <h2 class="text-light text-2xl font-semibold">
          <template v-if="props.exportMode">
            {{ spiritTitleText }}
          </template>
          <VueWriter
            v-else
            :array="[spiritTitleText]"
            :iterations="1"
            :type-speed="63"
            :erase-speed="20"
            :delay="2400"
            :start="1250"
          />
        </h2>
        <Badge class="border-dark-muted bg-[#292b2e] text-light rounded-full border px-3 py-1 text-xs tracking-widest">
          {{ t('result.personality') }}: {{ randomPersonality }}
        </Badge>
      </div>
      <p class="text-light mt-4 text-sm leading-7">{{ petDescription }}</p>
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

<style scoped>
.result-text-enter {
  opacity: 0;
  transform: translateY(6px);
  animation: result-text-fade-in 520ms ease-out 1180ms forwards;
}

@keyframes result-text-fade-in {
  from {
    opacity: 0;
    transform: translateY(6px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
