<script setup lang="ts">
// 召唤光晕：三层同心圆（ping 外环 + pulse 中环模糊 + 静态核心）。
// adventure 收尾阶段(size md) 与 result 仪式召唤(size lg) 共用。
withDefaults(defineProps<{ size?: 'md' | 'lg' }>(), { size: 'md' })
</script>

<template>
  <div
    class="relative flex items-center justify-center"
    :class="size === 'lg' ? 'size-40' : 'size-24'"
  >
    <span class="absolute size-full rounded-full bg-gold/20 motion-safe:animate-ping" />
    <span
      class="absolute rounded-full bg-gold-soft/40 blur-sm motion-safe:animate-pulse"
      :class="size === 'lg' ? 'size-24' : 'size-14'"
    />
    <span
      class="rounded-full bg-gold-soft/60"
      :class="size === 'lg' ? 'size-16' : 'size-9'"
    />
  </div>
</template>
