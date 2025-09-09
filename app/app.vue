<script setup lang="ts">
import { watch } from "vue";
import { useAuthStore } from "@/stores/auth";

const authStore = useAuthStore();
const toast = useToast();

watch(
  () => authStore.message,
  (message) => {
    if (message) {
      if (message) {
        toast.add({
          severity: message.type,
          summary: message.title,
          detail: message.text,
          life: 3000,
        });
        authStore.message = null;
      }
    }
  },
);
</script>
<template>
  <NuxtLayout class="wrapper">
    <NuxtPage />
  </NuxtLayout>
  <Toast />
</template>

<style>
.page-enter-active,
.page-leave-active {
  transition: all 0.3s;
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
}
.layout-enter-active,
.layout-leave-active {
  transition: all 0.3s;
}
.layout-enter-from,
.layout-leave-to {
  opacity: 0;
}
</style>
