<script setup lang="ts">
import { FilterMatchMode } from "@primevue/core/api";
import type { DataTableFilterEvent, DataTableFilterMeta, DataTablePageEvent, DataTableSortEvent } from "primevue";
import { useToast } from "primevue/usetoast";
import { computed, nextTick, onMounted, ref, watch } from "vue";
import { useFormatter } from "~/utils/useFormatter";

interface DataTableType {
  page: number;
  limit: number;
  sortBy?: string;
  [key: string]: unknown;
}

interface TableColumn {
  field: string; // Ключ поля в данных
  header: string; // Заголовок колонки

  // Отображение
  formatter?: "number" | "date" | "money"; // Встроенные форматтеры
  customRenderer?: (value: string | null) => string; // Кастомный рендер текста
  customClass?: string; // Доп. классы ячейки
  sortable?: boolean; // Серверная сортировка по этой колонке

  // Фильтрация
  filterable?: boolean; // Включить фильтр по колонке
  filterType?: "select"; // Тип фильтра (сейчас select или текст по умолчанию)
  filterOptions?: Array<string | number>; // Опции для select-фильтра
  statusConfig?: Record<string, string>; // Маппинг значения -> CSS классы для Tag

  // Редактирование (построчное, edit-mode="row")
  editable?: boolean; // Разрешить редактирование в этой колонке
  editorType?: "inputText" | "inputNumber" | "select" | "money";
  editorOptions?: Array<string | number>; // Опции для select-редактора
  editorProps?: Record<string, unknown>; // Доп. пропсы, прокидываются напрямую в редактор
}

interface TableConfig {
  title: string; // Заголовок таблицы
  columns: TableColumn[]; // Колонки
  defaultPerPage: number; // Кол-во записей на страницу по умолчанию

  // Кнопки
  showRefreshButton?: boolean; // Показать кнопку "Обновить" (по умолчанию true)
  showClearFiltersButton?: boolean; // Показать "Очистить фильтры" (по умолчанию true)

  // Глобальный поиск
  enableGlobalSearch?: boolean; // Включить глобальный поиск (инпут в header)
  globalFilterFields?: string[]; // Поля для DataTable (UI), серверу отправляется один параметр
  globalSearchPlaceholder?: string; // Placeholder для инпута
  globalSearchParamName?: string; // Имя параметра для сервера (по умолчанию "search")

  // Выбор строк
  enableSelection?: boolean; // Включить выбор строк
  selectionMode?: "single" | "multiple"; // Режим выбора (по умолчанию "multiple")

  // Редактирование строк
  enableRowEditing?: boolean; // Включить построчное редактирование (row-edit)
  rowEditorColumnHeader?: string; // Заголовок колонки действий (по умолчанию "Действия")
}

interface LoadDataResult<T = Record<string, unknown>> {
  items: T[]; // Данные текущей страницы
  meta: { total_items: number }; // Общее кол-во записей
}

interface Props {
  config: TableConfig;
  loadDataFunction: (params: DataTableType) => Promise<LoadDataResult>;
  clearCacheFunction?: () => void;
  saveRowFunction?: (item: Record<string, unknown>) => Promise<void> | void;
}

const props = defineProps<Props>();

const selection = defineModel<Record<string, unknown>[]>("selection", {
  default: [],
});

const toast = useToast();
const { formatMoney, formatNumber, formatDate } = useFormatter();

const items = ref<Record<string, unknown>[]>([]);
const totalRecords = ref(0);
const currentPage = ref(1);
const perPage = ref(props.config.defaultPerPage || 10);
const sortField = ref<string | null>(null);
const sortOrder = ref<number | null>(null);
const loading = ref(false);

// Для редактирования строк
const editingRows = ref<Record<string, boolean>[]>([]);

const initFilters = () => {
  const filterMeta: DataTableFilterMeta = {};

  // Колоночные фильтры
  props.config.columns.forEach((column) => {
    if (column.filterable) {
      filterMeta[column.field] = {
        value: null,
        matchMode: column.filterType === "select" ? FilterMatchMode.EQUALS : FilterMatchMode.CONTAINS,
      };
    }
  });

  // Глобальный фильтр
  if (props.config.enableGlobalSearch) {
    filterMeta["global"] = {
      value: null,
      matchMode: FilterMatchMode.CONTAINS,
    };
  }

  return filterMeta;
};

const filters = ref<DataTableFilterMeta>(initFilters());

