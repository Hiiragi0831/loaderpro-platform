<script setup lang="ts">
const authStore = useAuthStore()
const brandStore = useBrandStore()

onMounted(() => {
  brandStore.getBrands()
})
</script>

<template>
  <div v-if="authStore.isAuthenticated" key="main-layout" class="wrapper">
    <AppHeader />
    <div>
      <slot />
    </div>
    <AppFooter />
  </div>
  <div v-else key="auth-layout" class="wrapper">
    <slot />
  </div>
</template>

<style scoped></style>
