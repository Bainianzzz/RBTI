<script setup lang="ts">
// 首页：工具入口。深色夜空 + 星点底纹，克制不花哨，CTA 直达冒险。
</script>

<template>
  <main class="starfield relative flex min-h-dvh w-full flex-col items-center justify-center overflow-hidden px-6 text-center">
    <!-- 标题区 -->
    <p class="fade-in mb-2 text-xs tracking-[0.4em] text-gold/70">洛克王国 · 世界</p>
    <h1 class="fade-in text-glow text-3xl font-bold tracking-wide text-gold md:text-4xl">
      本命精灵契约
    </h1>

    <p class="fade-in mt-6 max-w-sm text-sm leading-relaxed text-ink/70">
      精灵契约之日，你将走过一整天的奇遇。<br />
      每一次选择与心声，都会指引你的本命精灵在黄昏显现。
    </p>

    <NuxtLink
      to="/adventure"
      class="btn-gold fade-in group mt-10 inline-flex items-center gap-2 rounded-md px-9 py-3 text-sm font-semibold tracking-wide transition"
    >
      启程
      <svg class="h-4 w-4 transition-transform group-hover:translate-x-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M13 6l6 6-6 6" stroke-linecap="round" stroke-linejoin="round" /></svg>
    </NuxtLink>

    <!-- 出处标注 -->
    <p class="fade-in absolute bottom-5 left-0 right-0 px-6 text-center text-[10px] leading-relaxed text-ink/30">
      世界观 © 《洛克王国：世界》腾讯魔方工作室群 · 图鉴数据见 wiki.biligame.com/rocom
    </p>
  </main>
</template>

<style scoped>
.fade-in { animation: fadein 0.8s ease both; }
.fade-in:nth-child(2) { animation-delay: 0.1s; }
.fade-in:nth-child(3) { animation-delay: 0.2s; }
.fade-in:nth-child(4) { animation-delay: 0.3s; }
@keyframes fadein { from { opacity: 0; transform: translateY(12px) } to { opacity: 1; transform: none } }
</style>