const globalFilterValue = computed<string>({
  get() {
    const gf = (filters.value as any)["global"];
    if (gf && typeof gf === "object" && "value" in gf) {
      return gf.value ?? "";
    }
    return "";
  },
  set(val: string) {
    const current = (filters.value as any)["global"];
    if (!current || typeof current !== "object") {
      (filters.value as any)["global"] = {
        value: val,
        matchMode: FilterMatchMode.CONTAINS,
      };
    } else {
      current.value = val;
    }
  },
});

// Небольшой дебаунс для подгрузки при изменении глобального поиска
let globalFilterTimer: ReturnType<typeof setTimeout> | null = null;
watch(
  () => globalFilterValue.value,
  () => {
    if (!props.config.enableGlobalSearch) return;
    if (globalFilterTimer) clearTimeout(globalFilterTimer);
    globalFilterTimer = setTimeout(() => {
      currentPage.value = 1;
      loadData();
    }, 300);
  },
);

const getFilterValue = (field: string, allFilters: { value: DataTableFilterMeta }): unknown | null => {
  const f = allFilters.value?.[field] as { value: unknown; matchMode?: string } | undefined;
  return f?.value ?? null;
};

const getStatusSeverity = (status: string, statusConfig?: Record<string, string>): string => {
  if (!statusConfig) return "bg-gray-100 text-gray-800";
  return statusConfig[status] || "bg-gray-100 text-gray-800";
};

const formatValue = (
  value: string | number,
  formatter?: TableColumn["formatter"],
  customRenderer?: TableColumn["customRenderer"],
): string => {
  if (customRenderer) {
    return customRenderer(value !== null && value !== undefined ? String(value) : null);
  }
  if (value === null || value === undefined) {
    return "Нет данных";
  }
  switch (formatter) {
    case "money":
      return formatMoney(value);
    case "number":
      return formatNumber(value);
    case "date":
      if (typeof value === "string") return formatDate(value);
      return formatDate(new Date(value).toLocaleDateString());
    default:
      return String(value);
  }
};

const loadData = async (): Promise<void> => {
  try {
    loading.value = true;

    const filterParams: Record<string, unknown> = {};
    props.config.columns.forEach((column) => {
      if (column.filterable) {
        const filterValue = getFilterValue(column.field, filters as any);
        if (filterValue !== null && filterValue !== undefined && String(filterValue).length > 0) {
          filterParams[column.field] = filterValue;
        }
      }
    });

    if (props.config.enableGlobalSearch) {
      const globalValue = getFilterValue("global", filters as any);
      if (globalValue !== null && globalValue !== undefined && String(globalValue).length > 0) {
        filterParams[props.config.globalSearchParamName || "search"] = globalValue;
      }
    }

    const sortValue =
      sortField.value && sortOrder.value
        ? sortOrder.value === 1
          ? sortField.value
          : `-${sortField.value}`
        : undefined;

    const params: DataTableType = {
      page: currentPage.value,
      limit: perPage.value,
      ...(sortValue && { sortBy: sortValue }),
      ...filterParams,
    };

    const result = await props.loadDataFunction(params);
    items.value = result.items;
    totalRecords.value = result.meta.total_items;
  } catch (error) {
    toast.add({
      severity: "error",
      summary: "Ошибка",
      detail: String(error),
      life: 4000,
    });
  } finally {
    loading.value = false;
  }
};

const onPageChange = (event: DataTablePageEvent) => {
  currentPage.value = event.page + 1;
  perPage.value = event.rows;
  loadData();
};

const onSortChange = (event: DataTableSortEvent) => {
  sortField.value = typeof event.sortField === "string" ? event.sortField : null;
  sortOrder.value = typeof event.sortOrder === "number" ? event.sortOrder : null;
  loadData();
};

const onFilter = (event: DataTableFilterEvent) => {
  filters.value = event.filters;
  sortField.value = null;
  sortOrder.value = null;
  currentPage.value = 1;
  loadData();
  console.log("Фильтры применены:", event.filters);
};

const onRowEditSave = async (event: any) => {
  try {
    const { newData } = event;
    if (props.saveRowFunction) {
      await props.saveRowFunction(newData);
      toast.add({
        severity: "success",
        summary: "Успех",
        detail: "Изменения сохранены",
        life: 3000,
      });
    } else {
      const idx = items.value.findIndex((x) => (x as any).id === (newData as any).id);
      if (idx >= 0) items.value[idx] = newData;
      toast.add({
        severity: "success",
        summary: "Успех",
        detail: "Изменения применены",
        life: 3000,
      });
    }
  } catch (error) {
    toast.add({
      severity: "error",
      summary: "Ошибка",
      detail: String(error),
      life: 4000,
    });
  }
};

