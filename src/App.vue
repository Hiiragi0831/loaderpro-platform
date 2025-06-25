<script setup lang="ts">
import HeaderApp from '@/components/HeaderApp.vue'
import FooterApp from '@/components/FooterApp.vue'
import { useBrandStore } from '@/stores/brand.ts'
import { onMounted, watch } from 'vue'
import { useAuthStore } from '@/stores/auth.ts'
import { useToast } from 'primevue/usetoast'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const brandStore = useBrandStore()
const toast = useToast()
const router = useRouter()

onMounted(() => {
  brandStore.getBrands()
})

watch(
  [() => authStore.message, () => authStore.isAuthenticated],
  ([message, isAuthenticated]) => {
    if (message) {
      toast.add({ severity: message.type, summary: message.title, detail: message.text, life: 3000 })
      authStore.message = null
    }
    if (!isAuthenticated) {
      router.push({ name: 'login' })
    }
  },
  { immediate: true }
)
</script>

<template>
  <HeaderApp v-if="authStore.isAuthenticated"/>
  <RouterView />
  <FooterApp v-if="authStore.isAuthenticated"/>
  <Toast />
</template>

<style scoped></style>


<!--
Если не авторизован
то показываем страницу регистрации или входа
если пользователь хочет попасть на защищённую страницу то переводим его на страницу входа
Если авторизован направляем на домашнюю страницу

процесс авторизации
мы отправляем запрос на сервер с логином и паролем
если авторизация успешна то сервер возвращает токен
и мы сохраняем его в localStorage
и переходим на домашнюю страницу
Если авторизация не успешна то показываем ошибку
-->
