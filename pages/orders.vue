<script setup lang="ts">
import { useOrderStore } from '~/stores/orders'
import UniversalDataTable from '~/components/UniversalDataTable.vue'

const orderStore = useOrderStore()

// Конфигурация для таблицы заказов
const ordersTableConfig = {
  title: 'Заказы',
  columns: [
    {
      field: 'num_orders',
      header: 'Номер заказа',
      formatter: 'number' as const,
      customClass: '!p-10',
    },
    {
      field: 'status_name',
      header: 'Статус',
      filterable: true,
      filterType: 'select' as const,
      filterOptions: ['В обработке', 'Счет отправлен', 'Счет оплачен', 'В пути', 'Отгружен', 'Отменен'],
      statusConfig: {
        'Счет отправлен': 'bg-yellow-100 text-yellow-800',
        'Счет оплачен': 'bg-blue-100 text-blue-800',
        'В пути': 'bg-sky-100 text-sky-800',
        'Отгружен': 'bg-green-100 text-green-800',
        'Отменен': 'bg-red-100 text-red-800'
      }
    },
    {
      field: 'create_time',
      header: 'Дата создания',
      sortable: true,
      formatter: 'date' as const,
      customClass: '!p-10'
    },
    {
      field: 'payment_date',
      header: 'Дата оплаты',
      sortable: true,
      customClass: '!p-10',
      customRenderer: (value) => value ? new Date(value).toLocaleDateString() : 'Не оплачено'
    },
    {
      field: 'shipment_date',
      header: 'Дата поставки',
      sortable: true,
      customClass: '!p-10',
      customRenderer: (value: any) => value ? new Date(value).toLocaleDateString() : 'Не отправлено'
    },
    {
      field: 'ship_date',
      header: 'Дата отгрузки',
      sortable: true,
      customClass: '!p-10',
      customRenderer: (value: any) => value ? new Date(value).toLocaleDateString() : 'Не отгружено'
    },
    {
      field: 'total_price',
      header: 'Сумма',
      sortable: true,
      formatter: 'money' as const,
      customClass: '!p-10'
    }
  ],
  defaultPerPage: 10,
  showRefreshButton: true
}

// Функция загрузки данных
const loadOrdersData = async (params: any) => {
  return await orderStore.fetchOrderHistory(params)
}

// Функция очистки кеша
const clearOrdersCache = () => {
  orderStore.clearCache()
}
</script>

<template>
  <main class="py-30">
    <UniversalDataTable
      :config="ordersTableConfig"
      :load-data-function="loadOrdersData"
      :clear-cache-function="clearOrdersCache"
    />
  </main>
</template>
