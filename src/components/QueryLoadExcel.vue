<script setup lang="ts">
import type { FileUploadUploaderEvent } from 'primevue/fileupload'
import { useToast } from 'primevue/usetoast'
import readXlsxFile from 'read-excel-file'
import { useQueryStore } from '@/stores/query.ts'
import { useBrandStore } from '@/stores/brand.ts'

interface ExcelRow {
  brand: string
  numparts: string
  count: number
  [key: string]: any
}

const toast = useToast()
const queryStore = useQueryStore()
const brandStore = useBrandStore()

const upLoader = async (event: FileUploadUploaderEvent) => {
  let file: File | undefined
  const brands = brandStore.brand.map(b => b.name) // список брендов с сервера

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

  readXlsxFile(file, { map }).then((data) => {
    const rows = (data.rows as ExcelRow[]).map(row => {
      const matchedBrand = brands.find(b =>
        String(row.brand).toLowerCase().includes(b.toLowerCase()) ||
        b.toLowerCase().includes(String(row.brand).toLowerCase())
      )
      return {
        ...row,
        brand: matchedBrand || row.brand
      }
    })
    queryStore.addQuery(rows)
    toast.add({
      severity: 'success',
      summary: 'Файл загружен',
      detail: 'Данные успешно обработаны',
      life: 3000
    })
  })
}

const downloadTemplate = async () => {
  const response = await fetch('/templates/loaderpro_query_template.xlsx')
  if (!response.ok) {
    // обработка ошибки
    return
  }
  const blob = await response.blob()
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'loaderpro_query_template.xlsx'
  link.click()
  window.URL.revokeObjectURL(url)
}
</script>

<template>
  <div class="card flex justify-center gap-15">
    <Button label="Скачать шаблон" variant="text" @click="downloadTemplate"/>
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
