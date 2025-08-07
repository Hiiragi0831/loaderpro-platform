<script setup lang="ts">
import { baseTableStore } from "~/stores/baseTableStore";

const useQueryHistoryStore = baseTableStore("queryHistoryStore", "querys");
const queryHistoryStore = useQueryHistoryStore();

// Конфигурация для таблицы истории запросов
const queryHistoryTableConfig = {
  title: "История запросов",
  columns: [
    {
      field: "create_time",
      header: "Дата создания",
      sortable: true,
      formatter: "date" as const,
      customClass: "w-1/4 !p-10",
    },
    {
      field: "num_orders",
      header: "Номер запроса",
      formatter: "number" as const,
      customClass: "!p-10",
    },
    {
      field: "status_name",
      header: "Статус",
      filterable: true,
      filterType: "select" as const,
      filterOptions: ["Котел", "В запросе", "Обработан", "Подбор"],
      customClass: "w-1/4",
      statusConfig: {
        "В запросе": "bg-yellow-100 text-yellow-800",
        Обработан: "bg-green-100 text-green-800",
        Подбор: "bg-blue-100 text-blue-800",
      },
    },
    {
      field: "total",
      header: "Сумма",
      sortable: true,
      formatter: "money" as const,
      customClass: "!p-10",
    },
  ],
  defaultPerPage: 10,
  showRefreshButton: true,
};

// Функция загрузки данных
const loadQueryHistoryData = async (params: any) => {
  const response = await queryHistoryStore.fetchData(params);
  // Приводим тип ответа от хранилища к типу, который ожидает UniversalDataTable.
  // Это предполагает, что структура ответа (поля `items` и `meta.total_items`)
  // фактически совпадает с тем, что ожидает компонент таблицы.
  return response as unknown as {
    items: Record<string, unknown>[];
    meta: {
      total_items: number;
    };
  };
};

// Функция очистки кеша
const clearQueryHistoryCache = () => {
  queryHistoryStore.clearCache();
};
</script>

<template>
  <UniversalDataTable
    :config="queryHistoryTableConfig"
    :load-data-function="loadQueryHistoryData"
    :clear-cache-function="clearQueryHistoryCache"
  />
</template>
