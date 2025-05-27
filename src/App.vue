<script setup lang="ts">
import HeaderApp from '@/components/HeaderApp.vue'
import FooterApp from '@/components/FooterApp.vue'
</script>

<template>
  <div class="relative flex flex-col h-full text-base">
    <HeaderApp />
    <RouterView />
    <FooterApp />
  </div>
</template>

<style scoped>

</style>
