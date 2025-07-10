<script setup lang="ts">
import { useBrandStore } from '~/stores/brand'
import { computed } from 'vue'
import { useField, useForm } from 'vee-validate'
import { partsSelectionTransport } from '~/schema/partsSelectionTransport'
import type { FileUploadUploaderEvent } from 'primevue/fileupload'

const emit = defineEmits<{
  (e: 'select', id: number): void
}>()

const brandStore = useBrandStore()
const brands = computed(() => brandStore.brand)
const selectedFiles = ref<File[]>([])
const uploadedFiles = ref<{ id: string; url: string }[]>([])
const loadingFiles = ref<number[]>([])
const toast = useToast()

const { handleSubmit, errors, handleReset } = useForm({
  validationSchema: partsSelectionTransport,
})

const { value: transport_brand } = useField('transport_brand')
const { value: transport_model } = useField<string>('transport_model')
const { value: transport_year_production } = useField<string>('transport_year_production')
const { value: transport_prefix } = useField<string>('transport_prefix')
const { value: transport_serial_number } = useField<string>('transport_serial_number')

const { value: engine_brand } = useField<string>('engine_brand')
const { value: engine_model } = useField<string>('engine_model')
const { value: engine_voltage } = useField<string>('engine_voltage')
const { value: engine_fuel_type } = useField<string>('engine_fuel_type')
const { value: engine_serial_number } = useField<string>('engine_serial_number')

const { value: mast_brand } = useField<string>('mast_brand')
const { value: mast_model } = useField<string>('mast_model')
const { value: mast_height } = useField<number>('mast_height')
const { value: mast_serial_number } = useField<string>('mast_serial_number')
const { value: mast_sections } = useField<number>('mast_sections')
const { value: mast_cylinders } = useField<number>('mast_cylinders')

const { value: text_comment } = useField<string>('text_comment')

const upLoader = async (event: FileUploadUploaderEvent) => {
  const files = Array.isArray(event.files) ? event.files : [event.files]
  selectedFiles.value.push(...files)
  for (const [i, file] of files.entries()) {
    const idx = selectedFiles.value.length - files.length + i
    loadingFiles.value.push(idx)
    const formData = new FormData()
    formData.append('file', file)
    const res = await fetch(`${import.meta.env.VITE_API_URL}/uploads`, {
      method: 'POST',
      body: formData,
    })
    if (res.ok) {
      const json = await res.json()
      uploadedFiles.value[idx] = { id: json.id, url: json.url }
    }
    loadingFiles.value = loadingFiles.value.filter((n) => n !== idx)
  }
}

const removeFile = (index: number) => {
  selectedFiles.value.splice(index, 1)
  uploadedFiles.value.splice(index, 1)
}

const getFileUrl = (file: File) => {
  return URL.createObjectURL(file)
}

const clearForm = () => {
  handleReset()
  selectedFiles.value = []
  uploadedFiles.value = []
}

