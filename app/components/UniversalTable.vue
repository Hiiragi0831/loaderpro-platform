<script setup lang="ts">
import { FilterMatchMode } from "@primevue/core/api";
import { watchDebounced } from "@vueuse/core";
import type { DataTableFilterEvent, DataTablePageEvent, DataTableSortEvent } from "primevue";
import { computed, onMounted, ref } from "vue";
import { baseTableStore } from "~/stores/baseTableStore";

interface TableColumn {
  field: string;
  header: string;
  sortable?: boolean;
  filter?: boolean;
  filterType?: "text" | "select" | "date";
  filterOptions?: { label: string; value: number }[];
  class?: string;
  bodyTemplate?: "link" | "tag" | "date" | "dateOffset" | "count" | "default";
  linkRouteName?: string;
  linkParamField?: string;
}

export interface TableConfig {
  title: string;
  storeName: string;
  endpoint: string;
  dataKey: string;
  columns: TableColumn[];
  expandable?: boolean;
  expandTitle?: string;
  expandColumns?: TableColumn[];
  globalFilterFields?: string[];
  defaultFilters?: Record<string, any>;
}

const props = defineProps<{
  config: TableConfig;
}>();

/**
 * Проверяет корректность переданной конфигурации таблицы
 * Валидирует обязательные поля и структуру данных
 * @param config - конфигурация таблицы для проверки
 * @throws Error - если конфигурация некорректна
 * @returns void
 */
const validateConfig = (config: TableConfig) => {
  if (!config.title?.trim()) {
    console.warn("BaseTable: Заголовок таблицы не указан");
  }

  if (!config.storeName?.trim()) {
    throw new Error("BaseTable: storeName обязательный параметр");
  }

  if (!config.endpoint?.trim()) {
    throw new Error("BaseTable: endpoint обязательный параметр");
  }

  if (!config.dataKey?.trim()) {
    throw new Error("BaseTable: dataKey обязательный параметр");
  }

  if (!Array.isArray(config.columns) || config.columns.length === 0) {
    throw new Error("BaseTable: columns должен быть непустым массивом");
  }

  config.columns.forEach((column, index) => {
    if (!column.field?.trim() || !column.header?.trim()) {
      throw new Error(`BaseTable: Колонка ${index} должна содержать field и header`);
    }
  });
};

// Валидируем конфигурацию при инициализации
try {
  validateConfig(props.config);
  console.log("Конфигураця BaseTable:", props.config);
} catch (error) {
  console.error("Ошибка конфигурации BaseTable:", error);
  throw error;
}

// Инициализация store с проверкой
let store: any;
try {
  const useStore = baseTableStore(props.config.storeName, props.config.endpoint);
  store = useStore();
} catch (error) {
  console.error("Ошибка инициализации store:", error);
  throw error;
}

// Состояние компонента
const dataItems = ref<any>([]);
const expandedRows = ref<any>({});
const currentPage = ref(1);
const rows = ref(10);
const totalRecords = ref(0);
const first = computed(() => (currentPage.value - 1) * rows.value);
const expandLoading = ref<Record<string, boolean>>({});
const filters = ref<Record<string, any>>({});
const sortField = ref();
const sortOrder = ref();
const loading = ref(false);
const error = ref<string | null>(null);

/**
 * Инициализирует фильтры таблицы на основе конфигурации колонок.
 * Создает объект фильтров с правильными типами соответствия для каждой колонки.
 * Добавляет дефолтные фильтры из конфигурации, если они есть.
 * @returns void
 */
const initFilters = () => {
  try {
    const initialFilters: Record<string, any> = {
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    };

    if (Array.isArray(props.config.columns)) {
      props.config.columns.forEach((column) => {
        if (column.filter && column.field) {
          initialFilters[column.field] = {
            value: null,
            matchMode: column.filterType === "date" ? FilterMatchMode.DATE_IS : FilterMatchMode.EQUALS,
          };
        }
      });
    }

    // Добавляем дефолтные фильтры из конфига
    if (props.config.defaultFilters && typeof props.config.defaultFilters === "object") {
      Object.assign(initialFilters, props.config.defaultFilters);
    }

    filters.value = initialFilters;
  } catch (err) {
    console.error("Ошибка инициализации фильтров:", err);
    filters.value = { global: { value: null, matchMode: FilterMatchMode.CONTAINS } };
  }
};

// Инициализируем фильтры сразу
initFilters();

/**
 * Загружает данные для таблицы с сервера.
 * Обрабатывает параметры пагинации, сортировки и фильтрации.
 * Обновляет состояние таблицы после получения данных.
 * Обрабатывает ошибки загрузки.
 * @returns Promise<void>
 */
