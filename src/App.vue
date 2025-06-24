<script setup lang="ts">
import HeaderApp from '@/components/HeaderApp.vue'
import FooterApp from '@/components/FooterApp.vue'
import { useBrandStore } from '@/stores/brand.ts'
import { onMounted } from 'vue'

const brandStore = useBrandStore()
onMounted(() => {
  brandStore.getBrands()
})
</script>

<template>
  <HeaderApp />
  <RouterView />
  <FooterApp />
</template>

<style scoped></style>
