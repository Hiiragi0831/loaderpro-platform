<script setup lang="ts">
import { defineProps, computed } from 'vue'
import SpeedBg from "@/components/icons/SpeedBg.vue";
import SpeedLine from "@/components/icons/SpeedLine.vue";

const props = defineProps({
  percentage: { type: Number, default: 0 }
})

// 0% — 270°, 100% — 90°
const pointerAngle = computed(() => {
  const percent = props.percentage
  return 270 - (percent * -180) / 100
})
</script>

<template>
  <div class="speedometer">
    <div class="speedometer__picture">
      <div class="speedometer__bg">
        <SpeedBg />
      </div>
      <div
          class="speedometer__line"
          :style="`transform: rotate(${pointerAngle}deg); transform-origin: bottom center;`"
      >
        <SpeedLine />
      </div>
    </div>
    <div class="speedometer__value">{{ props.percentage }}%</div>
  </div>
</template>

<style scoped>
.speedometer {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.speedometer__bg {
  width: calc(230 * var(--width-multiplier));
  height: calc(108 * var(--width-multiplier));
}
.speedometer__picture {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
}
.speedometer__line {
  position: absolute;
  width: calc(9 * var(--width-multiplier));
  height: calc(98 * var(--width-multiplier));

  svg {
    left: calc(-4 * var(--width-multiplier));
  }
}
.speedometer__value {
  font-weight: 700;
  font-size: calc(21 * var(--width-multiplier));
  line-height: calc(32 * var(--width-multiplier));
}

@media (max-width: 1024px) {
  .speedometer {
    order: 3;
  }
}
</style>