const loadData = async () => {
  if (loading.value) return; // Предотвращаем множественные одновременные запросы

  loading.value = true;
  error.value = null;

  try {
    // Валидация параметров
    if (currentPage.value < 1) currentPage.value = 1;
    if (rows.value < 1) rows.value = 10;
    if (rows.value > 100) rows.value = 100; // Ограничиваем максимальное количество записей

    const filterParams: Record<string, unknown> = {};

    if (filters.value && typeof filters.value === "object") {
      Object.entries(filters.value).forEach(([key, filter]: [string, any]) => {
        if (!filter || typeof filter !== "object") return;

        if (key === "global") {
          if (filter.value && typeof filter.value === "string" && filter.value.trim() !== "") {
            filterParams.search = filter.value.trim();
          }
          return;
        }

        if (filter.constraints && Array.isArray(filter.constraints)) {
          const activeConstraint = filter.constraints.find(
            (c: any) => c?.value !== null && c?.value !== "" && c?.value !== undefined,
          );
          if (activeConstraint) {
            filterParams[key] = activeConstraint.value;
          }
        } else if (filter.value !== null && filter.value !== "" && filter.value !== undefined) {
          if (filter.value instanceof Date && !isNaN(filter.value.getTime())) {
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

    if (!store?.fetchData || typeof store.fetchData !== "function") {
      throw new Error("Store не содержит метод fetchData");
    }

    const response = await store.fetchData(params);

    // Проверяем корректность ответа
    if (!response || typeof response !== "object") {
      throw new Error("Некорректный формат ответа от сервера");
    }

    dataItems.value = Array.isArray(response.items) ? response.items : [];

    if (response.meta && typeof response.meta === "object" && typeof response.meta.total_items === "number") {
      totalRecords.value = Math.max(0, response.meta.total_items);
    } else {
      totalRecords.value = dataItems.value.length;
      console.warn("Отсутствуют метаданные о количестве записей");
    }
  } catch (err) {
    console.error("Ошибка загрузки данных:", err);
    error.value = err instanceof Error ? err.message : "Произошла неизвестная ошибка при загрузке данных";
    dataItems.value = [];
    totalRecords.value = 0;
  } finally {
    loading.value = false;
  }
};

/**
 * Загружает детальную информацию для раскрытия строки.
 * Получает дополнительные данные для конкретной записи по её ID.
 * Обновляет данные в массиве элементов таблицы.
 * Управляет состоянием загрузки для каждого элемента отдельно.
 * @param data - объект данных строки, содержащий ID для загрузки деталей.
 * @returns Promise<void>
 */
const loadDetails = async (data: any) => {
  if (!data || typeof data !== "object") {
    console.error("Некорректные данные для загрузки деталей");
    return;
  }

  const detailId = data.id;

  if (!detailId) {
    console.error("Отсутствует идентификатор для загрузки деталей");
    return;
  }

  if (expandLoading.value[detailId]) {
    return; // Уже загружается
  }

  expandLoading.value[detailId] = true;

  try {
    if (!store?.fetchDetails || typeof store.fetchDetails !== "function") {
      throw new Error("Store не содержит метод fetchDetails");
    }

    const response = await store.fetchDetails(detailId);

    if (!response || typeof response !== "object") {
      throw new Error("Некорректный ответ при загрузке деталей");
    }

    const idx = dataItems.value.findIndex((item: any) => item?.id === detailId);

    if (idx !== -1 && idx < dataItems.value.length) {
      const items = response.items || response.data?.items || [];
      dataItems.value[idx].items = Array.isArray(items) ? items : [];
    }
  } catch (error) {
    console.error(`Ошибка загрузки деталей ${detailId}:`, error);
    // Показываем пользователю информацию об ошибке
    const idx = dataItems.value.findIndex((item: any) => item?.id === detailId);

    if (idx !== -1) {
      dataItems.value[idx].items = [];
      dataItems.value[idx].loadError = true;
    }
  } finally {
    expandLoading.value[detailId] = false;
  }
};

/**
 * Обработчик раскрытия строки таблицы.
 * Проверяет возможность раскрытия и загружает детали, если они отсутствуют.
 * @param event - событие раскрытия строки, содержащее данные строки.
 * @returns Promise<void>
 */
const onRowExpand = async (event: any) => {
  console.log("onRowExpand вызван:", event);

  if (!props.config.expandable) {
    console.log("Expandable отключен в конфигурации");
    return;
  }

  if (!event?.data) {
    console.error("Некорректные данные события раскрытия строки");
    return;
  }

  const data = event.data;

  if (!data.items || !Array.isArray(data.items) || data.items.length === 0) {
    await loadDetails(data);
  }
};

/**
 * Обработчик события сортировки таблицы.
 * Обновляет параметры сортировки и перезагружает данные.
 * @param event - событие сортировки с полем и направлением сортировки.
 * @returns void
 */
const onSort = (event: DataTableSortEvent) => {
  if (!event || typeof event !== "object") {
    console.error("Некорректные данные события сортировки");
    return;
  }

  sortField.value = event.sortField;
  sortOrder.value = event.sortOrder;
  loadData();
};

/**
 * Обработчик события фильтрации таблицы.
 * Обновляет фильтры, сбрасывает сортировку и пагинацию, перезагружает данные.
 * @param event - событие фильтрации с новыми значениями фильтров.
 * @returns void
 */
const onFilter = (event: DataTableFilterEvent) => {
  if (!event || typeof event !== "object") {
    console.error("Некорректные данные события фильтрации");
    return;
  }

  filters.value = event.filters || {};
  sortField.value = null;
  sortOrder.value = null;
  currentPage.value = 1;
  loadData();
};

/**
 * Очищает все фильтры таблицы и сбрасывает состояние к начальному.
 * Переинициализирует фильтры, сбрасывает сортировку и пагинацию.
 * @returns void
 */
const clearFilter = () => {
  try {
    initFilters();
    currentPage.value = 1;
    sortField.value = null;
    sortOrder.value = null;
    loadData();
  } catch (err) {
    console.error("Ошибка очистки фильтров:", err);
  }
};

/**
 * Обработчик события изменения страницы пагинации.
 * Обновляет текущую страницу и количество записей на странице, перезагружает данные.
 * @param event - событие пагинации с номером страницы и количеством записей.
 * @returns void
 */
const onPage = (event: DataTablePageEvent) => {
  if (!event || typeof event !== "object") {
    console.error("Некорректные данные события пагинации");
    return;
  }

  const newPage = (event.page ?? 0) + 1;
  const newRows = event.rows ?? rows.value;

  if (newPage > 0 && newRows > 0 && newRows <= 100) {
    currentPage.value = newPage;
    rows.value = newRows;
    loadData();
  }
};

/**
 * Добавляет один месяц к переданной дате в строковом формате.
 * Используется для расчета сдвига дат в отображении таблицы.
 * @param dateString - дата в строковом формате для преобразования.
 * @returns string - отформатированная дата со сдвигом или сообщение об ошибке.
 */
const addOneMonthToDate = (dateString: string): string => {
  if (!dateString || typeof dateString !== "string") {
    return "Некорректная дата";
  }

  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return "Некорректная дата";
    }

    date.setMonth(date.getMonth() + 1);
    return date.toISOString().slice(0, 19).replace("T", " ");
  } catch (err) {
    console.error("Ошибка обработки даты:", err);
    return "Ошибка даты";
  }
};

/**
 * Рендерит содержимое ячейки таблицы в зависимости от типа шаблона колонки.
 * Обрабатывает различные типы отображения: дата, дата со сдвигом, количество.
 * @param data - объект данных строки
 * @param column - конфигурация колонки с информацией о шаблоне отображения
 * @returns string - отформатированное содержимое ячейки
 */
const renderCellContent = (data: any, column: TableColumn) => {
  if (!data || !column || !column.field) {
    return "Нет данных";
  }

  const value = data[column.field];

  try {
    switch (column.bodyTemplate) {
      case "date":
        if (!value) return "Нет данных";
        return useFormatter()?.formatDate ? useFormatter().formatDate(value) : value;
      case "dateOffset":
        if (!value) return "Нет данных";
        return useFormatter()?.formatDate
          ? useFormatter().formatDate(addOneMonthToDate(value))
          : addOneMonthToDate(value);
      case "count": {
        const count = Number(value);
        return isNaN(count) ? "Некорректное количество" : `${count} шт.`;
      }
      default:
        return value ?? "Нет данных";
    }
  } catch (err) {
    console.error("Ошибка рендера содержимого ячейки:", err);
    return "Ошибка отображения";
  }
};

// Watchers и lifecycle
watchDebounced(
  () => filters.value?.global?.value,
  (newValue) => {
    try {
      if (filters.value?.global && (newValue === null || newValue === "" || typeof newValue === "string")) {
        currentPage.value = 1;
        loadData();
      }
    } catch (err) {
      console.error("Ошибка в watcher глобального фильтра:", err);
    }
  },
  { debounce: 500, maxWait: 1000 },
);

onMounted(() => {
  loadData();
});
</script>

<template>
  <main class="py-30">
    <section>
      <div class="container mx-auto flex flex-col gap-15">
        <!-- Отображение ошибок -->
        <Message v-if="error" severity="error" class="mb-4 py-5 px-10">
          <template #container>
            <div class="flex items-center gap-5">
              <i class="pi pi-exclamation-triangle"></i>
              <span>{{ error }}</span>
              <Button
                  icon="pi pi-refresh"
                  variant="text"
                  size="small"
                  @click="loadData()"
                  title="Повторить загрузку"
              />
            </div>
          </template>
        </Message>

        <div class="shadow-lg rounded bg-white">
          <div class="flex justify-between items-center p-25">
            <h3>{{ config.title || 'Таблица данных' }}</h3>
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
                :paginator="totalRecords > 0"
                :rows="rows"
                removable-sort
                :first="first"
                :rows-per-page-options="[10, 20, 40, 80]"
                :total-records="totalRecords"
                :pt="{ rowexpansioncell: 'bg-gray-50' }"
                @page="onPage"
                @filter="onFilter"
                @sort="onSort"
                @row-expand="onRowExpand"
            >
              <template #header>
                <div class="flex justify-between">
                  <IconField class="w-300">
                    <InputIcon class="pi pi-search" />
                    <InputText
                        v-model="filters.global.value"
                        placeholder="Поиск"
                        :disabled="loading"
                    />
                  </IconField>
                  <Button
                      type="button"
                      icon="pi pi-filter-slash"
                      label="Очистить фильтры"
                      variant="outlined"
                      :disabled="loading"
                      @click="clearFilter()"
                  />
                </div>
              </template>

              <template #empty>
                <div class="text-center py-8 text-gray-500">
                  {{ loading ? 'Загрузка данных...' : 'Нет данных для отображения' }}
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
                  :sortable="column.sortable && !loading"
                  :filter="column.filter"
                  :show-filter-match-modes="false"
                  :class="column.class"
              >
                <template #body="{ data }">
                  <!-- Link template -->
                  <Button
                      v-if="column.bodyTemplate === 'link' && data[column.linkParamField || column.field]"
                      v-slot="slotProps"
                      as-child
                      variant="text"
                  >
                    <NuxtLink
                        :class="slotProps.class"
                        :to="{ name: column.linkRouteName, params: { id: data[column.linkParamField || column.field] }}"
                    >
                      {{ useFormatter()?.formatNumber ? useFormatter().formatNumber(data[column.field]) : data[column.field] }}
                    </NuxtLink>
                  </Button>

                  <!-- Tag template -->
                  <Tag
                      v-else-if="column.bodyTemplate === 'tag'"
                      :value="data[column.field] || 'Не указано'"
                      :class="`px-5 py-3 rounded-md font-semibold ${getSeverityBg ? getSeverityBg(data[column.field]) : 'bg-gray-200'}`"
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
                      optionLabel="label"
                      optionValue="value"
                      placeholder="Выберите значение"
                      class="w-full"
                      :disabled="loading"
                  >
                    <template #option="slotProps">
                      <Tag
                          :value="slotProps.option.label"
                          :class="`px-5 py-3 rounded-md font-semibold ${getSeverityBg ? getSeverityBg(slotProps.option.label) : 'bg-gray-200'}`"
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
                      :disabled="loading"
                  />
                </template>

                <!-- Filter action buttons -->
                <template v-if="column.filter" #filterclear="{ filterCallback }">
                  <Button
                      type="button"
                      icon="pi pi-times"
                      severity="secondary"
                      :disabled="loading"
                      @click="filterCallback()"
                  />
                </template>

                <template v-if="column.filter" #filterapply="{ filterCallback }">
                  <Button
                      type="button"
                      icon="pi pi-check"
                      severity="success"
                      :disabled="loading"
                      @click="filterCallback()"
                  />
                </template>
              </Column>

              <!-- Expansion template -->
              <template v-if="config.expandable" #expansion="slotProps">
                <div class="p-6">
                  <p class="text-lg font-semibold mb-4">
                    {{ config.expandTitle || 'Детали' }}
                    {{ useFormatter()?.formatNumber ? useFormatter().formatNumber(slotProps.data.num) : slotProps.data.num}}
                  </p>

                  <div
                      v-if="expandLoading[slotProps.data.id || slotProps.data.num]"
                      class="text-center py-4"
                  >
                    <ProgressSpinner class="w-30 h-30" />
                    <p class="text-gray-500 mt-2">Загрузка товаров...</p>
                  </div>

                  <div
                      v-else-if="slotProps.data.loadError"
                      class="text-center py-4 text-red-500"
                  >
                    <i class="pi pi-exclamation-triangle mr-2"></i>
                    Ошибка загрузки данных
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
                        v-for="expandColumn in config.expandColumns || []"
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
