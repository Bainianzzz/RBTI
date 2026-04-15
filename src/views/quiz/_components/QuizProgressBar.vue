<script setup lang="ts">
defineProps<{
  value: number
}>()
</script>

<template>
  <div class="quiz-progress-track h-2 rounded-full">
    <div
      class="quiz-progress-fill h-full rounded-full"
      :style="{ width: `${value}%` }"
    />
  </div>
</template>

<style scoped>
.quiz-progress-track {
  background-color: var(--color-progress-track-warm);
}

.quiz-progress-fill {
  background-image: linear-gradient(
    to right,
    var(--color-progress-fill-warm-start),
    var(--color-progress-fill-warm-mid),
    var(--color-progress-fill-warm-end)
  );
}
</style>
