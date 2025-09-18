<script setup lang="ts">
import { FilterMatchMode } from "@primevue/core/api";
import { watchDebounced } from "@vueuse/core";
import type { DataTableFilterEvent, DataTablePageEvent, DataTableSortEvent } from "primevue";
import { ref, computed, onMounted } from "vue";
import { baseTableStore } from "~/stores/baseTableStore";

interface TableColumn {
  field: string;
  header: string;
  sortable?: boolean;
  filter?: boolean;
  filterType?: 'text' | 'select' | 'date';
  filterOptions?: string[];
  class?: string;
  bodyTemplate?: 'link' | 'tag' | 'date' | 'dateOffset' | 'count' | 'default';
  linkRouteName?: string;
  linkParamField?: string;
}

interface TableConfig {
  title: string;
  storeName: string;
  endpoint: string;
  dataKey: string;
  columns: TableColumn[];
  expandable?: boolean;
  expandColumns?: TableColumn[];
  globalFilterFields?: string[];
  defaultFilters?: Record<string, any>;
}

const props = defineProps<{
  config: TableConfig;
}>();

// Инициализация store
const useStore = baseTableStore(props.config.storeName, props.config.endpoint);
const store = useStore();

// Состояние компонента
const dataItems = ref<any>([]);
const expandedRows = ref<any>({});
const currentPage = ref(1);
const rows = ref(10);
const totalRecords = ref(0);
const first = computed(() => (currentPage.value - 1) * rows.value);
const expandLoading = ref<Record<string, boolean>>({});

const filters = ref();
const sortField = ref();
const sortOrder = ref();
const loading = ref(false);

// Инициализация фильтров
const initFilters = () => {
  const initialFilters: Record<string, any> = {
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  };

  props.config.columns.forEach(column => {
    if (column.filter) {
      initialFilters[column.field] = {
        value: null,
        matchMode: column.filterType === 'date' ? FilterMatchMode.DATE_IS : FilterMatchMode.EQUALS
      };
    }
  });

  // Добавляем дефолтные фильтры из конфига
  if (props.config.defaultFilters) {
    Object.assign(initialFilters, props.config.defaultFilters);
  }

  filters.value = initialFilters;
};

// Загрузка данных
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
              (c: any) => c.value !== null && c.value !== "" && c.value !== undefined,
          );
          if (activeConstraint) {
            filterParams[key] = activeConstraint.value;
          }
        } else if (filter.value !== null && filter.value !== "" && filter.value !== undefined) {
          if (filter.value instanceof Date) {
            filterParams[key] = filter.value.toISOString().split("T")[0];
          } else {
            filterParams[key] = filter.value;
          }
        }
      });
    }

    let sortValue: any;
    if (sortField?.value && sortOrder?.value) {
      sortValue = sortOrder.value === 1 ? sortField.value : `-${sortField.value}`;
    }

    const params = {
      page: currentPage.value || 1,
      limit: rows.value,
      ...(sortValue && { sortBy: sortValue }),
      ...filterParams,
    };

    const response = await store.fetchData(params);

    dataItems.value = response.items || [];
    totalRecords.value = response.meta.total_items;
  } finally {
    loading.value = false;
  }
};

// Загрузка деталей
const loadDetails = async (data: any) => {
  const detailId = data.id || data.num || data.num_orders;
  expandLoading.value[detailId] = true;

  try {
    const response = await store.fetchDetails(detailId);
    const idx = dataItems.value.findIndex((item: any) =>
        (item.id || item.num || item.num_orders) === detailId
    );

    if (idx !== -1) {
      dataItems.value[idx].items = response.items || response.data?.items || [];
    }
  } catch (error) {
    console.error(`Ошибка загрузки деталей ${detailId}:`, error);
  } finally {
    expandLoading.value[detailId] = false;
  }
};

