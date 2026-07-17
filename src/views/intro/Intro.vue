<script setup lang="ts">
import { useRouter } from 'vue-router'
import { Button } from '@/components/ui/button'

defineOptions({ name: 'IntroView' })

const router = useRouter()
const start = () => router.push('/adventure')
</script>

<template>
  <main class="min-h-dvh flex flex-col items-center justify-center gap-6 px-6">
    <h1 class="text-2xl font-semibold">洛克王国 · 本命精灵契约</h1>
    <p class="text-sm text-center max-w-md opacity-70">
      见习魔法师的精灵契约之日即将开始，每一步的选择与心声都将指引你的本命精灵显现。
    </p>
    <Button @click="start">启程</Button>
  </main>
</template>
