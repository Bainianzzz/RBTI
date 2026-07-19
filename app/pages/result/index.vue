<script setup lang="ts">
import { useAdventureStore } from '~/stores/adventure'
import EmptyState from './_components/EmptyState.vue'
import PetCard from './_components/PetCard.vue'

// 编排层：裁决丢失→兜底 / 召唤仪式→揭卡 / 展示本命精灵。
const store = useAdventureStore()
const { verdict, phase } = storeToRefs(store)

// 没有裁决结果（如直接刷新此页、store 已丢）：回首页
const noResult = computed(() => !verdict.value || phase.value !== 'done')

// 仪式阶段：先显影（召唤光晕），再揭卡
const ritual = ref<'summoning' | 'revealed'>('summoning')
let ritualTimer: ReturnType<typeof setTimeout> | null = null

onMounted(() => {
  watch(
    () => verdict.value,
    (v) => {
      if (v) {
        ritual.value = 'summoning'
        if (ritualTimer) clearTimeout(ritualTimer)
        ritualTimer = setTimeout(() => {
          ritual.value = 'revealed'
        }, 2200)
      }
    },
    { immediate: true },
  )
})

onBeforeUnmount(() => {
  if (ritualTimer) clearTimeout(ritualTimer)
})
</script>

<template>
  <PageShell>
    <EmptyState v-if="noResult" />

    <!-- 仪式中：召唤 -->
    <div
      v-else-if="ritual === 'summoning'"
      class="flex min-h-dvh flex-col items-center justify-center text-center"
    >
      <SummonHalo size="lg" class="mb-8" />
    </div>

    <!-- 揭卡 -->
    <PetCard v-else />

    <div class="absolute inset-x-0 bottom-0 px-6 py-4 text-center">
      <AiContentNotice text="本页判词与裁决由 AI 实时生成，仅供娱乐参考" />
    </div>
  </PageShell>
</template>
