<script setup lang="ts">
const dataTest = [
  {
    id: 1,
    data: "12.09.2025",
    title: "Заказ: 1520843432522",
    message: "Новый статус заказа: Поступил полностью",
    read: false,
  },
  {
    id: 2,
    data: "12.09.2025",
    title: "Запрос: 1520843432522",
    message: "Новый статус запроса: Обработан",
    read: false,
  },
  {
    id: 3,
    data: "12.09.2025",
    title: "Запрос: 1520843432522",
    message: "Новый статус запроса: Обработан",
    read: true,
  },
  {
    id: 4,
    data: "12.09.2025",
    title: "Заказ: 1520843432522",
    message: "Новый статус заказа: Отправлен",
    read: true,
  },
];
</script>

<template>
  <main class="py-30">
    <section>
      <div class="container m-auto">
        <DataTable
          :value="dataTest"
          class="border-1 rounded-2xl border-solid border-primary-500 overflow-hidden"
          data-key="id"
        >
          <template #header>
            <div class="flex justify-between items-center">
              <p class="text-2xl font-semibold">Уведомления</p>
              <Button label="Отметить все как прочитанные" />
            </div>
          </template>
          <Column field="data" header="Дата создания" class="w-150" />
          <Column field="title" header="Номер запроса/заказа" class="w-450" />
          <Column field="message" header="Уведомление" class="w-800" />
        </DataTable>
      </div>
    </section>
  </main>
</template>

<style scoped></style>
