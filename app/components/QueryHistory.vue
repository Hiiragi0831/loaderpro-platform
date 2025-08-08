<script setup lang="ts">
import { baseTableStore } from "~/stores/baseTableStore";
import { ref } from "vue";
import { FilterMatchMode } from "@primevue/core/api";
import type {
  DataTableFilterEvent,
  DataTablePageEvent,
  DataTableSortEvent,
} from "primevue";
import { watchDebounced } from "@vueuse/core";
import { useFormatter } from "~/utils/useFormatter";

const useQueryHistoryStore = baseTableStore("queryHistoryStore", "querys");
const queryHistoryStore = useQueryHistoryStore();

const dataItems = ref<any>([]);
const currentPage = ref(1); // номер страницы (1-based)
const rows = ref(10); // размер страницы
const totalRecords = ref(0); // общее кол-во записей (для пагинации)
const first = computed(() => (currentPage.value - 1) * rows.value); // offset для DataTable

const filters = ref();
const sortField = ref();
const sortOrder = ref();
const loading = ref(false);

const qualities = ref(["В запросе", "Обработан", "Подбор"]);

const initFilters = () => {
  filters.value = {
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    status: { value: null, matchMode: FilterMatchMode.EQUALS },
    create_time: { value: null, matchMode: FilterMatchMode.DATE_BETWEEN },
  };
};
initFilters();

const getSeverity = (status: string) => {
  switch (status) {
    case "В запросе":
      return "bg-yellow-100 text-yellow-800";
    case "Обработан":
      return "bg-green-100 text-green-800";
    case "Подбор":
      return "bg-blue-100 text-blue-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const loadData = async () => {
  loading.value = true;

  try {
    const filterParams: Record<string, unknown> = {};

    if (filters.value) {
      Object.entries(filters.value).forEach(([key, filter]: [string, any]) => {
        if (key === "global") {
          if (filter.value && filter.value.trim() !== "") {
            filterParams.search = filter.value.trim();
          }
          return;
        }

        if (filter.constraints && Array.isArray(filter.constraints)) {
          const activeConstraint = filter.constraints.find(
            (c: any) =>
              c.value !== null && c.value !== "" && c.value !== undefined,
          );
          if (activeConstraint) {
            filterParams[key] = activeConstraint.value;
          }
        } else if (
          filter.value !== null &&
          filter.value !== "" &&
          filter.value !== undefined
        ) {
          if (filter.value instanceof Date) {
            filterParams[key] = filter.value.toISOString().split("T")[0]; // YYYY-MM-DD
          } else {
            filterParams[key] = filter.value;
          }
        }
      });
    }

    let sortValue;
    if (sortField?.value && sortOrder?.value) {
      sortValue =
        sortOrder.value === 1 ? sortField.value : `-${sortField.value}`;
    }

    const params = {
      page: currentPage.value || 1,
      limit: rows.value,
      ...(sortValue && { sortBy: sortValue }),
      ...filterParams,
    };

    console.log("Отправляемые параметры:", params);

    const response = await queryHistoryStore.fetchData(params);

    dataItems.value = response.items || [];
    totalRecords.value = response.meta.total_items;
  } finally {
    loading.value = false;
  }
};

const onSort = (event: DataTableSortEvent) => {
  sortField.value = event.sortField;
  sortOrder.value = event.sortOrder;
  loadData();
};

const onFilter = (event: DataTableFilterEvent) => {
  filters.value = event.filters;
  sortField.value = null;
  sortOrder.value = null;
  currentPage.value = 1;
  loadData();
};

const clearFilter = () => {
  initFilters();
  loadData();
};

const onPage = (event: DataTablePageEvent) => {
  // event.page — 0-based, API ожидает 1-based
  currentPage.value = (event.page ?? 0) + 1;
  rows.value = event.rows ?? rows.value;
  loadData();
};

watchDebounced(
  () => filters.value?.global?.value,
  () => {
    currentPage.value = 1;
    loadData();
  },
  { debounce: 500, maxWait: 1000 },
);

onMounted(() => {
  loadData();
});
</script>

<template>
  <section>
    <div class="container mx-auto flex flex-col gap-15">
      <div class="shadow-lg rounded bg-white">
        <div class="flex justify-between items-center p-25">
          <h3>История запросов</h3>
        </div>

        <hr class="border-zinc-300" />

        <div class="p-25 flex flex-col gap-25">
          <DataTable
            v-model:filters="filters"
            show-gridlines
            :value="dataItems"
            :lazy="true"
            filter-display="menu"
            data-key="id"
            :loading="loading"
            :global-filter-fields="['status']"
            :paginator="true"
            :rows="rows"
            :first="first"
            :rows-per-page-options="[10, 20, 40, 80]"
            :total-records="totalRecords"
            @page="onPage"
            @filter="onFilter"
            @sort="onSort"
          >
            <template #header>
              <div class="flex justify-between">
                <IconField class="w-300">
                  <InputIcon class="pi pi-search" />
                  <InputText
                    v-model="filters['global'].value"
                    placeholder="Поиск"
                  />
                </IconField>
                <Button
                  type="button"
                  icon="pi pi-filter-slash"
                  label="Очистить фильтры"
                  variant="outlined"
                  @click="clearFilter()"
                />
              </div>
            </template>
            <Column
              field="create_time"
              header="Дата создания"
              :sortable="true"
              filter
              :show-filter-match-modes="false"
            >
              <template #body="{ data }">
                {{ useFormatter().formatDate(data.create_time) }}
              </template>
              <template #filter="{ filterModel }">
                <DatePicker
                  v-model="filterModel.value"
                  placeholder="mm/dd/yyyy"
                />
              </template>
            </Column>
            <Column field="num_orders" header="Номер запроса">
              <template #body="{ data }">
                {{ useFormatter().formatNumber(data.num_orders) }}
              </template>
            </Column>
            <Column field="responsible" header="Кем создан" />
            <Column
              field="status"
              header="Статус"
              filter
              :show-filter-match-modes="false"
            >
              <template #body="{ data }">
                <Tag
                  :value="data.status"
                  :class="`px-5 py-3 rounded-md font-semibold ${getSeverity(data.status)}`"
                  :unstyled="true"
                />
              </template>
              <template #filter="{ filterModel }">
                <Select
                  v-model="filterModel.value"
                  :options="qualities"
                  placeholder="Выберите значение"
                  class="w-full"
                >
                  <template #option="slotProps">
                    <Tag
                      :value="slotProps.option"
                      :class="`px-5 py-3 rounded-md font-semibold ${getSeverity(slotProps.option)}`"
                      :unstyled="true"
                    />
                  </template>
                </Select>
              </template>
              <template #filterclear="{ filterCallback }">
                <Button
                  type="button"
                  icon="pi pi-times"
                  severity="secondary"
                  @click="filterCallback()"
                />
              </template>
              <template #filterapply="{ filterCallback }">
                <Button
                  type="button"
                  icon="pi pi-check"
                  severity="success"
                  @click="filterCallback()"
                />
              </template>
            </Column>
          </DataTable>
        </div>
      </div>
    </div>
  </section>
</template>
