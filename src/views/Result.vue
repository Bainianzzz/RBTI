<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { Copy, RefreshCcw, Star } from 'lucide-vue-next'

import { petByMbti, pets } from '@/data/pets'
import { useQuizStore } from '@/stores/quiz'
import type { RocoPet } from '@/types'

defineOptions({
  name: 'ResultView',
})

const quizStore = useQuizStore()
const router = useRouter()

const personalities = ['固执', '大胆', '冷静', '开朗', '悠闲', '慎重', '勇敢', '温和'] as const
const defaultPersonality = '冷静'
const sharedState = ref<'idle' | 'success' | 'failed'>('idle')
const repositoryUrl = 'https://github.com/Bainianzzz/RBTI'

const resultMbti = computed<string>(() => quizStore.finalMbti)
const fallbackPet: RocoPet = pets[0] ?? {
  id: 'pet-fallback',
  name: '星海守望兽',
  mbti: 'INTJ',
  title: '默认人格镜像',
  stats: { hp: 80, atk: 80, def: 80, spAtk: 80, spDef: 80, speed: 80 },
  description: '默认结果数据，仅用于异常兜底展示。',
  wikiUrl: 'https://wiki.biligame.com/rocom/',
  habitat: '星海中枢',
  imageUrl: 'https://patchwiki.biligame.com/images/rocom/2/25/o64cvcxq1l6tlur77xjqbwx2s4imabd.png',
}
const pet = computed<RocoPet>(() => petByMbti[resultMbti.value] ?? fallbackPet)

const randomPersonality = computed<string>(() => {
  const hash = [...resultMbti.value].reduce((accumulator, char) => accumulator + char.charCodeAt(0), 0)
  return personalities[hash % personalities.length] ?? defaultPersonality
})

const shareText = computed<string>(
  () => `我在洛克世界人格镜像测出了 ${resultMbti.value}，本命精灵是 ${pet.value.name}！`,
)

const shareToMoments = async (): Promise<void> => {
  try {
    const shareUrl = `${window.location.origin}/result?mbti=${resultMbti.value}`
    await navigator.clipboard.writeText(`${shareText.value} ${shareUrl}`)
    sharedState.value = 'success'
  } catch {
    sharedState.value = 'failed'
  } finally {
    window.setTimeout(() => {
      sharedState.value = 'idle'
    }, 1800)
  }
}

const restart = async (): Promise<void> => {
  quizStore.restart()
  await router.push('/')
}
</script>

<template>
  <main
    class="tw-page-bg min-h-dvh overflow-y-auto px-3 py-4 pb-[calc(env(safe-area-inset-bottom)+1rem)] sm:px-4 md:flex md:items-center md:px-8 md:py-10"
  >
    <section
      class="mx-auto max-w-5xl rounded-3xl border border-[#d6cebf] bg-[rgba(243,239,227,0.95)] p-4 shadow-[0_14px_35px_rgba(112,95,67,0.14)] backdrop-blur-xl sm:p-5 md:w-full md:p-8"
    >
      <header class="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p class="mt-1 text-lg font-extrabold tracking-[0.16em] text-[#1f1f1f] md:text-xl md:tracking-[0.2em]">
            鉴定完成
          </p>
        </div>
        <button
          type="button"
          class="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[#d6cebf] bg-[rgba(243,239,227,0.95)] px-4 py-2 text-sm text-[#1f1f1f] transition hover:border-[#1f1f1f] hover:bg-[#f7f2e7] sm:w-auto"
          @click="restart"
        >
          <RefreshCcw class="h-4 w-4" />
          重新测试
        </button>
      </header>

      <div class="grid gap-4 sm:gap-6 md:grid-cols-[1.2fr_1fr] bg-[#292b2e] rounded-4xl">
        <aside class="rounded-2xl bg-[#f2f2f2] p-1 sm:p-2">
          <img
            :src="pet.imageUrl"
            :alt="pet.name"
            class="mx-auto max-h-72 w-auto max-w-full shrink-0"
          />
          <p class="mt-2 text-center text-xs text-[#3b3832]">立绘来源：洛克王国世界 WIKI 精灵图鉴词条</p>
        </aside>

        <article class="rounded-2xl bg-[#292b2e] p-5">
          <div class="flex flex-wrap items-baseline gap-x-3 gap-y-2">
            <h2 class="text-2xl font-semibold text-[#f2f2f2]">{{ pet.name }}</h2>
            <span class="rounded-full border border-[#4a4d52] bg-[#292b2e] px-3 py-1 text-xs tracking-widest text-[#f2f2f2]">
              {{ pet.title }}
            </span>
            <span class="rounded-full border border-[#4a4d52] bg-[#292b2e] px-3 py-1 text-xs tracking-widest text-[#f2f2f2]">
              性格：{{ randomPersonality }}
            </span>
          </div>
          <p class="mt-4 text-sm leading-7 text-[#f2f2f2]">{{ pet.description }}</p>
          <p class="mt-3 text-sm text-[#f2f2f2]">栖息地：{{ pet.habitat }}</p>
          <a
            :href="pet.wikiUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="mt-4 inline-flex text-sm text-[var(--theme-title)] underline-offset-4 hover:underline"
          >
            查看 Wiki 资料
          </a>
        </article>
      </div>

      <div class="mt-4 p-0 sm:mt-6">
        <div class="grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            class="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[#d6cebf] bg-[rgba(243,239,227,0.95)] px-4 py-3.5 text-sm text-[#1f1f1f] transition hover:border-[#1f1f1f] hover:bg-[#f7f2e7] active:scale-[0.98]"
            @click="shareToMoments"
          >
            <Copy class="h-4 w-4" />
            分享到朋友圈（复制链接）
          </button>
          <a
            :href="repositoryUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[#d6cebf] bg-[rgba(243,239,227,0.95)] px-4 py-3.5 text-sm text-[#8c7232] transition hover:border-[#1f1f1f] hover:bg-[#f7f2e7]"
          >
            <Star class="h-4 w-4" />
            觉得不错？来 GitHub 点个 Star
          </a>
        </div>
        <p v-if="sharedState === 'success'" class="mt-2 text-xs text-[#2f6d28]">已复制分享文案与链接</p>
        <p v-else-if="sharedState === 'failed'" class="mt-2 text-xs text-[#a14f47]">复制失败，请手动复制地址栏链接</p>
      </div>
    </section>
  </main>
</template>
