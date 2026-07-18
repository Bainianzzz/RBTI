<script setup lang="ts">
import { useAdventureStore } from '~/stores/adventure'
import GeneratingState from './_components/GeneratingState.vue'
import ConcludingState from './_components/ConcludingState.vue'
import ErrorState from './_components/ErrorState.vue'
import AnswerCard from './_components/AnswerCard.vue'

// 编排层：启动冒险 → 按 phase 渲染对应状态组件 → 完成时跳转结果页。
const store = useAdventureStore()
const { phase, active, error } = storeToRefs(store)

onMounted(() => {
  if (store.phase === 'idle') store.start()
})

watch(
  () => phase.value,
  (p) => {
    if (p === 'done') navigateTo('/result')
  },
)
</script>

<template>
  <PageShell>
    <div class="mx-auto w-full max-w-3xl">
      <GeneratingState v-if="phase === 'generating' || phase === 'idle'" />
      <ConcludingState v-else-if="phase === 'concluding'" />
      <ErrorState v-else-if="phase === 'error'" :error="error ?? ''" @retry="store.retry()" />
      <AnswerCard v-else-if="phase === 'answering' && active" />
    </div>
    <div class="absolute inset-x-0 bottom-0 px-6 py-4 text-center">
      <AiContentNotice text="本页剧情与选项由 AI 实时生成，仅供娱乐参考" />
    </div>
  </PageShell>
</template>
