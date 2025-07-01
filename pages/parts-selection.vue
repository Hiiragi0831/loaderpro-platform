<script setup lang="ts">
import { computed } from 'vue'
import { useBrandStore } from '@/stores/brand'
import { useField, useForm } from 'vee-validate'
import { partsSelectionSchema } from '@/schema/partsSelectionShema'
import type { FileUploadUploaderEvent } from 'primevue/fileupload'

const brandStore = useBrandStore()
const brands = computed(() => brandStore.brand)

const { handleSubmit, errors } = useForm({
  validationSchema: partsSelectionSchema,
})

const { value: transportBrand } = useField('transportBrand')
const { value: transportModel } = useField<string>('transportModel')
const { value: transportYearProduction } = useField<number>('transportYearProduction')
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
  if (files.length > 0) {
    for (const file of files) {
      console.log(`Uploading file: ${file.name}`)
    }
  } else {
    console.log('No files uploaded.')
  }
}

const onSubmit = handleSubmit((values) => {
  console.log('Submitted values:', values)
  // handleReset()
})
</script>

<template>
  <main class="py-30">
    <div class="container mx-auto flex flex-col gap-15">
      <h2>Подбор запчастей</h2>
      <form class="flex flex-col gap-25" @submit="onSubmit">
        <div class="shadow-lg rounded bg-white">
          <div class="flex justify-between items-center p-25">
            <h3>Информация о транспортном средстве</h3>
          </div>
          <hr class="border-zinc-300" />
          <div class="grid grid-cols-4 items-center gap-15 p-25">
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
              <label for="brand">Бренд</label>
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
              <label for="transportModel">Модель</label>
            </FloatLabel>
            <FloatLabel variant="on" class="h-full">
              <InputNumber
                v-model="transportYearProduction"
                input-id="transportYearProduction"
                :use-grouping="false"
                :min="1000"
                :max="9999"
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
              <label for="transportmodel">Год производства</label>
            </FloatLabel>
            <FloatLabel variant="on" class="h-full">
              <InputText id="transportPrefix" v-model="transportPrefix" class="h-full" />
              <label for="transportPrefix">Префикс</label>
            </FloatLabel>
            <FloatLabel variant="on" class="h-full">
              <InputText
                id="transportSerialNumber"
                v-model="transportSerialNumber"
                class="h-full"
              />
              <label for="transportSerialNumber">Серийный номер</label>
            </FloatLabel>
          </div>
        </div>
        <div class="shadow-lg rounded bg-white">
          <div class="flex justify-between items-center p-25">
            <h3>Двигатель</h3>
          </div>
          <hr class="border-zinc-300" />
          <div class="grid grid-cols-4 items-center gap-15 p-25">
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
          <hr class="border-zinc-300" />
          <div class="grid grid-cols-4 items-center gap-15 p-25">
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
          <hr class="border-zinc-300" />
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
          <hr class="border-zinc-300" />
          <div class="grid grid-cols-1 items-start gap-15 p-25">
            <div class="flex">
              <FileUpload
                :custom-upload="true"
                :auto="true"
                mode="basic"
                name="image"
                accept="image/*"
                :max-file-size="1000000"
                choose-label="Загрузить файл"
                class="p-button-outlined"
                @uploader="upLoader"
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  </main>
</template>

<style scoped></style>
