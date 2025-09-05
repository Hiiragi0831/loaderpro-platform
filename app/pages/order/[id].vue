<script setup lang="ts">
import { useField, useForm } from "vee-validate";
import { orderSchema } from "~/schema/orderShema";

const route = useRoute();
const formatter = useFormatter();
const delivery = ref("");
const carrierOp = [{ name: "Деловые линии" }, { name: "СДЭК" }];
const methodOp = [{ name: "До дверей" }, { name: "До терминала" }];
const priorityOp = [
  { name: "Укомплектовать полностью" },
  { name: "Отправить имеющееся в наличии" },
];
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

const { handleSubmit, errors, handleReset } = useForm({
  validationSchema: orderSchema,
});

const { value: company } = useField<string>("company");
const { value: inn } = useField<string>("inn");
const { value: firstname } = useField<string>("firstname");
const { value: surname } = useField<string>("surname");
const { value: phone } = useField<string>("phone");
const { value: carrier } = useField("carrier");
const { value: method } = useField("method");
const { value: city } = useField<string>("city");
const { value: address } = useField<string>("address");
const { value: priority } = useField<string>("priority");
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
              <div class="flex flex-col gap-20 mt-20">
                <OrderFormField
                  id="company"
                  v-model="company"
                  :invalid="!!errors?.company"
                  :error="errors?.company"
                  label="Наименование компании"
                  type="text"
                />

                <OrderFormField
                  id="inn"
                  v-model="inn"
                  :invalid="!!errors?.inn"
                  :error="errors?.inn"
                  label="ИНН"
                  type="text"
                />

                <OrderFormField
                  id="firstname"
                  v-model="firstname"
                  :invalid="!!errors?.firstname"
                  :error="errors?.firstname"
                  label="Имя"
                  type="text"
                />

                <OrderFormField
                  id="surname"
                  v-model="surname"
                  :invalid="!!errors?.surname"
                  :error="errors?.surname"
                  label="Фамилия"
                  type="text"
                />

                <OrderFormField
                  id="phone"
                  v-model="phone"
                  :invalid="!!errors?.phone"
                  :error="errors?.phone"
                  label="Телефон"
                  type="mask"
                  mask="+7 (999) 999-99-99"
                />

                <OrderFormField
                  id="carrier"
                  v-model="carrier"
                  :invalid="!!errors?.carrier"
                  :error="errors?.carrier"
                  label="Перевозчик"
                  type="select"
                  :options="carrierOp"
                />

                <OrderFormField
                  id="method"
                  v-model="method"
                  :invalid="!!errors?.method"
                  :error="errors?.method"
                  label="Метод доставки"
                  type="select"
                  :options="methodOp"
                />

                <OrderFormField
                  id="city"
                  v-model="city"
                  :invalid="!!errors?.city"
                  :error="errors?.city"
                  label="Город доставки"
                  type="text"
                />

                <OrderFormField
                  id="address"
                  v-model="address"
                  :invalid="!!errors?.address"
                  :error="errors?.address"
                  label="Адрес доставки"
                  type="text"
                />

                <OrderFormField
                  id="priority"
                  v-model="priority"
                  :invalid="!!errors?.priority"
                  :error="errors?.priority"
                  label="Приоритет отгрузки"
                  type="select"
                  :options="priorityOp"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped></style>
