<script setup lang="ts">
// 页面外壳：三页共用的 page-vignette + starfield 暖光夜空容器。
// centered 用于首页的文本居中布局；其余页面默认左对齐。
withDefaults(defineProps<{ centered?: boolean }>(), { centered: false })
</script>

<template>
  <main
    class="page-vignette starfield relative flex min-h-dvh flex-col justify-center overflow-hidden px-5 py-10 font-display text-ink sm:px-8"
    :class="centered ? 'items-center text-center' : ''"
  >
    <slot />
  </main>
</template>
