<script setup lang="ts">
import { computed } from 'vue'

import type { PetStats } from '@/types'

const props = withDefaults(
  defineProps<{
    stats: PetStats
    maxValue?: number
    size?: number
  }>(),
  {
    maxValue: 140,
    size: 320,
  },
)

const labels = ['HP', 'ATK', 'DEF', 'SpA', 'SpD', 'SPD'] as const
const values = computed<number[]>(() => [
  props.stats.hp,
  props.stats.atk,
  props.stats.def,
  props.stats.spAtk,
  props.stats.spDef,
  props.stats.speed,
])

const center = computed<number>(() => props.size / 2)
const radius = computed<number>(() => props.size * 0.36)
const angleStep = (Math.PI * 2) / labels.length

const toPoint = (ratio: number, index: number): { x: number; y: number } => {
  const angle = -Math.PI / 2 + angleStep * index
  return {
    x: center.value + Math.cos(angle) * radius.value * ratio,
    y: center.value + Math.sin(angle) * radius.value * ratio,
  }
}

const rings = computed<number[]>(() => [0.2, 0.4, 0.6, 0.8, 1])
const ringPolygons = computed<string[]>(() =>
  rings.value.map((ring) => labels.map((_, index) => toPoint(ring, index)).map((point) => `${point.x},${point.y}`).join(' ')),
)

const axes = computed<{ from: { x: number; y: number }; to: { x: number; y: number } }[]>(() =>
  labels.map((_, index) => ({
    from: { x: center.value, y: center.value },
    to: toPoint(1, index),
  })),
)

const statPolygon = computed<string>(() =>
  values.value
    .map((value, index) => toPoint(Math.max(0, Math.min(1, value / props.maxValue)), index))
    .map((point) => `${point.x},${point.y}`)
    .join(' '),
)

const labelPoints = computed<{ text: string; x: number; y: number }[]>(() =>
  labels.map((text, index) => {
    const point = toPoint(1.12, index)
    return { text, x: point.x, y: point.y }
  }),
)
</script>

<template>
  <svg :width="size" :height="size" :viewBox="`0 0 ${size} ${size}`" class="h-auto w-full">
    <defs>
      <linearGradient id="roco-radar-stroke" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#f3ddb5" />
        <stop offset="100%" stop-color="#d78631" />
      </linearGradient>
      <linearGradient id="roco-radar-fill" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="rgba(238,190,126,0.55)" />
        <stop offset="100%" stop-color="rgba(118,87,62,0.4)" />
      </linearGradient>
    </defs>

    <polygon
      v-for="(polygon, index) in ringPolygons"
      :key="index"
      :points="polygon"
      fill="none"
      stroke="rgba(230,188,128,0.3)"
      stroke-width="1"
    />

    <line
      v-for="(axis, index) in axes"
      :key="index"
      :x1="axis.from.x"
      :y1="axis.from.y"
      :x2="axis.to.x"
      :y2="axis.to.y"
      stroke="rgba(230,188,128,0.26)"
      stroke-width="1"
    />

    <circle :cx="center" :cy="center" r="4" fill="#f4d29a" />

    <polygon
      :points="statPolygon"
      fill="url(#roco-radar-fill)"
      stroke="url(#roco-radar-stroke)"
      stroke-width="2.5"
      stroke-linejoin="round"
    />

    <text
      v-for="label in labelPoints"
      :key="label.text"
      :x="label.x"
      :y="label.y"
      text-anchor="middle"
      dominant-baseline="middle"
      fill="#f2dfc2"
      font-size="13"
      font-weight="700"
      letter-spacing="0.08em"
    >
      {{ label.text }}
    </text>
  </svg>
</template>
