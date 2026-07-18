<script setup lang="ts">
defineProps<{
  options: string[]
  selectedOption: string | null
  disabled: boolean
}>()

const emit = defineEmits<{
  select: [option: string]
}>()
</script>

<template>
  <TransitionGroup
    name="rise"
    tag="div"
    class="mt-7 flex flex-col gap-3"
    appear
  >
    <button
      v-for="option in options"
      :key="option"
      :data-answer-option="option"
      :disabled="disabled"
      class="answer-option group min-h-13 rounded-lg border-2 px-4 py-3 text-left font-display text-base font-bold leading-6 transition-colors disabled:cursor-wait disabled:opacity-70 sm:px-5"
      :class="
        selectedOption === option
          ? 'border-gold bg-coal text-gold'
          : 'border-paper-ink/15 bg-coal text-ink hover:border-sun hover:bg-coal-soft'
      "
      @click="emit('select', option)"
    >
      <span
        class="mr-2 inline-block text-sun transition-opacity"
        :class="selectedOption === option ? 'opacity-100' : 'opacity-0 group-hover:opacity-60'"
      >◆</span>
      {{ option }}
    </button>
  </TransitionGroup>
</template>
