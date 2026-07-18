<script setup lang="ts">
// 无结果兜底：裁决丢失（如直接刷新本页）时引导回首页。纯展示。
</script>

<template>
  <div
    class="paper-panel mx-auto flex max-w-lg flex-col items-center justify-center gap-5 rounded-3xl px-8 py-14 text-center"
  >
    <p class="text-2xl font-black text-paper-ink">契约尚未显影</p>
    <p class="text-lg text-paper-ink/60">裁决结果已随这次旅程消散，请重新启程。</p>
    <ContractButton to="/">返回入口</ContractButton>
  </div>
</template>
