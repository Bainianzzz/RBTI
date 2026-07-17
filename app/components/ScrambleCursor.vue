<script setup lang="ts">
// 打字机光标：以快速随机切换的字符替代静态竖条，营造魔法符文闪烁感。
// 仅在打字进行期间挂载（父级用 v-if 控制），卸载时自动清理定时器。

const props = withDefaults(
  defineProps<{
    charClass?: string
    interval?: number
    pool?: string
  }>(),
  {
    charClass: '',
    interval: 70,
    pool: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%*✦',
  },
)

const chars = computed(() => [...props.pool])
const display = ref(chars.value[0])

let timer: ReturnType<typeof setInterval> | null = null

onMounted(() => {
  const swap = () => {
    display.value = chars.value[Math.floor(Math.random() * chars.value.length)]
  }
  swap()
  timer = setInterval(swap, props.interval)
})

onBeforeUnmount(() => {
  if (timer) clearInterval(timer)
})
</script>

<template>
  <span
    class="ml-0.5 inline-block w-[0.8em] text-center align-baseline"
    :class="charClass"
    aria-hidden="true"
  >{{ display }}</span>
</template>
