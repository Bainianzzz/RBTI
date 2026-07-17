<script setup lang="ts">
// 首页：工具入口，非营销页。全屏 hero 承载氛围，CTA 直达冒险。
// 视觉素材取自官网 rocom.qq.com（已在页面底部标注出处）。
</script>

<template>
  <main class="relative min-h-dvh w-full overflow-hidden">
    <!-- 全屏 hero 背景：官网同源素材 -->
    <div class="absolute inset-0">
      <img
        src="/assets/rocom-hero.avif"
        alt="洛克王国：世界 场景"
        class="hero-img h-full w-full object-cover"
        draggable="false"
      />
      <div class="absolute inset-0 bg-linear-to-b from-night/40 via-transparent to-night" />
    </div>

    <!-- 角标：官网 logo（点击溯源） -->
    <a
      href="https://rocom.qq.com/"
      target="_blank"
      rel="noopener"
      class="absolute left-5 top-5 z-10 opacity-80 transition hover:opacity-100"
    >
      <img src="/assets/rocom-logo.png" alt="洛克王国：世界" class="h-9 w-auto" draggable="false" />
    </a>

    <!-- hero 内容 -->
    <div class="relative z-10 flex min-h-dvh flex-col items-center justify-center px-6 pb-20 pt-16 text-center">
      <img
        src="/assets/rocom-kv.png"
        alt="洛克王国：世界"
        class="kv-img mb-6 w-full max-w-md select-none drop-shadow-[0_8px_30px_rgba(0,0,0,0.6)] md:max-w-lg"
        draggable="false"
      />

      <p class="mb-1 text-glow text-base font-medium tracking-[0.2em] text-gold md:text-lg">
        本命精灵契约
      </p>
      <p class="mb-10 max-w-md text-sm leading-relaxed text-ink/80">
        精灵契约之日，你将走过一整天的奇遇。<br />
        每一次选择与心声，都会指引你的本命精灵在黄昏显现。
      </p>

      <NuxtLink
        to="/adventure"
        class="btn-gold group inline-flex items-center gap-2 rounded-md px-9 py-3 text-sm font-semibold tracking-wide transition"
      >
        启程
        <svg class="h-4 w-4 transition-transform group-hover:translate-x-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M13 6l6 6-6 6" stroke-linecap="round" stroke-linejoin="round" /></svg>
      </NuxtLink>

      <!-- 出处标注 -->
      <p class="absolute bottom-4 left-0 right-0 px-6 text-center text-[10px] leading-relaxed text-ink/40">
        视觉素材及世界观 © 《洛克王国：世界》腾讯魔方工作室群 · 图鉴数据见 wiki.biligame.com/rocom
      </p>
    </div>
  </main>
</template>

<style scoped>
.hero-img { animation: fadein 1.2s ease both; }
.kv-img { animation: rise 1s 0.2s ease both; }
@keyframes fadein { from { opacity: 0 } to { opacity: 1 } }
@keyframes rise { from { opacity: 0; transform: translateY(20px) } to { opacity: 1; transform: none } }
</style>