const onSubmit = handleSubmit(async (values) => {
  const payload = {
    ...values,
    images: uploadedFiles.value.map((f) => f.url),
  }
  // Заменяем undefined на пустую строку
  Object.keys(payload).forEach((key) => {
    if ((payload as Record<string, unknown>)[key] === undefined) {
      ;(payload as Record<string, unknown>)[key] = ''
    }
  })
  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/transport`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (res.ok) {
      const data = await res.json()
      emit('select', data.id)
      toast.add({
        severity: 'success',
        summary: 'Успех',
        detail: 'Заявка успешно отправлена!',
        life: 4000,
      })
      clearForm()
    } else {
      const error = await res.text()
      toast.add({ severity: 'error', summary: 'Ошибка', detail: error, life: 4000 })
    }
  } catch (e) {
    toast.add({ severity: 'error', summary: 'Ошибка', detail: String(e), life: 4000 })
  }
})
</script>

<template>
  <section>
    <div class="container mx-auto flex flex-col gap-15">
      <h2>Подбор запчастей</h2>
      <form class="flex flex-col gap-25" @submit="onSubmit">
        <div class="shadow-lg rounded bg-white">
          <div class="flex justify-between items-center p-25">
            <h3>Информация о транспортном средстве</h3>
          </div>
          <hr class="border-zinc-300" >
          <div class="grid grid-cols-5 items-center gap-20 p-25">
            <FloatLabel variant="on" class="h-full">
              <Select
                v-model="transport_brand"
                label-id="transport_brand"
                :options="brands"
                option-label="name"
                option-value="name"
                filter
                class="w-full h-full"
                fluid
                :invalid="!!errors?.transport_brand"
              />
              <label for="brand">Бренд*</label>
              <Message
                v-if="errors?.transport_brand"
                severity="error"
                size="small"
                variant="simple"
                class="absolute"
                >{{ errors?.transport_brand }}
              </Message>
            </FloatLabel>
            <FloatLabel variant="on" class="h-full">
              <InputText
                id="transport_model"
                v-model="transport_model"
                :invalid="!!errors?.transport_model"
                class="h-full"
              />
              <Message
                v-if="errors?.transport_model"
                severity="error"
                size="small"
                variant="simple"
                class="absolute"
              >
                {{ errors.transport_model }}
              </Message>
              <label for="transport_model">Модель*</label>
            </FloatLabel>
            <FloatLabel variant="on" class="h-full">
              <InputText
                id="transport_year_production"
                v-model="transport_year_production"
                fluid
                :invalid="!!errors?.transport_year_production"
                class="h-full"
              />
              <Message
                v-if="errors?.transport_year_production"
                severity="error"
                size="small"
                variant="simple"
                class="absolute"
              >
                {{ errors.transport_year_production }}
              </Message>
              <label for="transport_model">Год производства*</label>
            </FloatLabel>
            <FloatLabel variant="on" class="h-full">
              <InputText
                id="transport_serial_number"
                v-model="transport_serial_number"
                class="h-full"
              />
              <label for="transport_serial_number">Серийный номер*</label>
            </FloatLabel>
            <FloatLabel variant="on" class="h-full">
              <InputText id="transport_prefix" v-model="transport_prefix" class="h-full" />
              <label for="transport_prefix">Префикс</label>
            </FloatLabel>
          </div>
        </div>
        <div class="shadow-lg rounded bg-white">
          <div class="flex justify-between items-center p-25">
            <h3>Двигатель</h3>
          </div>
          <hr class="border-zinc-300" >
          <div class="grid grid-cols-5 items-center gap-15 p-25">
            <FloatLabel variant="on" class="h-full">
              <Select
                v-model="engine_brand"
                label-id="engine_brand"
                :options="brands"
                option-label="name"
                option-value="name"
                filter
                class="w-full h-full"
                fluid
              />
              <label for="engine_brand">Бренд</label>
            </FloatLabel>
            <FloatLabel variant="on" class="h-full">
              <InputText id="engine_model" v-model="engine_model" class="h-full" />
              <label for="engine_model">Модель</label>
            </FloatLabel>
            <FloatLabel variant="on" class="h-full">
              <InputText id="engine_voltage" v-model="engine_voltage" class="h-full" />
              <label for="engine_voltage">Напряжение</label>
            </FloatLabel>
            <FloatLabel variant="on" class="h-full">
              <InputText id="engine_fuel_type" v-model="engine_fuel_type" class="h-full" />
              <label for="engine_fuel_type">Тип топлива</label>
            </FloatLabel>
            <FloatLabel variant="on" class="h-full">
              <InputText id="engine_serial_number" v-model="engine_serial_number" class="h-full" />
              <label for="engine_serial_number">Серийный номер</label>
            </FloatLabel>
          </div>
        </div>
        <div class="shadow-lg rounded bg-white">
          <div class="flex justify-between items-center p-25">
            <h3>Мачта</h3>
          </div>
          <hr class="border-zinc-300" >
          <div class="grid grid-cols-6 items-center gap-15 p-25">
            <FloatLabel variant="on" class="h-full">
              <Select
                v-model="mast_brand"
                label-id="mast_brand"
                :options="brands"
                option-label="name"
                option-value="name"
                filter
                class="w-full h-full"
                fluid
              />
              <label for="mast_brand">Бренд</label>
            </FloatLabel>
            <FloatLabel variant="on" class="h-full">
              <InputText id="mast_model" v-model="mast_model" class="h-full" />
              <label for="mast_model">Модель</label>
            </FloatLabel>
            <FloatLabel variant="on" class="h-full">
              <InputNumber id="mast_height" v-model="mast_height" class="h-full w-full" />
              <label for="mast_height">Высота (м)</label>
            </FloatLabel>
            <FloatLabel variant="on" class="h-full">
              <InputText id="mast_serial_number" v-model="mast_serial_number" class="h-full" />
              <label for="mast_serial_number">Серийный номер</label>
            </FloatLabel>
            <FloatLabel variant="on" class="h-full">
              <InputNumber id="mast_sections" v-model="mast_sections" class="h-full w-full" />
              <label for="mast_sections">Количество секций</label>
            </FloatLabel>
            <FloatLabel variant="on" class="h-full">
              <InputNumber id="mast_cylinders" v-model="mast_cylinders" class="h-full w-full" />
              <label for="mast_cylinders">Количество цилиндров</label>
            </FloatLabel>
          </div>
        </div>
        <div class="shadow-lg rounded bg-white">
          <div class="flex justify-between items-center p-25">
            <h3>Примечания</h3>
          </div>
          <hr class="border-zinc-300" >
          <div class="grid grid-cols-1 items-center gap-15 p-25">
            <FloatLabel variant="on" class="h-full">
              <Textarea id="text_comment" v-model="text_comment" class="w-full h-full" fluid />
              <label for="text_comment">Комментарий</label>
            </FloatLabel>
          </div>
        </div>
        <div class="shadow-lg rounded bg-white">
          <div class="flex justify-between items-center p-25">
            <h3>Приложите фото шильдиков или ПСМ</h3>
          </div>
          <hr class="border-zinc-300" >
          <div class="grid grid-cols-1 items-start gap-15 p-25">
            <div class="flex flex-wrap gap-15">
              <div
                v-for="(file, index) in selectedFiles"
                :key="index"
                class="relative w-150 h-150 rounded overflow-hidden"
              >
                <Image
                  :src="getFileUrl(file)"
                  :alt="file.name"
                  image-class="object-cover w-full h-full"
                  class="w-full h-full"
                  preview
                />
                <div
                  v-if="loadingFiles.includes(index) || !uploadedFiles[index]"
                  class="absolute inset-0 flex items-center justify-center bg-white/60 z-10"
                >
                  <ProgressSpinner class="w-40 h-40" />
                </div>
                <Button
                  class="!absolute top-2 right-2"
                  icon="pi pi-times"
                  severity="danger"
                  variant="text"
                  rounded
                  aria-label="Cancel"
                  :size="'small'"
                  @click="removeFile(index)"
                />
              </div>
            </div>
            <div class="flex">
              <FileUpload
                :custom-upload="true"
                :auto="true"
                :multiple="true"
                mode="basic"
                name="image"
                accept="image/*"
                :max-file-size="5242880"
                choose-label="Загрузить файлы"
                class="p-button-outlined"
                invalid-file-size-message="Размер файла должен быть меньше 5 МБ."
                @uploader="upLoader"
              />
            </div>
          </div>
        </div>
        <Button
          type="submit"
          label="Отправить запрос"
          class="w-full h-50"
          severity="primary"
          :loading="loadingFiles.length > 0"
        />
      </form>
    </div>
  </section>
</template>

<style scoped></style>