const clearFilter = () => {
  filters.value = initFilters();
  currentPage.value = 1;
  nextTick(() => {
    loadData();
  });
};

const refreshData = (): void => {
  if (props.clearCacheFunction) {
    props.clearCacheFunction();
  }
  loadData();
};

onMounted(() => {
  loadData();
});
// // JavaScript
// export const config = {
//   title: "Товары",
//   defaultPerPage: 20,
//
//   // Кнопки
//   showRefreshButton: true,
//   showClearFiltersButton: true,
//
//   // Глобальный поиск
//   enableGlobalSearch: true,
//   globalFilterFields: ["product_name", "article"], // для визуального поведения DataTable
//   globalSearchPlaceholder: "Поиск по названию или артикулу",
//   globalSearchParamName: "search", // параметр на API
//
//   // Выбор строк
//   enableSelection: true,
//   selectionMode: "multiple",
//
//   // Построчное редактирование
//   enableRowEditing: true,
//   rowEditorColumnHeader: "Действия",
//
//   // Колонки
//   columns: [
//     {
//       field: "product_name",
//       header: "Название товара",
//       sortable: true,
//       filterable: true,
//       // Текстовый фильтр по умолчанию (contains)
//       editable: true,
//       editorType: "inputText",
//     },
//     {
//       field: "article",
//       header: "Артикул",
//       sortable: true,
//       filterable: true,
//     },
//     {
//       field: "brand",
//       header: "Бренд",
//       filterable: true,
//       filterType: "select",
//       filterOptions: ["Kalmar", "Toyota", "Hyster", "Crown", "Linde"],
//       editable: true,
//       editorType: "select",
//       editorOptions: ["Kalmar", "Toyota", "Hyster", "Crown", "Linde"],
//     },
//     {
//       field: "quality",
//       header: "Качество",
//       filterable: true,
//       filterType: "select",
//       filterOptions: ["Оригинал", "OEM", "Аналог"],
//       editable: true,
//       editorType: "select",
//       editorOptions: ["Оригинал", "OEM", "Аналог"],
//     },
//     {
//       field: "price",
//       header: "Цена",
//       sortable: true,
//       formatter: "money",
//       editable: true,
//       editorType: "money",
//       editorProps: { min: 0 },
//       customClass: "w-150",
//     },
//     {
//       field: "stock",
//       header: "Остаток",
//       sortable: true,
//       formatter: "number",
//       editable: true,
//       editorType: "inputNumber",
//       editorProps: { min: 0, suffix: " шт." },
//       customClass: "w-120",
//     },
//     {
//       field: "status",
//       header: "Статус",
//       filterable: true,
//       filterType: "select",
//       filterOptions: [
//         "В продаже",
//         "Ожидает отгрузки",
//         "Ошибка",
//         "Отправлен",
//         "В архиве",
//         "Ожидает",
//         "Снят с продажи",
//       ],
//       // Маппинг статуса в CSS классы для Tag
//       statusConfig: {
//         "В продаже": "bg-green-100 text-green-800",
//         "Ожидает отгрузки": "bg-yellow-100 text-yellow-800",
//         "Ожидает": "bg-yellow-100 text-yellow-800",
//         "Ошибка": "bg-red-100 text-red-800",
//         "Отправлен": "bg-blue-100 text-blue-800",
//         "В архиве": "bg-gray-100 text-gray-800",
//         "Снят с продажи": "bg-gray-200 text-gray-700",
//       },
//       editable: true,
//       editorType: "select",
//       editorOptions: [
//         "В продаже",
//         "Ожидает отгрузки",
//         "Ошибка",
//         "Отправлен",
//         "В архиве",
//         "Ожидает",
//         "Снят с продажи",
//       ],
//       customClass: "w-180",
//     },
//     {
//       field: "updated_at",
//       header: "Обновлено",
//       formatter: "date",
//       sortable: true,
//       // Кастомная отрисовка, если нужно
//       customRenderer: (value) => (value ? `🕒 ${value}` : "Нет данных"),
//     },
//   ],
// };
</script>

