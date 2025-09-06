<script setup lang="ts">
defineProps({
  image: {
    type: String,
    default:
      "https://image.loaderpro.ru/products/images/20808/ff43c6c6bfe7ef9b04a8086120f49cae.png",
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
      :src="image"
      alt="Image"
      class="w-full h-250 p-20 mb-50"
      image-class="object-contain h-full w-full"
    />
    <div
      class="flex flex-col w-full gap-15 z-2 p-20 backdrop-blur-xs bg-white/60 absolute -bottom-60 group-hover:bottom-0 transition-all"
    >
      <p class="text-lg font-medium">{{ name }}</p>
      <Button>Подробнее</Button>
    </div>
  </NuxtLink>
</template>

<style scoped></style>
