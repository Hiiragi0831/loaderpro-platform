<script setup lang="ts">
interface User {
  id: number;
  firstname: string;
  lastname: string;
}

interface Item {
  id: number;
  name: string;
  brand: string;
  article: string;
  image: string;
  measurement: string;
  quality: string;
  count: number;
  price: number;
  weight: number;
}

interface OrderData {
  id: number;
  payment_date: string;
  shipment_date: string;
  ship_date: string;
  create_time: string;
  status: string;
  num: string;
  user: User;
  total_price: number;
  items: Item[];
  delivery: { property: string; value: string }[];
}

const route = useRoute();
const orderData = ref<OrderData>({} as OrderData);
const isLoading = ref(true);
const formatter = useFormatter();

async function fetchData() {
  const token = JSON.parse(<string>localStorage.getItem("user")).token;
  const res = await fetch(`${useApi().apiUrl}/orders/${route.params.id}`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
  });
  orderData.value = await res.json();
  isLoading.value = false;
}

onMounted(fetchData);
</script>

<template>
  <main class="py-30">
    <section>
      <div class="container m-auto">
        <div v-if="isLoading" class="text-center py-30">
          <ProgressSpinner />
        </div>
        <div v-else>
          <div
            class="rounded-2xl overflow-hidden bg-blue-50 shadow-lg p-15 flex justify-between text-lg gap-15 items-center text-center"
          >
            <p class="font-semibold">Содержимое заказа {{ orderData.num }}</p>
            <Button icon="pi pi-file-export" label="Экспортировать в файл" />
          </div>
          <div class="flex gap-30 justify-between w-full mt-30">
            <div class="w-920">
              <DataTable
                :value="orderData.items"
                class="rounded-2xl overflow-hidden shadow-lg bg-white"
              >
                <Column header="Изображение" class="w-100">
                  <template #body="slotProps">
                    <img v-if="!slotProps.data.image" src="@/assets/images/no-photo.jpg" class="w-100 h-80 rounded-2xl overflow-hidden object-contain" :alt="slotProps.data.name">
                    <Image
                      v-if="slotProps.data.image"
                      :src="slotProps.data.image"
                      :alt="slotProps.data.name"
                      class="w-100 h-80"
                      image-class="object-contain h-full w-full"
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
                      {{ formatter.formatMoney(orderData.total_price) }}
                    </p>
                  </div>
                  <div class="flex justify-between items-center">
                    <p>Статус</p>
                    <p>{{ orderData.status }}</p>
                  </div>
                  <div class="flex justify-between items-center">
                    <p>Дата создания</p>
                    <p>{{ orderData.create_time? formatter.formatDate(orderData.create_time): "Нет данных" }}</p>
                  </div>
                  <div class="flex justify-between items-center">
                    <p>Дата оплаты</p>
                    <p>{{ orderData.payment_date? formatter.formatDate(orderData.payment_date): "Нет данных" }}</p>
                  </div>
                  <div class="flex justify-between items-center">
                    <p>Дата поставки</p>
                    <p>{{ orderData.shipment_date? formatter.formatDate(orderData.shipment_date): "Нет данных" }}</p>
                  </div>
                  <div class="flex justify-between items-center">
                    <p>Дата отгрузки</p>
                    <p>{{ orderData.ship_date? formatter.formatDate(orderData.ship_date): "Нет данных" }}</p>
                  </div>
                </div>
              </div>
              <div class="rounded-2xl overflow-hidden bg-white shadow-lg p-20">
                <p class="text-xl font-semibold">Доставка</p>
                <div class="flex flex-col">
                  <div
                    v-for="(item, index) in orderData.delivery"
                    :key="index"
                    class="grid grid-cols-2 items-center border-b border-gray-200 pt-15"
                  >
                    <p>{{ item.property }}</p>
                    <p class="text-right">{{ item.value? item.value: "Не заполнено" }}</p>
                  </div>
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
