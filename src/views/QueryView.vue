<script setup lang="ts">
import { useQueryStore } from '@/stores/query.ts'
import { computed, onMounted } from 'vue'
import { useBrandStore } from '@/stores/brand.ts'
import { useField, useForm } from 'vee-validate'
import { querySchema } from '@/schema/querySchema.ts'
import QueryLoadExcel from '@/components/QueryLoadExcel.vue'

const queryStore = useQueryStore()
const brandStore = useBrandStore()

const brands = computed(() => brandStore.brand)

const { handleSubmit, errors, handleReset } = useForm({
  validationSchema: querySchema,
})

const { value: brand } = useField('brand')
const { value: numparts } = useField<string>('numparts')
const { value: count } = useField<number>('count')

const onSubmit = handleSubmit((values) => {
  queryStore.addQuery({
    id: Math.round(Date.now() + Math.random()),
    brand: values.brand,
    numparts: values.numparts,
    count: values.count,
  })
  handleReset()
})

const handleSend = () => {
  // Здесь можно добавить логику отправки запроса
  console.log('Отправка запроса:', queryStore.query)
  // Очистка запроса после отправки
  queryStore.clearQuery()
}

onMounted(() => {
  queryStore.loadQuery()
})
</script>

<template>
  <main class="py-30">
    <div class="container mx-auto flex flex-col gap-15">
      <div class="shadow-lg rounded bg-white">
        <div class="flex justify-between items-center p-25">
          <h3>Запрос цены</h3>
          <QueryLoadExcel />
        </div>
        <hr class="border-zinc-300" />
        <form class="grid grid-cols-4 items-center gap-15 p-25" @submit="onSubmit">
          <FloatLabel variant="on" class="h-full">
            <Select
              label-id="brand"
              v-model="brand"
              :options="brands"
              optionLabel="name"
              optionValue="name"
              filter
              class="w-full h-full"
              fluid
              :invalid="!!errors?.brand"
            />
            <label for="brand">Бренд</label>
            <Message
              v-if="errors?.brand"
              severity="error"
              size="small"
              variant="simple"
              class="absolute"
              >{{ errors?.brand }}
            </Message>
          </FloatLabel>
          <FloatLabel variant="on" class="h-full">
            <InputText id="numparts" v-model="numparts" :invalid="!!errors?.numparts" class="h-full"/>
            <Message
              v-if="errors?.numparts"
              severity="error"
              size="small"
              variant="simple"
              class="absolute"
            >
              {{ errors.numparts }}
            </Message>
            <label for="numparts">Номер запчасти</label>
          </FloatLabel>

          <FloatLabel variant="on" class="h-full">
            <InputNumber
              v-model="count"
              inputId="count"
              buttonLayout="horizontal"
              showButtons
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
          <Button type="submit" class="!text-base h-full">Добавить в запрос</Button>
        </form>
      </div>
      <div class="shadow-lg rounded bg-white" v-if="queryStore.query.length > 0">
        <div class="flex justify-between items-center p-25">
          <h3>Ваш запрос</h3>
          <Button @click="queryStore.clearQuery()" variant="outlined">Очистить форму</Button>
        </div>
        <hr class="border-zinc-300" />
        <div class="p-25 flex flex-col gap-25">
          <DataTable :value="queryStore.query" showGridlines>
            <Column field="brand" header="Бренд" class="w-1/4" />
            <Column field="numparts" header="Номер запчасти" />
            <Column field="count" header="Количество" class="w-1/6">
              <template #body="slotProps"> {{ slotProps.data.count }} шт. </template>
            </Column>
            <Column header="Действия" class="w-24">
              <template #body="slotProps">
                <div class="justify-center items-center flex">
                  <Button icon="pi pi-times" @click="queryStore.removeQuery(slotProps.index)" />
                </div>
              </template>
            </Column>
          </DataTable>
          <Button class="ml-auto" @click="handleSend">Отправить запрос</Button>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped></style>
