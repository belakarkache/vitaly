<template>
  <div
    class="relative inline-flex items-center justify-center"
    :style="{ width: size + 'px', height: size + 'px' }"
    role="img"
    :aria-label="`Você consumiu ${Math.round(current)} de ${Math.round(goal)} quilocalorias`"
  >
    <svg
      :viewBox="`0 0 ${normalizedSize} ${normalizedSize}`"
      :width="size"
      :height="size"
      class="-rotate-90"
    >
      <circle
        :cx="center"
        :cy="center"
        :r="radius"
        :stroke-width="strokeWidth"
        fill="none"
        class="stroke-neutral-800/40"
      />

      <circle
        :cx="center"
        :cy="center"
        :r="radius"
        :stroke-width="strokeWidth"
        fill="none"
        :stroke-dasharray="circumference"
        :stroke-dashoffset="dashOffset"
        stroke-linecap="round"
        class="stroke-emerald-400 transition-all duration-700 ease-out"
      />
    </svg>

    <div class="absolute inset-0 flex flex-col items-center justify-center text-center">
      <div class="text-3xl font-semibold leading-tight text-primary-400">
        {{ formattedCurrent }}
      </div>
      <div class="text-xs opacity-80">de {{ formattedGoal }} kcal</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  current: { type: Number, required: true },
  goal: { type: Number, required: true },
  size: { type: Number, default: 150 },
  strokeWidth: { type: Number, default: 8 },
})

const normalizedSize = computed(() => props.size)
const center = computed(() => normalizedSize.value / 2)
const radius = computed(() => center.value - props.strokeWidth / 2)
const circumference = computed(() => 2 * Math.PI * radius.value)

const progress = computed(() => {
  if (!props.goal || props.goal <= 0) return 0
  return Math.min(props.current / props.goal, 1)
})

const dashOffset = computed(() => circumference.value - circumference.value * progress.value)

const formattedCurrent = computed(() => Math.round(props.current).toLocaleString('pt-BR'))
const formattedGoal = computed(() => Math.round(props.goal).toLocaleString('pt-BR'))
</script>
