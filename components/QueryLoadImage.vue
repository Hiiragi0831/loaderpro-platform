<script setup lang="ts">
import type { FileUploadUploaderEvent } from 'primevue/fileupload'
import { useToast } from 'primevue/usetoast'

const toast = useToast()

const upLoader = async (event: FileUploadUploaderEvent) => {
  const formData = new FormData()
  const files = event.files

  if (Array.isArray(files)) {
    formData.append('file', files[0])
  } else if (files instanceof File) {
    formData.append('file', files)
  }

  const res = await fetch(`${import.meta.env.VITE_API_URL}/uploads/`, {
    method: 'POST',
    body: formData,
  })
  const data = await res.json()
  console.log(data)
  toast.add({
    severity: res.ok ? 'success' : 'error',
    summary: res.ok ? 'Успех' : 'Ошибка',
    detail: data.message || (res.ok ? 'Файл загружен' : 'Не удалось загрузить файл'),
    life: 3000,
  })
}

// const deleteFile = async (id: number) => {
//   const res = await fetch(`${import.meta.env.VITE_API_URL}/uploads/${id}`, {
//     method: 'DELETE',
//   })
//   toast.add({
//     severity: res.ok ? 'success' : 'error',
//     summary: res.ok ? 'Удалено' : 'Ошибка',
//     detail: res.ok ? 'Файл удалён' : 'Не удалось удалить файл',
//     life: 3000,
//   })
// }
//
// <Button @click="deleteFile(3033)">Удалить файл</Button>
</script>

<template>
  <div class="card flex justify-center">
    <FileUpload
      :custom-upload="true"
      :auto="true"
      mode="basic"
      name="file"
      accept="image/*"
      :max-file-size="1000000"
      choose-label="Загрузить файл"
      class="p-button-outlined"
      @uploader="upLoader"
    />
  </div>
</template>

<style scoped></style>
