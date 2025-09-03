<script setup lang="ts">
const route = useRoute();
const formatter = useFormatter();
const delivery = ref("");
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
            <p>sdfkj</p>
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
              <p class="text-xl font-semibold mb-15">Доставка</p>
              <div class="flex flex-col gap-15">
                <div class="flex items-center gap-8">
                  <RadioButton
                    v-model="delivery"
                    input-id="delivery-1"
                    name="default"
                    value="По умолчанию"
                  />
                  <label for="delivery-1">По умолчанию</label>
                </div>
                <div class="flex items-center gap-8">
                  <RadioButton
                    v-model="delivery"
                    input-id="delivery-2"
                    name="pickupSpb"
                    value="Самовывоз Санкт-Петербург"
                  />
                  <label for="delivery-2">Самовывоз Санкт-Петербург</label>
                </div>
                <div class="flex items-center gap-8">
                  <RadioButton
                    v-model="delivery"
                    input-id="delivery-3"
                    name="client"
                    value="До клиента"
                  />
                  <label for="delivery-3">До клиента</label>
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
