<script setup lang="ts">
import { ArrowRight } from 'lucide-vue-next'

// 首页：保持无背景图，以官网 nav 的炭黑/暖金语言组织入口。
</script>

<template>
  <main class="page-vignette starfield relative flex min-h-dvh w-full flex-col items-center justify-center overflow-hidden px-6 py-16 text-center font-display">
    <div class="fade-in mb-6 flex items-center gap-4" aria-hidden="true">
      <span class="h-0.5 w-10 bg-gold/70" />
      <span class="size-2 rotate-45 border border-gold bg-coal" />
      <span class="h-0.5 w-10 bg-gold/70" />
    </div>

    <p class="fade-in font-display text-base font-black tracking-[0.22em] text-ink">洛克王国：世界</p>
    <h1 class="fade-in text-glow mt-3 font-display text-4xl font-black tracking-wide text-gold sm:text-5xl md:text-6xl">
      本命精灵契约
    </h1>

    <p class="fade-in mt-7 max-w-xl text-base font-medium leading-8 text-ink/75 md:text-lg">
      精灵契约之日，你将走过一整天的奇遇。<br />
      每一次选择与心声，都会指引你的本命精灵在黄昏显现。
    </p>

    <NuxtLink
      to="/adventure"
      class="btn-gold fade-in group mt-10 inline-flex min-h-14 items-center gap-3 rounded-lg px-10 text-base font-black tracking-wide"
    >
      开始契约
      <ArrowRight class="size-5 transition-transform group-hover:translate-x-0.5" :stroke-width="2.5" aria-hidden="true" />
    </NuxtLink>

    <a
      href="https://rocom.qq.com/"
      target="_blank"
      rel="noopener"
      class="fade-in mt-7 text-sm font-bold text-ink-dim underline decoration-gold/50 underline-offset-4 transition-colors hover:text-gold"
    >
      前往《洛克王国：世界》官网
    </a>

    <!-- 出处标注 -->
    <div class="fade-in absolute inset-x-0 bottom-4 flex flex-col items-center gap-1.5 px-6 text-center">
      <AiContentNotice text="本测试的剧情与裁决由 AI 实时生成，仅供娱乐参考" />
      <p class="text-xs leading-relaxed text-ink/35">
        世界观 © 《洛克王国：世界》腾讯魔方工作室群 · 图鉴数据见 wiki.biligame.com/rocom
      </p>
    </div>
  </main>
</template>

<style scoped>
.fade-in { animation: fadein 0.7s ease both; }
.fade-in:nth-child(2) { animation-delay: 80ms; }
.fade-in:nth-child(3) { animation-delay: 160ms; }
.fade-in:nth-child(4) { animation-delay: 240ms; }
.fade-in:nth-child(5) { animation-delay: 320ms; }
.fade-in:nth-child(6) { animation-delay: 400ms; }
@keyframes fadein { from { opacity: 0; translate: 0 12px } to { opacity: 1; translate: none } }
</style>
