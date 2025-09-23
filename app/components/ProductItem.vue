<script setup lang="ts">
defineProps({
  image: {
    type: String,
    default: "",
  },
  link: {
    type: String,
    default: "product/1",
  },
  name: {
    type: String,
    default: "Название товара",
  },
});
</script>

<template>
  <NuxtLink
    class="flex flex-col relative shadow-xl rounded-2xl overflow-hidden group bg-white"
    :to="link"
  >
    <Image
      v-if="image"
      :src="image"
      :alt="name"
      class="w-full h-250 p-20 mb-50"
      image-class="object-contain h-full w-full"
    />
    <img v-if="!image" src="@/assets/images/no-photo.jpg" class="w-full h-250 p-20 mb-50 object-contain" :alt="name">
    <div
      class="flex flex-col w-full gap-15 z-2 p-20 backdrop-blur-xs bg-white/60 absolute -bottom-60 group-hover:bottom-0 transition-all"
    >
      <p class="text-lg font-medium">{{ name }}</p>
      <Button>Подробнее</Button>
    </div>
  </NuxtLink>
</template>

<style scoped></style>
