<script setup lang="ts">
import { ArrowRight } from 'lucide-vue-next'
import '~/assets/css/index/hero.css'

// 首页：保持无背景图，以官网 nav 的炭黑/暖金语言组织入口。
</script>

<template>
  <PageShell centered class="py-16">
    <GoldRule diamond="hollow" class="fade-in mb-6" />

    <p class="fade-in font-display text-base font-black tracking-[0.22em] text-ink">洛克王国：世界</p>
    <h1 class="fade-in text-glow mt-3 font-display text-4xl font-black tracking-wide text-gold sm:text-5xl md:text-6xl">
      本命精灵契约
    </h1>

    <p class="fade-in mt-7 max-w-xl text-base font-medium leading-8 text-ink/75 md:text-lg">
      踏入未知副本，与精灵伙伴一同探索秘境。<br />
      每一次选择与心声，都会让你的本命精灵回应契约。
    </p>

    <ContractButton
      to="/adventure"
      variant="gold"
      size="lg"
      :icon="ArrowRight"
      class="fade-in group mt-10"
    >
      开始契约
    </ContractButton>

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
  </PageShell>
</template>
