<script setup lang="ts">
// 出错态：错误文案 + 重试按钮。
defineProps<{ error: string }>()
const emit = defineEmits<{ retry: [] }>()
</script>

<template>
  <div class="paper-panel rounded-3xl px-6 py-20 text-center">
    <p class="text-base font-black text-rose-700">旅途中遇到了一点意外</p>
    <p class="mx-auto mt-2 max-w-md break-all text-sm text-paper-ink/55">{{ error }}</p>
    <ContractButton size="sm" class="mt-6" @click="emit('retry')">再试一次</ContractButton>
  </div>
</template>
