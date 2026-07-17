<script setup lang="ts">
import { useAdventureStore } from '~/stores/adventure'
import { pets } from '~/data/pets'
import type { Verdict } from '~/types'

// 开发期预览：随机抽一只精灵，注入 store 后跳到 /result，
// 用于不打完整冒险流程就能查看结果页效果。
definePageMeta({ layout: false })

function rollAndGo() {
  const pet = pets[Math.floor(Math.random() * pets.length)]
  if (!pet) return // 空数组保护，不会触达
  const verdict: Verdict = {
    petId: pet.id,
    verdict: `（预览判词）根据你在这段旅程中的选择与独白，圣泉最终将波纹指向了${pet.name}。它的内核与你的心性遥相呼应——${pet.personality}`,
    resonance: `（预览共鸣）这只是开发预览注入的占位共鸣文案，真实裁决会从你的作答中提炼具体瞬间。`,
  }
  const store = useAdventureStore()
  store.verdict = verdict
  store.phase = 'done'
  store.events = []
  store.active = null
  navigateTo('/result')
}

onMounted(() => {
  // 生产环境禁用：直接回首页
  if (!import.meta.dev) {
    navigateTo('/')
    return
  }
  rollAndGo()
})
</script>

<template>
  <main class="flex min-h-dvh items-center justify-center bg-night px-6 text-ink">
    <div class="text-center">
      <p class="text-sm text-ink-dim">正在抽取本命精灵并跳转…</p>
      <button class="btn-gold mt-4 rounded-lg px-6 py-2.5 text-sm font-semibold" @click="rollAndGo">再抽一只</button>
    </div>
  </main>
</template>
