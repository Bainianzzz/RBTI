<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { Copy, RefreshCcw, Star } from 'lucide-vue-next'

import RadarChart from '@/components/RadarChart.vue'
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
  <main class="min-h-screen overflow-y-auto px-4 py-8 md:px-8 md:py-10">
    <section
      class="mx-auto max-w-5xl rounded-3xl border border-[#d7b084]/55 bg-[#151110]/82 p-5 shadow-[0_0_70px_rgba(209,127,49,0.2)] backdrop-blur-xl md:p-8"
    >
      <header class="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p class="text-xs tracking-[0.3em] text-[#efc58f]">鉴定完成</p>
          <h1 class="mt-2 text-3xl font-bold text-[#f3ebd8] md:text-4xl">{{ resultMbti }}</h1>
        </div>
        <button
          type="button"
          class="inline-flex items-center gap-2 rounded-xl border border-[#cfa97f]/50 bg-[#241b17]/82 px-4 py-2 text-sm text-[#f3ebd8] transition hover:border-[#e1bc90] hover:bg-[#31241d]"
          @click="restart"
        >
          <RefreshCcw class="h-4 w-4" />
          重新测试
        </button>
      </header>

      <div class="grid gap-6 md:grid-cols-[1.2fr_1fr]">
        <article class="rounded-2xl border border-[#d0a97c]/35 bg-[#1f1714]/74 p-5">
          <div class="flex flex-wrap items-baseline gap-x-3 gap-y-2">
            <h2 class="text-2xl font-semibold text-[#f7d8a5]">{{ pet.name }}</h2>
            <span class="rounded-full bg-[#be7c34]/26 px-3 py-1 text-xs tracking-widest text-[#f1d2ab]">
              {{ pet.title }}
            </span>
            <span class="rounded-full bg-[#7b5b3f]/28 px-3 py-1 text-xs tracking-widest text-[#eddcc0]">
              性格：{{ randomPersonality }}
            </span>
          </div>
          <p class="mt-4 text-sm leading-7 text-[#eadac0]">{{ pet.description }}</p>
          <p class="mt-3 text-sm text-[#cfb99a]">栖息地：{{ pet.habitat }}</p>
          <a
            :href="pet.wikiUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="mt-4 inline-flex text-sm text-[#f1b569] underline-offset-4 hover:underline"
          >
            查看 Wiki 资料
          </a>
        </article>

        <aside class="rounded-2xl border border-[#d0a97c]/35 bg-[#1f1714]/74 p-5">
          <img :src="pet.imageUrl" :alt="pet.name" class="h-52 w-full rounded-xl object-contain bg-[#2a201a]/70 p-2 shadow-lg" />
          <p class="mt-3 text-xs text-[#c9b397]">立绘来源：洛克王国世界 WIKI 精灵图鉴词条</p>
        </aside>
      </div>

      <div class="mt-6 grid gap-6 md:grid-cols-[1fr_220px]">
        <article class="rounded-2xl border border-[#d0a97c]/35 bg-[#1f1714]/74 p-4 md:p-6">
          <h3 class="mb-4 text-lg font-semibold text-[#f4c98f]">六维种族值</h3>
          <RadarChart :stats="pet.stats" />
        </article>

        <aside class="rounded-2xl border border-[#d0a97c]/35 bg-[#1f1714]/74 p-4">
          <h3 class="mb-3 text-sm tracking-widest text-[#f4c98f]">分享结果</h3>
          <button
            type="button"
            class="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[#ceaa81]/50 bg-gradient-to-b from-[#be7b35]/35 to-[#8f6237]/25 px-4 py-3 text-sm text-[#f6e7cf] transition hover:border-[#e7be93] hover:from-[#ca8840]/40 active:scale-[0.98]"
            @click="shareToMoments"
          >
            <Copy class="h-4 w-4" />
            分享到朋友圈（复制链接）
          </button>
          <p v-if="sharedState === 'success'" class="mt-2 text-xs text-[#9fdd92]">已复制分享文案与链接</p>
          <p v-else-if="sharedState === 'failed'" class="mt-2 text-xs text-[#f5968f]">复制失败，请手动复制地址栏链接</p>
          <a
            :href="repositoryUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[#cfa97f]/50 bg-[#2a1f1a] px-4 py-2 text-xs text-[#f3ebd8] transition hover:border-[#e7be93] hover:bg-[#3a2a22]"
          >
            <Star class="h-4 w-4" />
            觉得不错？来 GitHub 点个 Star
          </a>
        </aside>
      </div>
    </section>
  </main>
</template>
