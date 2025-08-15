<script setup lang="ts">
import { defineProps } from "vue";
const props = defineProps({
  stamp: {
    type: String,
    default: "LUDA (RJ3)",
  },
  model: {
    type: String,
    default: "ARC-1",
  },
  serialNumber: {
    type: String,
    default: "11111111111",
  },
  yearProduction: {
    type: String,
    default: "1999",
  },
});
const colons = [
  { label: "Марка", value: props.stamp },
  { label: "Модель", value: props.model },
  { label: "Серийный номер", value: props.serialNumber },
  { label: "Год выпуска", value: props.yearProduction },
];
</script>

<template>
  <div class="grid grid-cols-5 px-30 py-60 bg-zinc-100 rounded-2xl">
    <div v-for="col in colons" :key="col.value" class="flex flex-col gap-10">
      <p class="font-bold text-xl">{{ col.label }}</p>
      <p class="text-xl">{{ col.value }}</p>
    </div>
    <div class="flex items-center justify-end">
      <Button size="large">Запросить запчасти</Button>
    </div>
  </div>
</template>

<style scoped></style>
