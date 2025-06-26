<script setup lang="ts">
import HeaderApp from '@/components/HeaderApp.vue'
import FooterApp from '@/components/FooterApp.vue'
import { useBrandStore } from '@/stores/brand.ts'
import { watch } from 'vue'
import { useAuthStore } from '@/stores/auth.ts'
import { useToast } from 'primevue/usetoast'

const authStore = useAuthStore()
const brandStore = useBrandStore()
const toast = useToast()

watch(
  [() => authStore.message, () => authStore.isAuthenticated],
  async ([message, isAuthenticated]) => {
    if (message) {
      toast.add({ severity: message.type, summary: message.title, detail: message.text, life: 3000 })
      authStore.message = null
    }

    // Загружаем бренды при успешной авторизации
    if (isAuthenticated) {
      await brandStore.getBrands()
    }
  },
  { immediate: true }
)
</script>

<template>
  <Transition name="fade" mode="out-in">
    <div v-if="authStore.isAuthenticated" key="main-layout" class="wrapper">
      <HeaderApp />
      <RouterView />
      <FooterApp />
    </div>
    <div v-else key="auth-layout" class="wrapper">
      <RouterView />
    </div>
  </Transition>
  <Toast />
</template>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
