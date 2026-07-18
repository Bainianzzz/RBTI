<script setup lang="ts">
// 金线菱形分隔：三页装饰统一于此。
// layout: short = 固定宽短线（标题夹饰 / 顶部点缀），full = 通栏 flex-1（卡片顶饰）
// diamond: hollow = 空心菱形（首页/装饰），solid = 实心暖橙（答题卡），none = 仅留 slot 给标题
withDefaults(
  defineProps<{
    layout?: 'short' | 'full'
    diamond?: 'solid' | 'hollow' | 'none'
  }>(),
  { layout: 'short', diamond: 'hollow' },
)

const slots = useSlots()
</script>

<template>
  <div class="flex items-center gap-3" :aria-hidden="slots.default ? undefined : 'true'">
    <span
      class="h-px"
      :class="
        layout === 'full'
          ? 'flex-1 bg-linear-to-r from-transparent to-sun'
          : 'w-12 bg-gold/60 sm:w-24'
      "
    />
    <span
      v-if="diamond !== 'none'"
      class="size-2 rotate-45"
      :class="diamond === 'solid' ? 'bg-sun' : 'border border-gold bg-coal'"
    />
    <slot />
    <span
      v-if="diamond !== 'none'"
      class="size-2 rotate-45"
      :class="diamond === 'solid' ? 'bg-sun' : 'border border-gold bg-coal'"
    />
    <span
      class="h-px"
      :class="
        layout === 'full'
          ? 'flex-1 bg-linear-to-l from-transparent to-sun'
          : 'w-12 bg-gold/60 sm:w-24'
      "
    />
  </div>
</template>
