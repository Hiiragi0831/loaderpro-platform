<script setup lang="ts">
import { computed } from 'vue'
import { useBrandStore } from '@/stores/brand'
import { useField, useForm } from 'vee-validate'
import { partsSelectionSchema } from '@/schema/partsSelectionShema'

const brandStore = useBrandStore()
const brands = computed(() => brandStore.brand)

const { handleSubmit, errors } = useForm({
  validationSchema: partsSelectionSchema,
})

const { value: transportbrand } = useField('transportbrand')
const { value: transportmodel } = useField<string>('transportmodel')
const { value: transportyearproduction } = useField<number>('transportyearproduction')
const { value: transportprefix } = useField<string>('transportprefix')
const { value: transportserialnumber } = useField<string>('transportserialnumber')

const onSubmit = handleSubmit((values) => {
  // queryStore.addQuery({
  //   id: Math.round(Date.now() + Math.random()),
  //   transportbrand: values.transportbrand,
  //   transportmodel: values.transportmodel,
  //   transportyearproduction: values.transportyearproduction,
  //   transportserialnumber: values.transportserialnumber,
  // })
  console.log('Submitted values:', values)
  // handleReset()
})
</script>

<template>
  <main class="py-30">
    <div class="container mx-auto flex flex-col gap-15">
      <h2>Подбор запчастей</h2>
      <form class="shadow-lg rounded bg-white" @submit="onSubmit">
        <div class="flex justify-between items-center p-25">
          <h3>Информация о транспортном средстве</h3>
        </div>
        <hr class="border-zinc-300" >
        <div class="grid grid-cols-4 items-center gap-15 p-25">
          <FloatLabel variant="on" class="h-full">
            <Select
              v-model="transportbrand"
              label-id="transportbrand"
              :options="brands"
              option-label="name"
              option-value="name"
              filter
              class="w-full h-full"
              fluid
              :invalid="!!errors?.transportbrand"
            />
            <label for="brand">Бренд</label>
            <Message
              v-if="errors?.transportbrand"
              severity="error"
              size="small"
              variant="simple"
              class="absolute"
              >{{ errors?.transportbrand }}
            </Message>
          </FloatLabel>
          <FloatLabel variant="on" class="h-full">
            <InputText
              id="transportmodel"
              v-model="transportmodel"
              :invalid="!!errors?.transportmodel"
              class="h-full"
            />
            <Message
              v-if="errors?.transportmodel"
              severity="error"
              size="small"
              variant="simple"
              class="absolute"
            >
              {{ errors.transportmodel }}
            </Message>
            <label for="transportmodel">Модель</label>
          </FloatLabel>
          <FloatLabel variant="on" class="h-full">
            <InputNumber
              v-model="transportyearproduction"
              input-id="transportyearproduction"
              :use-grouping="false"
              :min="1000"
              :max="9999"
              fluid
              :invalid="!!errors?.transportyearproduction"
              class="h-full"
            />
            <Message
              v-if="errors?.transportyearproduction"
              severity="error"
              size="small"
              variant="simple"
              class="absolute"
            >
              {{ errors.transportyearproduction }}
            </Message>
            <label for="transportmodel">Год производства</label>
          </FloatLabel>
          <FloatLabel variant="on" class="h-full">
            <InputText
              id="transportprefix"
              v-model="transportprefix"
              class="h-full"
            />
            <label for="transportprefix">Префикс</label>
          </FloatLabel>
          <FloatLabel variant="on" class="h-full">
            <InputText
              id="transportserialnumber"
              v-model="transportserialnumber"
              class="h-full"
            />
            <label for="transportserialnumber">Серийный номер</label>
          </FloatLabel>
        </div>
      </form>
    </div>
  </main>
</template>

<style scoped></style>
