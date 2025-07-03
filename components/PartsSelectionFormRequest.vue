<script setup lang="ts">
import { useField, useForm } from 'vee-validate'
import { partsSelectionRequest } from '~/schema/partsSelectionRequest'
import { usePartsSelectionStore } from '~/stores/partsSelection'
import { computed, ref } from 'vue'
import type { FileUploadUploaderEvent } from 'primevue/fileupload'

const props = defineProps<{ transportId: number | null }>()
const emit = defineEmits(['sent'])

const partsSelectionStore = usePartsSelectionStore()

const rowsPerPage = 10
const first = ref(0)
const totalRecords = computed(() => partsSelectionStore.partsSelection.length)
const showPaginator = computed(() => totalRecords.value > rowsPerPage)
const selectedFiles = ref<File[]>([])
const uploadedFiles = ref<{ id: string; url: string }[]>([])
const loadingFiles = ref<number[]>([])
const toast = useToast()

const { handleSubmit, errors, handleReset } = useForm({
  validationSchema: partsSelectionRequest,
})

const { value: titleParts } = useField<string>('titleParts')
const { value: numParts } = useField<string>('numParts')
const { value: count } = useField<number>('count')
const { value: comment } = useField<string>('comment')

const onSubmit = handleSubmit((values) => {
  partsSelectionStore.add({
    id: Math.round(Date.now() + Math.random()),
    titleParts: values.titleParts,
    numParts: values.numParts,
    count: values.count,
    comment: values.comment,
    image: uploadedFiles.value[0]?.url || '',
  })
  removeFile()
  handleReset()
})

const handleSend = () => {
  // Здесь можно добавить логику отправки запроса
  console.log('Отправка запроса:', partsSelectionStore.partsSelection, props.transportId)
  emit('sent')
  // Очистка запроса после отправки
  partsSelectionStore.clear()
}

const upLoader = async (event: FileUploadUploaderEvent) => {
  const file = Array.isArray(event.files) ? event.files[0] : event.files
  if (!file) return
  selectedFiles.value = [file]
  loadingFiles.value = [0]
  const formData = new FormData()
  formData.append('file', file)
  const res = await fetch(`${import.meta.env.VITE_API_URL}/uploads`, {
    method: 'POST',
    body: formData,
  })
  if (res.ok) {
    const json = await res.json()
    uploadedFiles.value[0] = { id: json.id, url: json.url }
    toast.add({
      severity: 'success',
      summary: 'Успех',
      detail: 'Файл успешно загружен',
      life: 4000,
    })
  }
  loadingFiles.value = []
}

const removeFile = () => {
  selectedFiles.value = []
  uploadedFiles.value = []
}
</script>

