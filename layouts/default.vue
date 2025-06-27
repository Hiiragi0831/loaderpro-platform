<script setup lang="ts">
const authStore = useAuthStore()
</script>

<template>
  <div v-if="authStore.isAuthenticated" key="main-layout" class="wrapper">
    <AppHeader v-if="authStore.isAuthenticated" />
    <div>
      <slot />
    </div>
    <AppFooter v-if="authStore.isAuthenticated" />
  </div>
  <div v-else key="auth-layout" class="wrapper">
    <slot />
  </div>
</template>

<style scoped></style>
