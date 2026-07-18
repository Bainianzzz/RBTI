<script setup lang="ts">
defineProps<{
  interlude: string
  narrative: string
  isStreaming: boolean
}>()
</script>

<template>
  <div>
    <p
      v-if="interlude"
      class="mb-5 border-l-4 border-sun pl-4 font-display text-base italic leading-7 text-paper-ink/60"
    >
      {{ interlude }}<ScrambleCursor
        v-if="isStreaming && !narrative"
        char-class="text-parch-ink/50"
      />
    </p>

    <h1
      v-if="narrative"
      class="font-display text-xl font-black leading-8 text-paper-ink md:text-2xl md:leading-9"
    >
      {{ narrative }}<ScrambleCursor
        v-if="isStreaming"
        char-class="text-parch-ink/80"
      />
    </h1>
  </div>
</template>
