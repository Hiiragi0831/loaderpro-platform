<script setup lang="ts">
import { computed } from "vue";
import type { TableConfig } from "~/components/UniversalTable.vue";
import UniversalTable from "~/components/UniversalTable.vue";
import { useStatusStore } from "~/stores/status";

const statusStore = useStatusStore();
await statusStore.getStatus();
const queryStatus = computed(() => statusStore.status.querys);

const queryHistoryTableConfig: TableConfig = {
  title: "История запросов",
  storeName: "queryHistoryStore",
  endpoint: "querys",
  dataKey: "id",
  expandable: true,
  columns: [
    {
      field: "num",
      header: "Номер запроса",
      class: "w-1/4",
      bodyTemplate: "link",
      linkRouteName: "query-id",
      linkParamField: "id",
    },
    {
      field: "status",
      header: "Статус",
      filter: true,
      filterType: "select",
      filterOptions: queryStatus.value,
      class: "w-1/4",
      bodyTemplate: "tag",
    },
    {
      field: "create_time",
      header: "Дата создания",
      sortable: true,
      filter: true,
      filterType: "date",
      class: "w-1/4",
      bodyTemplate: "date",
    },
    {
      field: "valid_time",
      header: "Действителен до",
      class: "w-1/4",
      bodyTemplate: "date",
    },
  ],
  expandTitle: "Товары в запросе №",
  expandColumns: [
    { field: "name", header: "Название", class: "w-1/4" },
    { field: "brand", header: "Бренд", class: "w-1/4" },
    { field: "num_parts", header: "Артикул", class: "w-1/4" },
    { field: "count", header: "Количество", class: "w-1/4", bodyTemplate: "count" },
  ],
};
</script>

<template>
  <UniversalTable :config="queryHistoryTableConfig" />
</template>