// Обработчики событий
const onRowExpand = async (event: any) => {
  const data = event.data;
  if (!data.items || data.items.length === 0) {
    await loadDetails(data);
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

// Утилиты
const addOneMonthToDate = (dateString: string): string => {
  const date = new Date(dateString);
  date.setMonth(date.getMonth() + 1);
  return date.toISOString().slice(0, 19).replace("T", " ");
};

const renderCellContent = (data: any, column: TableColumn) => {
  const value = data[column.field];

  switch (column.bodyTemplate) {
    case 'date':
      return value ? useFormatter().formatDate(value) : 'Нет данных';
    case 'dateOffset':
      return useFormatter().formatDate(addOneMonthToDate(value));
    case 'count':
      return `${value} шт.`;
    default:
      return value;
  }
};

// Watchers и lifecycle
watchDebounced(
    () => filters.value?.global?.value,
    () => {
      currentPage.value = 1;
      loadData();
    },
    { debounce: 500, maxWait: 1000 },
);

onMounted(() => {
  initFilters();
  loadData();
});
</script>

<template>
  <main class="py-30">
    <section>
      <div class="container mx-auto flex flex-col gap-15">
        <div class="shadow-lg rounded bg-white">
          <div class="flex justify-between items-center p-25">
            <h3>{{ config.title }}</h3>
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
                :data-key="config.dataKey"
                :loading="loading"
                :global-filter-fields="config.globalFilterFields || ['status']"
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
                @row-expand="config.expandable ? onRowExpand : undefined"
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

              <!-- Expander column -->
              <Column v-if="config.expandable" expander class="w-20" />

              <!-- Dynamic columns -->
              <Column
                  v-for="column in config.columns"
                  :key="column.field"
                  :field="column.field"
                  :header="column.header"
                  :sortable="column.sortable"
                  :filter="column.filter"
                  :show-filter-match-modes="false"
                  :class="column.class"
              >
                <template #body="{ data }">
                  <!-- Link template -->
                  <Button
                      v-if="column.bodyTemplate === 'link'"
                      v-slot="slotProps"
                      as-child
                      variant="text"
                  >
                    <NuxtLink
                        :class="slotProps.class"
                        :to="{
                        name: column.linkRouteName,
                        params: { id: data[column.linkParamField || column.field] }
                      }"
                    >
                      {{ useFormatter().formatNumber(data[column.field]) }}
                    </NuxtLink>
                  </Button>

                  <!-- Tag template -->
                  <Tag
                      v-else-if="column.bodyTemplate === 'tag'"
                      :value="data[column.field]"
                      :class="`px-5 py-3 rounded-md font-semibold ${getSeverityBg(data[column.field])}`"
                      :unstyled="true"
                  />

                  <!-- Default content -->
                  <span v-else>
                    {{ renderCellContent(data, column) }}
                  </span>
                </template>

                <!-- Filter templates -->
                <template v-if="column.filter && column.filterType === 'select'" #filter="{ filterModel }">
                  <Select
                      v-model="filterModel.value"
                      :options="column.filterOptions"
                      placeholder="Выберите значение"
                      class="w-full"
                  >
                    <template #option="slotProps">
                      <Tag
                          :value="slotProps.option"
                          :class="`px-5 py-3 rounded-md font-semibold ${getSeverityBg(slotProps.option)}`"
                          :unstyled="true"
                      />
                    </template>
                  </Select>
                </template>

                <template v-if="column.filter && column.filterType === 'date'" #filter="{ filterModel }">
                  <DatePicker
                      v-model="filterModel.value"
                      dateFormat="dd.mm.yy"
                      placeholder="дд.мм.гг"
                  />
                </template>

                <!-- Filter action buttons -->
                <template v-if="column.filter" #filterclear="{ filterCallback }">
                  <Button
                      type="button"
                      icon="pi pi-times"
                      severity="secondary"
                      @click="filterCallback()"
                  />
                </template>

                <template v-if="column.filter" #filterapply="{ filterCallback }">
                  <Button
                      type="button"
                      icon="pi pi-check"
                      severity="success"
                      @click="filterCallback()"
                  />
                </template>
              </Column>

              <!-- Expansion template -->
              <template v-if="config.expandable" #expansion="slotProps">
                <div class="p-6">
                  <p class="text-lg font-semibold mb-4">
                    Позиции запроса №
                    {{ useFormatter().formatNumber(slotProps.data.num || slotProps.data.num_orders) }}
                  </p>

                  <div
                      v-if="expandLoading[slotProps.data.id || slotProps.data.num || slotProps.data.num_orders]"
                      class="text-center py-4"
                  >
                    <ProgressSpinner style="width: 30px; height: 30px" />
                    <p class="text-gray-500 mt-2">Загрузка товаров...</p>
                  </div>

                  <div
                      v-else-if="!slotProps.data.items || slotProps.data.items.length === 0"
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
                    <Column
                        v-for="expandColumn in config.expandColumns"
                        :key="expandColumn.field"
                        :field="expandColumn.field"
                        :header="expandColumn.header"
                        :class="expandColumn.class"
                    >
                      <template v-if="expandColumn.bodyTemplate" #body="{ data }">
                        {{ renderCellContent(data, expandColumn) }}
                      </template>
                    </Column>
                  </DataTable>
                </div>
              </template>
            </DataTable>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>
