<script setup lang="ts">
interface Offer {
  id: number
  price: number
  count: number
  timeDelivery: string
  status: number
}

interface ProductItem {
  id: number
  image: string
  name: string
  brand: string
  article: string
  measurement: string
  count: number
  weight: number
  offers: Offer[]
}

const props = defineProps<{
  item: ProductItem
}>()

// можно сразу развернуть
const {
  image,
  name,
  brand,
  article,
  measurement,
  count,
  weight,
  offers,
} = props.item
const formatter = useFormatter();
</script>

<template>
  <div
    class="flex rounded-2xl overflow-hidden bg-white shadow-lg p-30 gap-15 justify-between"
  >
    <Image
        v-if="image"
        :src="image"
        :alt="name"
        class="w-250 h-250 rounded-2xl overflow-hidden"
        image-class="object-contain h-full w-full"
        preview
    />
    <img v-if="!image" src="@/assets/images/no-photo.jpg" class="w-250 h-250 rounded-2xl overflow-hidden object-contain" :alt="name">
    <div class="flex flex-col w-410">
      <p class="text-2xl font-medium">{{ name }}</p>
      <p class="text-lg">{{ brand }}</p>
      <div class="flex flex-col gap-5 mt-10">
        <p>
          Артикул: <span class="font-bold">{{ article }}</span>
        </p>
        <p>
          Единица измерения:
          <span class="font-bold">{{ measurement }}</span>
        </p>
        <p v-if="weight > 0">
          Вес (кг): <span class="font-bold">{{ weight }}</span>
        </p>
      </div>
    </div>
    <DataTable
      :value="offers"
      class="w-650 h-250"
      scrollable
      scroll-height="100%"
      :pt="{
        tablecontainer:
          '[&::-webkit-scrollbar]:w-8 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300',
      }"
    >
      <Column field="price" header="Цена" class="w-150">
        <template #body="{ data }">
          {{ formatter.formatMoney(data.price) }}
        </template>
      </Column>
      <Column field="count" header="Кол-во" class="w-100">
        <template #body="{ data }">
          {{ data.count }} {{ measurement }}
        </template>
      </Column>
      <Column field="sum" header="Сумма" class="w-150">
        <template #body="slotProps">
          {{
            formatter.formatMoney(slotProps.data.price * slotProps.data.count)
          }}
        </template>
      </Column>
      <Column field="time_delivery" header="Срок поставки" class="w-200">
        <template #body="{ data }">
          <span :class="getSeverityText(data.time_delivery)">
            {{ data.time_delivery }}
          </span>
        </template>
      </Column>
      <Column field="id" class="w-60 h-60">
        <template #body="slotProps">
          <Button v-if="slotProps.data.status" icon="pi pi-shopping-cart" />
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<style scoped></style>
