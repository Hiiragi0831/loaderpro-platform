<script setup lang="ts">
import type { FileUploadUploaderEvent } from 'primevue/fileupload'
import { useToast } from 'primevue/usetoast'
import readXlsxFile from 'read-excel-file'
import { useQueryStore } from '@/stores/query.ts'

const toast = useToast()
const queryStore = useQueryStore()

const upLoader = async (event: FileUploadUploaderEvent) => {
  let file: File | undefined

  if (Array.isArray(event.files)) {
    file = event.files[0]
  } else {
    file = event.files
  }

  if (!file) return

  const map = {
    'Бренд': 'brand',
    'Номер запчасти': 'numparts',
    'Количество': 'count',
  }

  readXlsxFile(file, {map}).then((data) => {
    console.log(data.rows);
    queryStore.addQuery(data.rows)
  })
}
</script>

<template>
  <div class="card flex justify-center">
    <Toast />
    <FileUpload
      :customUpload="true"
      :auto="true"
      mode="basic"
      name="file"
      accept=".xlsx"
      :maxFileSize="1000000"
      @uploader="upLoader"
      chooseLabel="Загрузить файл"
      class="p-button-outlined"
    />
  </div>
</template>

<style scoped></style>
