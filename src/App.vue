<script setup lang="ts">
import HeaderApp from '@/components/HeaderApp.vue'
</script>

<template>
  <div class="relative flex flex-col h-full text-base">
    <HeaderApp />
    <RouterView />
    <footer>
      <p>Footer</p>
    </footer>
  </div>
</template>

<style scoped>

</style>
