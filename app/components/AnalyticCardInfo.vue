<script setup lang="ts">
import {computed, defineProps} from 'vue'
import ArrowUp from "@/components/icons/ArrowUp.vue";
import ArrowDown from "@/components/icons/ArrowDown.vue";
import {useFormatter} from "@/utils/useFormatter";

const props = defineProps({
  title: {
    type: String,
    default: 'Заголовок'
  },
  number: {
    type: Object as () => { value: number, type: string },
    default: () => ({ value: 0, type: '' })
  },
  percentage: {
    type: Number,
    default: 0
  }
})
const formatter = useFormatter();
const formattedNumber = computed(() => {
  if (props.number.type === 'currency') {
    return formatter.formatMoney(props.number.value);
  }
  // По умолчанию — обычное число
  return formatter.formatNumber(props.number.value);
});
</script>

<template>
  <div class="card">
    <div class="card__title">
      {{ props.title }}
    </div>
    <div class="card__content">
      <div class="card__number">
        {{ formattedNumber }}
      </div>
      <div :class="`card__percentage ${props.percentage > 0 ? 'text-green' : 'text-red'}`">
        {{ props.percentage }} %
        <ArrowUp v-if="props.percentage > 0" />
        <ArrowDown v-if="props.percentage < 0" />
      </div>
    </div>

  </div>
</template>

<style scoped>
.card {
  border: 1px solid #F79633;
  padding: calc(15 * var(--width-multiplier));
  border-radius: calc(10 * var(--width-multiplier));
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: calc(40 * var(--width-multiplier));
}
.card__title {
  font-weight: 500;
  font-size: calc(14 * var(--width-multiplier));
  line-height: calc(18 * var(--width-multiplier));
  letter-spacing: 1px;
  color: #71717A;
  text-transform: uppercase;
}
.card__content {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}
.card__number {
  font-weight: 700;
  font-size: calc(40 * var(--width-multiplier));
  line-height: calc(32 * var(--width-multiplier));
  vertical-align: bottom;
}
.card__percentage {
  font-weight: 500;
  font-size: calc(18 * var(--width-multiplier));
  line-height: calc(21 * var(--width-multiplier));
  text-align: right;
  display: flex;
  align-items: center;
}
.card__percentage.text-green {
  color: #22C55E; /* Green color */
}
.card__percentage.text-red {
  color: #EF4444; /* Red color */
}

.card__percentage svg {
  width: calc(10 * var(--width-multiplier));
  height: calc(10 * var(--width-multiplier));
  margin-left: calc(4 * var(--width-multiplier));
}

@media (max-width: 1024px) {
  .card {
    gap: calc(20 * var(--width-multiplier));
  }
  .card__number {
    font-size: calc(36 * var(--width-multiplier));
  }
}
</style>
