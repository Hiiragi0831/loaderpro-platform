<script setup lang="ts">
defineProps({
  image: {
    type: String,
    default:
      "https://image.loaderpro.ru/products/images/20808/ff43c6c6bfe7ef9b04a8086120f49cae.png",
  },
  name: {
    type: String,
    default: "Название товаратоваратовара товара товара товара товара",
  },
  brand: {
    type: String,
    default: "Бренд",
  },
  article: {
    type: String,
    default: "123456789",
  },
  measurement: {
    type: String,
    default: "шт.",
  },
  count: {
    type: Number,
    default: 0,
  },
  weight: {
    type: Number,
    default: 0,
  },
  offers: {
    type: Array,
    default: () => [
      {
        id: 0,
        price: 0,
        count: 0,
        timeDelivery: "В идентификации",
        status: 0,
      },
    ],
  },
});
const formatter = useFormatter();
const getSeverity = (status: string) => {
  switch (status) {
    case "В идентификации":
    case "В запросе":
    case "Срок уточняется":
      return "text-yellow-500";
    case "Нет предложений":
    case "Некорректный номер":
      return "text-red-500";
    default:
      return "text-green-500";
  }
};
</script>

<template>
  <div
    class="flex rounded-2xl overflow-hidden bg-white shadow-2xl p-30 gap-15 justify-between"
  >
    <Image
      :src="image"
      :alt="name"
      class="w-250 h-250 rounded-2xl overflow-hidden"
      image-class="object-contain h-full w-full"
      preview
    />
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
      <Column field="timeDelivery" header="Срок поставки" class="w-200">
        <template #body="{ data }">
          <span :class="getSeverity(data.timeDelivery)">
            {{ data.timeDelivery }}
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
