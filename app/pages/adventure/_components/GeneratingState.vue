<script setup lang="ts">
// 生成中加载态：spinner + 文案，纯展示。
</script>

<template>
  <div class="paper-panel rounded-3xl px-6 py-24 text-center">
    <div
      class="mx-auto mb-6 size-12 rounded-full border-4 border-paper-soft border-t-gold motion-safe:animate-spin"
    />
    <p class="text-base font-bold text-paper-ink">
      命运之轮缓缓转动<span class="inline-block animate-pulse">…</span>
    </p>
    <p class="mt-2 text-sm text-paper-ink/55">正在为你编织下一段奇遇</p>
  </div>
</template>
