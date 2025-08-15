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
const expandedRows = ref<any>({});
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
    create_time: { value: null, matchMode: FilterMatchMode.DATE_IS },
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

    // Добавим лог для проверки данных
    console.log("Полученные данные:", dataItems.value);
    console.log("Первый элемент items:", dataItems.value[0]?.items);
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

// Функция для добавления одного месяца к дате
const addOneMonthToDate = (dateString: string): string => {
  const date = new Date(dateString);
  date.setMonth(date.getMonth() + 1);
  return date.toISOString().slice(0, 19).replace("T", " ");
};

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
            v-model:expanded-rows="expandedRows"
            show-gridlines
            :value="dataItems"
            :lazy="true"
            filter-display="menu"
            data-key="id"
            :loading="loading"
            :global-filter-fields="['status']"
            :paginator="true"
            :rows="rows"
            removable-sort
            :first="first"
            :rows-per-page-options="[10, 20, 40, 80]"
            :total-records="totalRecords"
            :pt="{ rowexpansioncell: 'bg-gray-50' }"
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
            <Column expander class="w-20" />
            <Column field="num_orders" header="Номер запроса" class="w-1/4">
              <template #body="{ data }">
                <Button v-slot="slotProps" as-child variant="text">
                  <NuxtLink
                    :class="slotProps.class"
                    :to="{ name: 'query-id', params: { id: data.num_orders } }"
                  >
                    {{ useFormatter().formatNumber(data.num_orders) }}
                  </NuxtLink>
                </Button>
              </template>
            </Column>
            <Column
              field="status"
              header="Статус"
              filter
              :show-filter-match-modes="false"
              class="w-1/4"
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
            <Column
              field="create_time"
              header="Дата создания"
              :sortable="true"
              filter
              :show-filter-match-modes="false"
              class="w-1/4"
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
            <Column field="create_time" header="Действителен до" class="w-1/4">
              <template #body="{ data }">
                {{
                  useFormatter().formatDate(addOneMonthToDate(data.create_time))
                }}
              </template>
            </Column>
            <template #expansion="slotProps">
              <div class="p-6">
                <p class="text-lg font-semibold mb-4">
                  Позиции запроса №
                  {{ useFormatter().formatNumber(slotProps.data.num_orders) }}
                </p>

                <!-- Добавим отладочную информацию -->
                <div
                  v-if="
                    !slotProps.data.items || slotProps.data.items.length === 0
                  "
                  class="text-center py-4 text-gray-500"
                >
                  Нет позиций для отображения
                </div>

                <DataTable
                  v-else
                  :value="slotProps.data.items"
                  show-gridlines
                  class="bg-white"
                >
                  <Column field="name" header="Название" class="w-1/4" />
                  <Column field="brand" header="Бренд" class="w-1/4" />
                  <Column field="num_parts" header="Артикул" class="w-1/4" />
                  <Column field="count" header="Количество" class="w-1/4">
                    <template #body="{ data }"> {{ data.count }} шт. </template>
                  </Column>
                </DataTable>
              </div>
            </template>
          </DataTable>
        </div>
      </div>
    </div>
  </section>
</template>