<template>
  <section>
    <div class="container mx-auto flex flex-col gap-15">
      <div class="shadow-lg rounded bg-white">
        <div class="flex justify-between items-center p-25">
          <h3>{{ config.title }}</h3>
          <Button
            v-if="config.showRefreshButton !== false"
            label="Обновить"
            icon="pi pi-refresh"
            :loading="loading"
            @click="refreshData"
          />
        </div>

        <hr class="border-zinc-300" />

        <div class="p-25 flex flex-col gap-25">
          <DataTable
            v-model:filters="filters"
            v-model:selection="selection"
            v-model:editing-rows="editingRows"
            data-key="id"
            filter-display="menu"
            :lazy="true"
            :value="items"
            show-gridlines
            :paginator="totalRecords > perPage"
            :rows="perPage"
            :loading="loading"
            :total-records="totalRecords"
            :global-filter-fields="
              config.enableGlobalSearch ? config.globalFilterFields || [] : []
            "
            :edit-mode="config.enableRowEditing ? 'row' : undefined"
            removable-sort
            @row-edit-save="onRowEditSave"
            @page="onPageChange"
            @sort="onSortChange"
            @filter="onFilter"
          >
            <template
              v-if="
                config.enableGlobalSearch ||
                config.showClearFiltersButton !== false
              "
              #header
            >
              <div class="flex justify-between gap-10 items-center">
                <IconField v-if="config.enableGlobalSearch" class="w-300">
                  <!-- FIX: корректный v-model -->
                  <InputText
                    v-model="globalFilterValue"
                    :placeholder="config.globalSearchPlaceholder || 'Поиск...'"
                  />
                </IconField>
                <div class="flex-1"></div>
                <Button
                  v-if="config.showClearFiltersButton !== false"
                  type="button"
                  icon="pi pi-filter-slash"
                  label="Очистить фильтры"
                  variant="outlined"
                  @click="clearFilter()"
                />
              </div>
            </template>

            <Column
              v-if="config.enableSelection"
              :selection-mode="config.selectionMode || 'multiple'"
              class="w-30"
            />

            <Column
              v-for="column in config.columns"
              :key="column.field"
              :field="column.field"
              :header="column.header"
              :sortable="column.sortable"
              :class="column.customClass || '!p-10'"
              :show-filter-match-modes="false"
              :show-clear-button="column.filterable"
            >
              <template #body="{ data }">
                <div v-if="column.statusConfig">
                  <Tag
                    :value="data[column.field]"
                    :class="`px-5 py-3 rounded-md font-semibold ${getStatusSeverity(data[column.field], column.statusConfig)}`"
                    :unstyled="true"
                  />
                </div>
                <span v-else>
                  {{
                    formatValue(
                      data[column.field],
                      column.formatter,
                      column.customRenderer,
                    )
                  }}
                </span>
              </template>

              <template
                v-if="config.enableRowEditing && column.editable"
                #editor="{ data, field }"
              >
                <template v-if="column.editorType === 'inputNumber'">
                  <InputNumber
                    v-model="data[field]"
                    v-bind="column.editorProps"
                  />
                </template>
                <template v-else-if="column.editorType === 'money'">
                  <InputNumber
                    v-model="data[field]"
                    mode="currency"
                    currency="RUB"
                    locale="ru-RU"
                    v-bind="column.editorProps"
                  />
                </template>
                <template v-else-if="column.editorType === 'select'">
                  <Select
                    v-model="data[field]"
                    :options="column.editorOptions || []"
                    class="w-full"
                    v-bind="column.editorProps"
                  />
                </template>
                <template v-else>
                  <InputText
                    v-model="data[field]"
                    v-bind="column.editorProps"
                  />
                </template>
              </template>

              <template
                v-if="column.filterable && column.filterType === 'select'"
                #filter="{ filterModel }"
              >
                <Select
                  v-model="filterModel.value"
                  :options="column.filterOptions || []"
                  placeholder="Выберите значение"
                  class="w-full"
                >
                  <template v-if="column.statusConfig" #option="slotProps">
                    <Tag
                      :value="slotProps.option"
                      :class="`px-5 py-3 rounded-md font-semibold ${getStatusSeverity(slotProps.option, column.statusConfig)}`"
                      :unstyled="true"
                    />
                  </template>
                </Select>
              </template>

              <template
                v-if="column.filterable"
                #filterclear="{ filterCallback }"
              >
                <Button
                  type="button"
                  icon="pi pi-times"
                  severity="secondary"
                  @click="filterCallback()"
                />
              </template>
              <template
                v-if="column.filterable"
                #filterapply="{ filterCallback }"
              >
                <Button
                  type="button"
                  icon="pi pi-check"
                  severity="success"
                  @click="filterCallback()"
                />
              </template>
            </Column>

            <Column
              v-if="config.enableRowEditing"
              :row-editor="true"
              class="w-110"
              :header="config.rowEditorColumnHeader || 'Действия'"
              body-style="text-align: center"
              :pt="{ columnheadercontent: 'flex items-center justify-center' }"
            />
          </DataTable>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped></style>
