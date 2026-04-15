<script setup lang="ts">
import eggImage from '@/assets/egg.png'

const props = withDefaults(defineProps<{
  petSrc: string
  petName: string
  exportMode?: boolean
  loading?: 'eager' | 'lazy'
}>(), {
  exportMode: false,
  loading: 'lazy',
})
</script>

<template>
  <div class="relative mx-auto h-72 w-full max-w-[18rem]">
    <img
      :src="petSrc"
      :alt="petName"
      :loading="loading"
      decoding="async"
      :class="[
        'absolute top-1/2 left-1/2 z-0 max-h-72 w-auto max-w-full shrink-0 -translate-x-1/2 -translate-y-1/2 object-contain',
        props.exportMode ? '' : 'hatch-pet',
      ]"
    />
    <img
      v-if="!props.exportMode"
      :src="eggImage"
      alt=""
      aria-hidden="true"
      decoding="async"
      class="hatch-egg pointer-events-none absolute top-1/2 left-1/2 z-10 max-h-72 w-auto max-w-full -translate-x-1/2 -translate-y-1/2 object-contain"
    />
    <div
      v-if="!props.exportMode"
      aria-hidden="true"
      class="hatch-flash pointer-events-none absolute top-1/2 left-1/2 z-20 h-40 w-40 rounded-full"
    />
  </div>
</template>

<style scoped>
.hatch-pet {
  opacity: 0;
  transform: scale(0.35);
  animation: hatch-pet-reveal 680ms cubic-bezier(0.23, 1, 0.32, 1) 860ms forwards;
}

.hatch-egg {
  transform-origin: center 72%;
  animation:
    hatch-egg-wobble 780ms ease-in-out 1,
    hatch-egg-disappear 260ms ease-out 780ms forwards;
}

.hatch-flash {
  transform: translate(-50%, -50%) scale(0.2);
  background: radial-gradient(circle, rgba(255, 255, 255, 0.95) 0%, rgba(255, 244, 176, 0.5) 45%, rgba(255, 244, 176, 0) 75%);
  opacity: 0;
  animation: hatch-flash-burst 420ms ease-out 770ms forwards;
}

@keyframes hatch-egg-wobble {
  0%,
  100% {
    transform: rotate(0deg) translateX(0);
  }
  20% {
    transform: rotate(-8deg) translateX(-4px);
  }
  40% {
    transform: rotate(8deg) translateX(4px);
  }
  60% {
    transform: rotate(-6deg) translateX(-3px);
  }
  80% {
    transform: rotate(6deg) translateX(3px);
  }
}

@keyframes hatch-egg-disappear {
  0% {
    opacity: 1;
    transform: scale(1);
  }
  100% {
    opacity: 0;
    transform: scale(1.1);
  }
}

@keyframes hatch-pet-reveal {
  0% {
    opacity: 0;
    transform: scale(0.35);
  }
  70% {
    opacity: 1;
    transform: scale(1.05);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes hatch-flash-burst {
  0% {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.2);
  }
  35% {
    opacity: 0.95;
  }
  100% {
    opacity: 0;
    transform: translate(-50%, -50%) scale(1.35);
  }
}

@media (prefers-reduced-motion: reduce) {
  .hatch-pet,
  .hatch-egg,
  .hatch-flash {
    animation: none;
    opacity: 1;
    transform: none;
  }

  .hatch-egg,
  .hatch-flash {
    display: none;
  }
}
</style>
