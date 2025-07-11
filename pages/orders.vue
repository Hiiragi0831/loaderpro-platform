<script setup lang="ts">
import { useOrderStore } from '~/stores/orders'
import UniversalDataTable from '~/components/UniversalDataTable.vue'
import type { DataTableType } from '~/types/dataTableType'

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
      formatter: 'date' as const,
    },
    {
      field: 'shipment_date',
      header: 'Дата поставки',
      sortable: true,
      customClass: '!p-10',
      formatter: 'date' as const,
    },
    {
      field: 'ship_date',
      header: 'Дата отгрузки',
      sortable: true,
      customClass: '!p-10',
      formatter: 'date' as const,
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
const loadOrdersData = async (params: DataTableType) => {
  const response = orderStore.fetchOrderHistory(params)
  // Приводим тип ответа от хранилища к типу, который ожидает UniversalDataTable.
  // Это предполагает, что структура ответа (поля `items` и `meta.total_items`)
  // фактически совпадает с тем, что ожидает компонент таблицы.
  return response as unknown as {
    items: Record<string, unknown>[]
    meta: {
      total_items: number
    }
  }
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
