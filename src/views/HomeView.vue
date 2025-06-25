<script setup lang="ts">
import { useAuthStore } from '@/stores/auth.ts'

const authStore = useAuthStore()

const onCheck = async () => {
  await authStore.checkToken()
}
</script>

<template>
  <main class="relative grid">
    <section>
      <div class="container m-auto">
        <p>Главная</p>
        <Button label="Проверка токена" class="w-full" @click="onCheck" />
      </div>
    </section>
  </main>
</template>
