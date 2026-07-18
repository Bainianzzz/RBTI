<script setup lang="ts">
import { ArrowRight } from 'lucide-vue-next'

defineProps<{
  canSubmit: boolean
  submitting: boolean
}>()

const emit = defineEmits<{
  submit: []
}>()

const freeInput = defineModel<string>({ required: true })
</script>

<template>
  <div>
    <div class="mt-6">
      <label class="mb-2 block text-sm font-black text-paper-ink/65">
        或者，写下你的心声<span class="font-medium text-paper-ink/40">（可选）</span>
      </label>
      <textarea
        v-model="freeInput"
        rows="3"
        placeholder="用一句话说说你会怎么做、心里在想什么…"
        class="w-full resize-none rounded-lg border-2 border-paper-ink/12 bg-white/55 px-4 py-3 text-base leading-7 text-paper-ink placeholder:text-paper-ink/35 focus:border-sun focus:outline-hidden"
      />
    </div>

    <div class="mt-6 flex flex-col items-stretch justify-between gap-4 sm:flex-row sm:items-center">
      <span class="text-sm font-medium text-paper-ink/50">
        {{ canSubmit ? '你的选择将塑造接下来的旅程' : '选一个选项，或写下你的答案' }}
      </span>
      <ContractButton
        :disabled="!canSubmit"
        :loading="submitting"
        loading-text="记录中…"
        :icon="ArrowRight"
        @click="emit('submit')"
      >
        继续旅程
      </ContractButton>
    </div>
  </div>
</template>
