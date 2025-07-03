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

const { value: transportBrand } = useField('transportBrand')
const { value: transportModel } = useField<string>('transportModel')
const { value: transportYearProduction } = useField<string>('transportYearProduction')
const { value: transportPrefix } = useField<string>('transportPrefix')
const { value: transportSerialNumber } = useField<string>('transportSerialNumber')

const { value: engineBrand } = useField<string>('engineBrand')
const { value: engineModel } = useField<string>('engineModel')
const { value: engineVoltage } = useField<string>('engineVoltage')
const { value: engineFuelType } = useField<string>('engineFuelType')
const { value: engineSerialNumber } = useField<string>('engineSerialNumber')

const { value: mastBrand } = useField<string>('mastBrand')
const { value: mastModel } = useField<string>('mastModel')
const { value: mastHeight } = useField<number>('mastHeight')
const { value: mastSerialNumber } = useField<string>('mastSerialNumber')
const { value: mastSections } = useField<number>('mastSections')
const { value: mastCylinders } = useField<number>('mastCylinders')

const { value: textComment } = useField<string>('textComment')

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
                v-model="transportBrand"
                label-id="transportBrand"
                :options="brands"
                option-label="name"
                option-value="name"
                filter
                class="w-full h-full"
                fluid
                :invalid="!!errors?.transportBrand"
              />
              <label for="brand">Бренд*</label>
              <Message
                v-if="errors?.transportBrand"
                severity="error"
                size="small"
                variant="simple"
                class="absolute"
                >{{ errors?.transportBrand }}
              </Message>
            </FloatLabel>
            <FloatLabel variant="on" class="h-full">
              <InputText
                id="transportModel"
                v-model="transportModel"
                :invalid="!!errors?.transportModel"
                class="h-full"
              />
              <Message
                v-if="errors?.transportModel"
                severity="error"
                size="small"
                variant="simple"
                class="absolute"
              >
                {{ errors.transportModel }}
              </Message>
              <label for="transportModel">Модель*</label>
            </FloatLabel>
            <FloatLabel variant="on" class="h-full">
              <InputText
                id="transportYearProduction"
                v-model="transportYearProduction"
                fluid
                :invalid="!!errors?.transportYearProduction"
                class="h-full"
              />
              <Message
                v-if="errors?.transportYearProduction"
                severity="error"
                size="small"
                variant="simple"
                class="absolute"
              >
                {{ errors.transportYearProduction }}
              </Message>
              <label for="transportmodel">Год производства*</label>
            </FloatLabel>
            <FloatLabel variant="on" class="h-full">
              <InputText
                id="transportSerialNumber"
                v-model="transportSerialNumber"
                class="h-full"
              />
              <label for="transportSerialNumber">Серийный номер*</label>
            </FloatLabel>
            <FloatLabel variant="on" class="h-full">
              <InputText id="transportPrefix" v-model="transportPrefix" class="h-full" />
              <label for="transportPrefix">Префикс</label>
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
                v-model="engineBrand"
                label-id="engineBrand"
                :options="brands"
                option-label="name"
                option-value="name"
                filter
                class="w-full h-full"
                fluid
              />
              <label for="engineBrand">Бренд</label>
            </FloatLabel>
            <FloatLabel variant="on" class="h-full">
              <InputText id="engineModel" v-model="engineModel" class="h-full" />
              <label for="engineModel">Модель</label>
            </FloatLabel>
            <FloatLabel variant="on" class="h-full">
              <InputText id="engineVoltage" v-model="engineVoltage" class="h-full" />
              <label for="engineVoltage">Напряжение</label>
            </FloatLabel>
            <FloatLabel variant="on" class="h-full">
              <InputText id="engineFuelType" v-model="engineFuelType" class="h-full" />
              <label for="engineFuelType">Тип топлива</label>
            </FloatLabel>
            <FloatLabel variant="on" class="h-full">
              <InputText id="engineSerialNumber" v-model="engineSerialNumber" class="h-full" />
              <label for="engineSerialNumber">Серийный номер</label>
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
                v-model="mastBrand"
                label-id="mastBrand"
                :options="brands"
                option-label="name"
                option-value="name"
                filter
                class="w-full h-full"
                fluid
              />
              <label for="mastBrand">Бренд</label>
            </FloatLabel>
            <FloatLabel variant="on" class="h-full">
              <InputText id="mastModel" v-model="mastModel" class="h-full" />
              <label for="mastModel">Модель</label>
            </FloatLabel>
            <FloatLabel variant="on" class="h-full">
              <InputNumber id="mastHeight" v-model="mastHeight" class="h-full w-full" />
              <label for="mastHeight">Высота (м)</label>
            </FloatLabel>
            <FloatLabel variant="on" class="h-full">
              <InputText id="mastSerialNumber" v-model="mastSerialNumber" class="h-full" />
              <label for="mastSerialNumber">Серийный номер</label>
            </FloatLabel>
            <FloatLabel variant="on" class="h-full">
              <InputNumber id="mastSections" v-model="mastSections" class="h-full w-full" />
              <label for="mastSections">Количество секций</label>
            </FloatLabel>
            <FloatLabel variant="on" class="h-full">
              <InputNumber id="mastCylinders" v-model="mastCylinders" class="h-full w-full" />
              <label for="mastCylinders">Количество цилиндров</label>
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
              <Textarea id="textComment" v-model="textComment" class="w-full h-full" fluid />
              <label for="textComment">Комментарий</label>
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
