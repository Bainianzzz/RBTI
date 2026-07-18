<script setup lang="ts">
import { useAdventureStore } from '~/stores/adventure'

// 收尾中：裁决判词通过 ReadableStream 逐字显影，完整后进入结果页。
const store = useAdventureStore()
const { verdict, isStreaming } = storeToRefs(store)
</script>

<template>
  <div class="paper-panel rounded-3xl px-6 py-24 text-center">
    <SummonHalo size="md" class="mx-auto mb-8" />
    <p class="text-lg font-black text-gold-deep">黄昏降临，精灵圣泉泛起微光</p>
    <p v-if="!verdict?.verdict" class="mt-2 text-base text-paper-ink/60">
      你的本命精灵正在显现<span class="inline-block animate-pulse">…</span>
    </p>
    <div v-else class="mx-auto mt-6 max-w-xl border-t-2 border-paper-ink/10 pt-5 text-left">
      <p class="mb-2 text-center font-display text-lg font-black text-gold-deep">
        {{ verdict.petId }} · 契约判词
      </p>
      <p class="font-display text-base font-medium leading-8 text-paper-ink/80">
        {{ verdict.verdict }}<ScrambleCursor
          v-if="isStreaming"
          char-class="text-paper-ink/55"
        />
      </p>
    </div>
  </div>
</template>
