<script setup lang="ts">
import type { FileUploadUploaderEvent } from 'primevue/fileupload'
import { useToast } from 'primevue/usetoast'
import readXlsxFile from 'read-excel-file'
import { usePartsSelectionStore } from '~/stores/partsSelection'

interface PartsRow {
  titleParts?: string
  numParts?: string
  count?: number
  comment?: string
  image?: string
  id?: string
}

const toast = useToast()
const partsSelectionStore = usePartsSelectionStore()

const upLoader = async (event: FileUploadUploaderEvent) => {
  let file: File | undefined

  if (Array.isArray(event.files)) {
    file = event.files[0]
  } else {
    file = event.files
  }

  if (!file) return

  const map = {
    'Наименование запчасти': 'titleParts',
    'Каталожный номер запчасти': 'numParts',
    'Количество': 'count',
    'Комментарий': 'comment',
    'Фото': 'image',
  }

  readXlsxFile(file, { map }).then((data) => {
    const rowsWithId = data.rows.map((row: PartsRow) => ({
      id: Math.round(Date.now() + Math.random()),
      ...row,
    }))
    partsSelectionStore.add(rowsWithId)
    toast.add({
      severity: 'success',
      summary: 'Файл загружен',
      detail: 'Данные успешно обработаны',
      life: 3000,
    })
  })
}
const handleDownload = () =>
  downloadTemplate('/templates/loaderpro_parts_template.xlsx', 'loaderpro_parts_template.xlsx')
</script>

<template>
  <div class="card flex justify-center gap-15">
    <Button label="Скачать шаблон" variant="text" @click="handleDownload" />
    <FileUpload
      :custom-upload="true"
      :auto="true"
      mode="basic"
      name="file"
      accept=".xlsx"
      :max-file-size="1000000"
      choose-label="Загрузить файл"
      class="p-button-outlined"
      @uploader="upLoader"
    />
  </div>
</template>

<style scoped></style>
