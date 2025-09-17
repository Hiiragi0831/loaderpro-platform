<script setup lang="ts">
const route = useRoute();
const formatter = useFormatter();
const testData = {
  total: 23453,
  info: [
    {
      property: "Статус",
      value: "В запросе",
    },
    {
      property: "Дата создания",
      value: "12.09.2025",
    },
    {
      property: "Дата оплаты",
      value: "12.09.2025",
    },
    {
      property: "Дата поставки",
      value: "12.09.2025",
    },
    {
      property: "Дата отгрузки",
      value: "12.09.2025",
    },
  ],
  delivery: [
    {
      property: "Наименование компании",
      value: 'ООО "Ромашка"',
    },
    {
      property: "ИНН",
      value: "12345667654",
    },
    {
      property: "Получатель",
      value: "Иванов Иван",
    },
    {
      property: "Телефон",
      value: "+7 (999) 999-99-99",
    },
    {
      property: "Перевозчик",
      value: "Деловые линии",
    },
    {
      property: "Метод доставки",
      value: "До клиента",
    },
    {
      property: "Город доставки",
      value: "Санкт-Петербург",
    },
    {
      property: "Адрес доставки",
      value: "ул. ЛенинаЛенина Ленина, д. 1, кв. 1",
    },
    {
      property: "Приоритет отгрузки",
      value: "Укомплектовать полностью",
    },
  ],
  products: [
    {
      id: 0,
      image: "https://image.loaderpro.ru/products/images/20808/ff43c6c6bfe7ef9b04a8086120f49cae.png",
      link: "#",
      name: "Название товара 1 dfdfef wefwefg wefw ",
      measurement: "шт.",
      quality: "OEM",
      weight: 2.2,
      count: 2,
      price: 2314,
      article: "123456789",
      brand: "OLD TRACPIECES (RG4)",
    },
    {
      id: 1,
      image: "https://image.loaderpro.ru/products/images/20808/ff43c6c6bfe7ef9b04a8086120f49cae.png",
      link: "#",
      name: "Название товара 2",
      measurement: "шт.",
      quality: "OEM",
      weight: 2.2,
      count: 4,
      price: 3314,
      article: "123456789",
      brand: "OLD TRACPIECES (RG4)",
    },
  ],
};
</script>

<template>
  <main class="py-30">
    <section>
      <div class="container m-auto">
        <div
          class="rounded-2xl overflow-hidden bg-blue-50 shadow-lg p-15 flex justify-between text-lg gap-15 items-center text-center"
        >
          <p class="font-semibold">Содержимое заказа {{ route.params.id }}</p>
          <Button icon="pi pi-file-export" label="Экспортировать в файл" />
        </div>
        <div class="flex gap-30 justify-between w-full mt-30">
          <div class="w-920">
            <DataTable
              :value="testData.products"
              class="rounded-2xl overflow-hidden shadow-lg bg-white"
              table-class="-mb-2"
            >
              <Column header="Изображение" class="w-100">
                <template #body="slotProps">
                  <Image
                    :src="slotProps.data.image"
                    :alt="slotProps.data.name"
                    class="w-100"
                    preview
                  />
                </template>
              </Column>
              <Column field="name" header="Название товара" class="w-320">
                <template #body="slotProps">
                  <small class="block">{{ slotProps.data.article }}</small>
                  <p class="text-lg font-semibold leading-18">
                    <NuxtLink
                      :to="slotProps.data.link"
                      class="hover:text-primary-500 transition"
                    >
                      {{ slotProps.data.name }}
                    </NuxtLink>
                  </p>
                  <small class="block">{{ slotProps.data.brand }}</small>
                </template>
              </Column>
              <Column field="quality" header="Качество" class="w-100" />
              <Column field="weight" header="Вес, кг" class="w-100" />
              <Column field="price" header="Цена" class="w-100">
                <template #body="slotProps">
                  {{ formatter.formatMoney(slotProps.data.price) }}
                </template>
              </Column>
              <Column field="measurement" header="Кол-во." class="w-100">
                <template #body="slotProps">
                  {{ slotProps.data.count }}
                  {{ slotProps.data.measurement }}
                </template>
              </Column>
              <Column header="Сумма" class="w-100">
                <template #body="slotProps">
                  {{
                    formatter.formatMoney(
                      slotProps.data.price * slotProps.data.count,
                    )
                  }}
                </template>
              </Column>
            </DataTable>
          </div>
          <div class="w-450 flex flex-col gap-30">
            <div class="rounded-2xl overflow-hidden bg-white shadow-lg p-20">
              <p class="text-xl font-semibold mb-15">Итого</p>
              <div class="flex flex-col gap-15">
                <div class="flex justify-between items-center">
                  <p class="leading-[0.8]">
                    Всего:<br />
                    <small>Без стоимости транспортировки</small>
                  </p>
                  <p class="font-semibold">
                    {{ formatter.formatMoney(testData.total) }}
                  </p>
                </div>
                <div
                  v-for="(item, index) in testData.info"
                  :key="index"
                  class="flex justify-between items-center"
                >
                  <p>{{ item.property }}</p>
                  <p>{{ item.value }}</p>
                </div>
              </div>
            </div>
            <div class="rounded-2xl overflow-hidden bg-white shadow-lg p-20">
              <p class="text-xl font-semibold">Доставка</p>
              <div class="flex flex-col">
                <div
                  v-for="(item, index) in testData.delivery"
                  :key="index"
                  class="grid grid-cols-2 items-center border-b border-gray-200 pt-15"
                >
                  <p>{{ item.property }}</p>
                  <p class="text-right">{{ item.value }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped></style>
