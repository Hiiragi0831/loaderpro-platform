<script setup lang="ts">
const authStore = useAuthStore();
const logOut = useLogout();

const onCheck = async () => {
  await authStore.checkToken();
};
const onOut = async () => {
  await logOut();
};
</script>

<template>
  <main class="relative grid">
    <section>
      <div class="container m-auto">
        <p>Главная</p>
        <Button label="Проверка токена" class="w-full" @click="onCheck" />
        <Button label="Выйти" class="w-full" @click="onOut" />
      </div>
    </section>
  </main>
</template>
