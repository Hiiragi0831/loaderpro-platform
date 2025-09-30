<template>
  <svg viewBox="0 0 128 128" class="w-32 h-32">
    <!-- Серый фон круга -->
    <circle
        cx="64"
        cy="64"
        r="58"
        fill="none"
        stroke="#D1D5DB"
        stroke-width="6"
    />

    <!-- Круг прогресса -->
    <circle
        cx="64"
        cy="64"
        r="58"
        fill="none"
        :stroke="color"
        stroke-width="6"
        stroke-linecap="round"
        :stroke-dasharray="circumference"
        :stroke-dashoffset="dashOffset"
        transform="rotate(-90 64 64)"
    />
  </svg>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  percent: {
    type: Number,
    required: true,
    default: 0,
  },
  color: {
    type: String,
    default: '#f79633' // синий цвет (tailwind blue-500)
  }
})

const radius = 58
const circumference = 2 * Math.PI * radius

const dashOffset = computed(() => {
  return circumference * (1 - props.percent / 100)
})
</script>

<style scoped>
svg {
  display: block;
}
</style>
