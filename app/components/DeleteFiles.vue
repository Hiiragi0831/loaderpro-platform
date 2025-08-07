<script setup lang="ts">
import { useToast } from "primevue/usetoast";
import { useApi } from "~/composables/useApi";

const props = defineProps<{
  idStart: number;
  idEnd: number;
}>();

const toast = useToast();
const deleteSingleFile = async (id: number) => {
  const res = await fetch(`${useApi().apiUrl}/uploads/${id}`, {
    method: "DELETE",
  });
  toast.add({
    severity: res.ok ? "success" : "error",
    summary: res.ok ? "Удалено" : "Ошибка",
    detail: res.ok ? "Файл удалён" : "Не удалось удалить файл",
    life: 3000,
  });
};

const deleteFiles = async () => {
  for (let id = props.idStart; id <= props.idEnd; id++) {
    await deleteSingleFile(id);
  }
};
</script>

<template>
  <Button @click="deleteFiles">Удалить файл</Button>
</template>

<style scoped></style>
