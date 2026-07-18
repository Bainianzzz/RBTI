<script setup lang="ts">
import { Sparkles } from 'lucide-vue-next'

// 页脚 AI 生成内容提示：剧情与裁决由 LLM 实时生成，仅供娱乐。
withDefaults(
  defineProps<{
    text?: string
  }>(),
  {
    text: '本页剧情与裁决由 AI 实时生成，仅供娱乐参考',
  },
)
</script>

<template>
  <p class="inline-flex items-center justify-center gap-1.5 text-xs text-ink/40">
    <Sparkles class="size-3 shrink-0" aria-hidden="true" :stroke-width="2.5" />
    <span>{{ text }}</span>
  </p>
</template>
