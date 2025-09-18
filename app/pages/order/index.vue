<script setup lang="ts">
import UniversalTable from '~/components/UniversalTable.vue';
import type { TableConfig } from '~/components/UniversalTable.vue';

const orderTableConfig: TableConfig = {
  title: 'Заказы',
  storeName: 'orderStore',
  endpoint: 'orders',
  dataKey: 'id',
  expandable: true,
  columns: [
    {
      field: 'num',
      header: 'Номер заказа',
      class: 'w-1/6',
      bodyTemplate: 'link',
      linkRouteName: 'order-id',
      linkParamField: 'num'
    },
    {
      field: 'status',
      header: 'Статус',
      filter: true,
      filterType: 'select',
      filterOptions: ["В обработке", "Счет отправлен", "Счет оплачен", "В пути", "Отгружен", "Отменен"],
      class: 'w-1/6',
      bodyTemplate: 'tag'
    },
    {
      field: 'create_time',
      header: 'Дата создания',
      sortable: true,
      filter: true,
      filterType: 'date',
      class: 'w-1/6',
      bodyTemplate: 'date'
    },
    {
      field: 'payment_date',
      header: 'Дата оплаты',
      sortable: true,
      filter: true,
      filterType: 'date',
      class: 'w-1/6',
      bodyTemplate: 'date'
    },
    {
      field: 'shipment_date',
      header: 'Дата поставки',
      sortable: true,
      filter: true,
      filterType: 'date',
      class: 'w-1/6',
      bodyTemplate: 'date'
    },
    {
      field: 'ship_date',
      header: 'Дата отгрузки',
      sortable: true,
      filter: true,
      filterType: 'date',
      class: 'w-1/6',
      bodyTemplate: 'date'
    }
  ],
  expandTitle: 'Товары в заказе №',
  expandColumns: [
    { field: 'num_parts', header: 'Артикул', class: 'w-1/4' },
    { field: 'name', header: 'Название', class: 'w-1/4' },
    { field: 'brand', header: 'Бренд', class: 'w-1/4' },
    { field: 'count', header: 'Количество', class: 'w-1/4', bodyTemplate: 'count' }
  ]
};
</script>

<template>
  <main class="py-30">
    <section>
      <div class="container mx-auto flex flex-col gap-15">
        <UniversalTable :config="orderTableConfig" />
      </div>
    </section>
  </main>
</template>
