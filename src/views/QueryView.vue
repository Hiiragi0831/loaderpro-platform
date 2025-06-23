<script setup lang="ts">
import { useQueryStore } from '@/stores/query.ts'
import { computed, onMounted, reactive } from 'vue'
import { useBrandStore } from '@/stores/brand.ts'

const queryStore = useQueryStore();
const brandStore = useBrandStore();

const formData = reactive({
  brand: null as { name: string } | null,
  numparts: '',
  count: 1,
})

const brands = computed(() => brandStore.brand);

const handleSubmit = () => {
  // Добавляем копию с уникальным id
  queryStore.addQuery({
    id: Math.round(Date.now() + Math.random()),
    brand: formData.brand?.name ?? '',
    numparts: formData.numparts,
    count: formData.count,
  })
  // Очищаем форму
  formData.brand = null
  formData.numparts = ''
  formData.count = 1
}

const handleSend = () => {
  // Здесь можно добавить логику отправки запроса
  console.log('Отправка запроса:', queryStore.query)
  // Очистка запроса после отправки
  queryStore.clearQuery()
}

onMounted( () => {
  queryStore.loadQuery();
})
</script>

<template>
  <main class="py-30">
    <div class="container mx-auto flex flex-col gap-15">
      <div class="shadow-lg rounded bg-white">
        <div class="flex justify-between items-center p-25">
          <h3>Запрос цены</h3>
          <Button variant="outlined">Импортировать из файла</Button>
        </div>
        <hr class="border-zinc-300" />
        <form class="grid grid-cols-4 items-center gap-15 p-25" @submit.prevent="handleSubmit">
          <FloatLabel variant="on">
            <Select
              inputId="brand"
              v-model="formData.brand"
              :options="brands"
              filter
              optionLabel="name"
              class="w-full"
              fluid
            />
            <label for="brand">Бренд</label>
          </FloatLabel>
          <FloatLabel variant="on">
            <InputText id="numparts" v-model="formData.numparts" />
            <label for="numparts">Номер запчасти</label>
          </FloatLabel>
          <FloatLabel variant="on">
            <InputNumber
              v-model="formData.count"
              inputId="count"
              buttonLayout="horizontal"
              showButtons
              class="w-full"
              suffix=" шт."
              :min="1"
            >
              <template #incrementbuttonicon>
                <span class="pi pi-plus" />
              </template>
              <template #decrementbuttonicon>
                <span class="pi pi-minus" />
              </template>
            </InputNumber>
            <label for="count">Количество</label>
          </FloatLabel>
          <Button type="submit">Добавить в запрос</Button>
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
