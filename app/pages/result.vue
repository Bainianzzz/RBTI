<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useAdventureStore } from '~/stores/adventure'
import { petById } from '~/data/pets'
import { getElementTheme } from '~/data/elementTheme'
import { petImageUrl } from '~/data/petImages'

const store = useAdventureStore()
const { verdict, phase } = storeToRefs(store)

// 没有裁决结果（如直接刷新此页、store 已丢）：回首页
const noResult = computed(() => !verdict.value || phase.value !== 'done')

const pet = computed(() => (verdict.value ? petById[verdict.value.petId] : undefined))
const theme = computed(() => (pet.value ? getElementTheme(pet.value.element) : null))
const imgUrl = computed(() => (pet.value ? petImageUrl(pet.value.name) : undefined))

// 仪式阶段：先显影，再揭卡
const ritual = ref<'summoning' | 'revealed'>('summoning')
let ritualTimer: ReturnType<typeof setTimeout> | null = null

watch(
  () => verdict.value,
  (v) => {
    if (v) {
      ritual.value = 'summoning'
      if (ritualTimer) clearTimeout(ritualTimer)
      ritualTimer = setTimeout(() => {
        ritual.value = 'revealed'
      }, 2200)
    }
  },
  { immediate: true },
)

onBeforeUnmount(() => {
  if (ritualTimer) clearTimeout(ritualTimer)
})

// 裁决结果可能是 50 只里任意一只；若 LLM 返回了库里不存在的 id，回退到首只并提示
const fallbackMismatch = computed(
  () => verdict.value && !petById[verdict.value.petId],
)

function replay() {
  store.reset()
  navigateTo('/adventure')
}
</script>

<template>
  <main class="starfield flex min-h-dvh flex-col justify-center bg-linear-to-b from-night via-night to-black px-5 py-10 text-ink">
    <!-- 无结果：引导回首页 -->
    <div v-if="noResult" class="mx-auto flex min-h-dvh max-w-md flex-col items-center justify-center gap-5 text-center">
      <p class="text-xl font-medium">精灵圣泉尚未显影</p>
      <p class="text-base text-ink-dim">裁决结果已随这次旅程消散，请重新启程。</p>
      <NuxtLink to="/" class="btn-gold rounded-lg px-6 py-2.5 text-base font-semibold transition">返回入口</NuxtLink>
    </div>

    <!-- 仪式中：召唤 -->
    <div v-else-if="ritual === 'summoning'" class="flex min-h-dvh flex-col items-center justify-center text-center">
      <div class="relative mb-8 flex h-40 w-40 items-center justify-center">
        <span class="absolute h-full w-full animate-ping rounded-full bg-amber-400/30" />
        <span class="absolute h-24 w-24 animate-pulse rounded-full bg-amber-300/40 blur-md" />
        <span class="absolute h-16 w-16 rounded-full bg-amber-200/60" />
      </div>
      <p class="text-lg font-medium tracking-wide">圣泉泛起微光，你的本命精灵正在显现…</p>
    </div>

    <!-- 揭卡 -->
    <div v-else-if="pet && theme" class="mx-auto w-full max-w-2xl">
      <Transition name="reveal" appear>
        <article>
          <p class="mb-2 text-center text-base uppercase tracking-[0.3em] text-gold">你的本命精灵</p>

          <!-- 精灵卡 -->
          <div class="overflow-hidden rounded-2xl border border-gold/20 bg-linear-to-br shadow-2xl" :class="[theme.from, theme.to]">
            <div class="relative px-6 pt-6 pb-5">
              <div class="mb-5 flex items-center justify-between gap-4">
                <div class="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-black/20 backdrop-blur-sm">
                  <img
                    v-if="imgUrl"
                    :src="imgUrl"
                    :alt="pet.name"
                    class="h-full w-full object-contain"
                    loading="lazy"
                    @error="(e: Event) => (e.target as HTMLImageElement).style.display = 'none'"
                  />
                  <span v-else class="text-4xl font-bold text-white/90">{{ pet.name.charAt(0) }}</span>
                </div>
                <div class="flex flex-col items-end gap-1.5 text-right">
                  <span class="inline-flex items-center gap-1 rounded-full bg-black/25 px-3 py-1 text-sm font-medium text-white">{{ pet.element }}属性</span>
                  <span class="rounded-full bg-black/25 px-3 py-1 text-sm text-white/80">{{ pet.rarity }}</span>
                </div>
              </div>

              <h1 class="text-4xl font-bold text-white drop-shadow">{{ pet.name }}</h1>
              <p class="mt-1 text-base text-white/80">「{{ pet.archetype }}」</p>

              <div class="mt-4 flex flex-wrap gap-1.5">
                <span v-for="t in pet.traits" :key="t" class="rounded-md bg-white/15 px-2.5 py-1 text-sm text-white/90 backdrop-blur-sm">{{ t }}</span>
              </div>
            </div>
          </div>

          <!-- 判词 -->
          <div class="mt-6 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
            <p class="mb-3 text-base uppercase tracking-[0.2em] text-amber-300/80">契约判词</p>
            <p class="text-base leading-relaxed text-ink">{{ verdict!.verdict }}</p>
            <p v-if="verdict!.resonance" class="mt-3 border-l-2 border-gold/50 pl-3 text-sm italic leading-relaxed text-ink-dim">{{ verdict!.resonance }}</p>
          </div>

          <!-- 性格内核 -->
          <div class="mt-4 rounded-xl border border-white/5 bg-white/[0.03] px-5 py-4">
            <p class="text-sm text-ink-dim">{{ pet.personality }}</p>
          </div>

          <p v-if="fallbackMismatch" class="mt-4 text-center text-sm text-amber-400/70">（注：圣泉显影出现偏差，已回退展示。）</p>

          <!-- 操作 -->
          <div class="mt-8 flex items-center justify-center gap-3">
            <a :href="pet.wikiUrl" target="_blank" rel="noopener" class="inline-flex items-center gap-1.5 rounded-lg border border-ink/15 px-5 py-2.5 text-base font-medium text-ink-dim transition hover:bg-white/5">查看图鉴<svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 17L17 7M17 7H8M17 7v9" stroke-linecap="round" stroke-linejoin="round"/></svg></a>
            <button class="btn-gold inline-flex items-center gap-1.5 rounded-lg px-6 py-2.5 text-base font-semibold transition" @click="replay">再启新旅程<svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M3 12a9 9 0 1015-6.7L21 8M21 3v5h-5" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
          </div>
        </article>
      </Transition>
    </div>
  </main>
</template>

<style scoped>
.reveal-enter-active {
  transition: opacity 0.7s ease, transform 0.7s ease;
}
.reveal-enter-from {
  opacity: 0;
  transform: translateY(16px) scale(0.98);
}
</style>
