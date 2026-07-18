<script setup lang="ts">
import type { Component } from 'vue'

// 全站统一契约按钮：炭底金边（默认）或渐变金底（variant="gold"，首页主 CTA）。
// 标签按 to / href / 默认 button 切换为 NuxtLink / a / button；
// disabled 仅对原生 button 生效（:disabled 伪类触发 Tailwind disabled: 变体）。
const props = withDefaults(
  defineProps<{
    variant?: 'coal' | 'gold'
    size?: 'sm' | 'md' | 'lg'
    icon?: Component | null
    iconRight?: boolean
    disabled?: boolean
    loading?: boolean
    loadingText?: string
    to?: string
    href?: string
  }>(),
  {
    variant: 'coal',
    size: 'md',
    icon: null,
    iconRight: true,
    disabled: false,
    loading: false,
    loadingText: '处理中…',
  },
)

const NuxtLink = resolveComponent('NuxtLink')
const tag = computed(() => (props.to ? NuxtLink : props.href ? 'a' : 'button'))
const isDisabled = computed(() => props.disabled || props.loading)

const sizeClass = computed(
  () =>
    ({
      sm: 'min-h-12 px-6',
      md: 'min-h-13 px-7',
      lg: 'min-h-14 px-10',
    })[props.size],
)

// 默认 text-base；调用方可透传 text-lg 覆盖（Tailwind 字号排序保证 lg 在 base 之后）
const variantClass = computed(() =>
  props.variant === 'gold'
    ? 'btn-gold'
    : 'border-2 border-gold bg-coal text-gold transition-colors hover:bg-coal-soft disabled:cursor-not-allowed disabled:border-paper-ink/15 disabled:text-ink disabled:opacity-40',
)
</script>

<template>
  <component
    :is="tag"
    :to="to || undefined"
    :href="href || undefined"
    :type="tag === 'button' ? 'button' : undefined"
    :disabled="tag === 'button' ? isDisabled : undefined"
    :aria-disabled="tag !== 'button' && isDisabled ? 'true' : undefined"
    :tabindex="tag !== 'button' && isDisabled ? -1 : undefined"
    class="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg text-base font-black tracking-wide"
    :class="[sizeClass, variantClass]"
  >
    <component
      :is="icon"
     v-if="icon && !iconRight"
     class="size-5"
     :stroke-width="2.5"
     aria-hidden="true"
   />
    <template v-if="loading">{{ loadingText }}</template>
    <slot v-else />
   <component
     :is="icon"
     v-if="icon && iconRight && !loading"
      class="size-5 transition-transform duration-150 group-hover:translate-x-0.5"
      :stroke-width="2.5"
      aria-hidden="true"
    />
  </component>
</template>