<template>
  <section>
    <div class="container mx-auto flex flex-col gap-15">
      <h2>Форма запроса</h2>
      <form class="shadow-lg rounded bg-white" @submit="onSubmit">
        <div class="flex justify-between items-center p-25">
          <h3>Добавить запчасти для ТС</h3>
          <PartsSelectionLoadExcel/>
        </div>
        <hr class="border-zinc-300" >
        <div class="grid grid-cols-3 items-center gap-20 p-25">
          <FloatLabel variant="on" class="w-full h-full">
            <InputText
              id="titleParts"
              v-model="titleParts"
              :invalid="!!errors?.titleParts"
              class="h-full"
            />
            <Message
              v-if="errors?.titleParts"
              severity="error"
              size="small"
              variant="simple"
              class="absolute"
            >
              {{ errors.titleParts }}
            </Message>
            <label for="titleParts">Наименование запчасти*</label>
          </FloatLabel>
          <FloatLabel variant="on" class="w-full h-full">
            <InputText
              id="numParts"
              v-model="numParts"
              :invalid="!!errors?.numParts"
              class="h-full"
            />
            <Message
              v-if="errors?.numParts"
              severity="error"
              size="small"
              variant="simple"
              class="absolute"
            >
              {{ errors.numParts }}
            </Message>
            <label for="numParts">Каталожный номер запчасти*</label>
          </FloatLabel>
          <FloatLabel variant="on" class="w-full h-full">
            <InputNumber
              v-model="count"
              input-id="count"
              button-layout="horizontal"
              show-buttons
              class="w-full h-full"
              suffix=" шт."
              :min="1"
              :invalid="!!errors?.count"
            >
              <template #incrementbuttonicon>
                <span class="pi pi-plus" />
              </template>
              <template #decrementbuttonicon>
                <span class="pi pi-minus" />
              </template>
            </InputNumber>
            <label for="count">Количество</label>
            <Message
              v-if="errors?.count"
              severity="error"
              size="small"
              variant="simple"
              class="absolute"
            >
              {{ errors.count }}
            </Message>
          </FloatLabel>
          <FloatLabel variant="on" class="h-full col-span-2">
            <InputText id="comment" v-model="comment" class="h-full" />
            <label for="comment">Комментарий</label>
          </FloatLabel>
          <FileUpload
            v-if="!selectedFiles.length"
            :custom-upload="true"
            :auto="true"
            mode="basic"
            name="image"
            accept="image/*"
            :max-file-size="5242880"
            choose-label="Загрузить фото запчасти"
            class="p-button-outlined w-full"
            invalid-file-size-message="Размер файла должен быть меньше 5 МБ."
            @uploader="upLoader"
          />
          <div
            v-if="selectedFiles.length"
            class="flex items-center justify-between border rounded-lg border-surface-300"
          >
            <span class="py-4 px-10">{{ selectedFiles[0].name }}</span>
            <Button
              icon="pi pi-times"
              size="small"
              severity="danger"
              :disabled="!!loadingFiles.length"
              @click="removeFile"
            />
          </div>
          <Button type="submit" class="h-full col-end-4">Добавить в список</Button>
        </div>
      </form>
      <div v-if="partsSelectionStore.partsSelection.length > 0" class="shadow-lg rounded bg-white">
        <div class="flex justify-between items-center p-25">
          <h3>Ваш запрос</h3>
          <Button variant="outlined" @click="partsSelectionStore.clear()">Очистить форму</Button>
        </div>
        <hr class="border-zinc-300" >
        <div class="p-25 flex flex-col gap-25">
          <DataTable
            :value="partsSelectionStore.partsSelection"
            show-gridlines
            :paginator="showPaginator"
            :rows="rowsPerPage"
            :first="first"
            :total-records="totalRecords"
            @update:first="(val) => (first = val)"
          >
            <Column field="titleParts" header="Наименование запчасти" class="!p-10" />
            <Column field="numParts" header="Каталожный номер запчасти" class="!p-10" />
            <Column field="count" header="Количество" class="w-1/6 !p-10">
              <template #body="slotProps"> {{ slotProps.data.count }} шт. </template>
            </Column>
            <Column field="comment" header="Комментарий" class="w-1/4 !p-10" />
            <Column field="image" header="Фото запчасти" class="!p-10">
              <template #body="slotProps">
                <Image
                  v-if="slotProps.data.image"
                  :src="slotProps.data.image"
                  alt="Фото запчасти"
                  class="!block !leading-[2] !overflow-hidden !rounded-lg"
                  preview
                >
                  <template #previewicon>
                    <i class="pi pi-search !hidden" />
                  </template>
                  <template #image>
                    <Button size="small" class="w-full">
                      <img :src="slotProps.data.image" alt="image" class="!hidden" >
                      Открыть фото
                    </Button>
                  </template>
                  <template #preview="previewProps">
                    <img
                      :src="slotProps.data.image"
                      alt="preview"
                      :style="previewProps.style"
                    >
                  </template>
                </Image>
              </template>
            </Column>
            <Column header="Действия" class="w-24 !p-10">
              <template #body="slotProps">
                <div class="justify-center items-center flex">
                  <Button icon="pi pi-times" @click="partsSelectionStore.remove(slotProps.index)" />
                </div>
              </template>
            </Column>
          </DataTable>
          <Button class="ml-auto" @click="handleSend">Отправить запрос</Button>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped></style>
