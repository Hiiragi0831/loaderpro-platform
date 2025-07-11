<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type {
  DataTableFilterEvent,
  DataTableFilterMeta,
  DataTablePageEvent,
  DataTableSortEvent,
} from 'primevue'
import { FilterMatchMode } from '@primevue/core/api'
import { useFormatter } from '~/utils/useFormatter'
import { getFilterValue } from '~/utils/getFilterValue'
import type { DataTableType } from '~/types/dataTableType'

// Типы для конфигурации колонок
interface TableColumn {
  field: string
  header: string
  formatter?: 'number' | 'date' | 'money'
  customClass?: string
  filterable?: boolean
  filterType?: 'select'
  filterOptions?: string[]
  statusConfig?: Record<string, string>
  sortable?: boolean
  customRenderer?: (value: string | null) => string
}

interface TableConfig {
  title: string
  columns: TableColumn[]
  defaultPerPage: number
  showRefreshButton?: boolean
}

interface LoadDataResult<T = Record<string, unknown>> {
  items: T[]
  meta: {
    total_items: number
  }
}

// Props
interface Props {
  config: TableConfig
  loadDataFunction: (params: DataTableType) => Promise<LoadDataResult>
  clearCacheFunction?: () => void
}

const props = defineProps<Props>()

// Composables
const toast = useToast()
const { formatMoney, formatNumber, formatDate } = useFormatter()

// Reactive state
const items = ref<Record<string, unknown>[]>([])
const totalRecords = ref(0)
const currentPage = ref(1)
const perPage = ref(props.config.defaultPerPage || 10)
const sortField = ref<string | null>(null)
const sortOrder = ref<number | null>(null)
const loading = ref(false)

// Инициализация фильтров на основе конфигурации
const initFilters = () => {
  const filterMeta: DataTableFilterMeta = {}

  props.config.columns.forEach((column) => {
    if (column.filterable) {
      filterMeta[column.field] = {
        value: null,
        matchMode:
          column.filterType === 'select' ? FilterMatchMode.EQUALS : FilterMatchMode.CONTAINS,
      }
    }
  })

  return filterMeta
}

const filters = ref<DataTableFilterMeta>(initFilters())

// Функция для получения CSS классов для статусов
const getStatusSeverity = (status: string, statusConfig?: Record<string, string>): string => {
  if (!statusConfig) return 'bg-gray-100 text-gray-800'
  return statusConfig[status] || 'bg-gray-100 text-gray-800'
}

// Функция для форматирования значений
const formatValue = (
  value: string | number,
  formatter?: TableColumn['formatter'],
  customRenderer?: TableColumn['customRenderer'],
): string => {
  if (customRenderer) {
    // Преобразуем значение к string | null для customRenderer
    return customRenderer(value !== null && value !== undefined ? String(value) : null)
  }

  if (value === null || value === undefined) {
    return 'Нет данных'
  }

  switch (formatter) {
    case 'money':
      return formatMoney(value)
    case 'number':
      return formatNumber(value)
    case 'date':
      if (typeof value === 'string') {
        return formatDate(value)
      }
      return formatDate(new Date(value).toLocaleDateString())
    default:
      return String(value)
  }
}

// Загрузка данных
const loadData = async (): Promise<void> => {
  try {
    loading.value = true

    // Собираем параметры фильтров
    const filterParams: Record<string, unknown> = {}
    props.config.columns.forEach((column) => {
      if (column.filterable) {
        const filterValue = getFilterValue(column.field, filters)
        if (filterValue) {
          filterParams[column.field] = filterValue
        }
      }
    })

    // Формируем параметры сортировки
    const sortValue =
      sortField.value && sortOrder.value
        ? sortOrder.value === 1
          ? sortField.value
          : `-${sortField.value}`
        : undefined

    const params: DataTableType = {
      page: currentPage.value,
      limit: perPage.value,
      ...(sortValue && { sortBy: sortValue }),
      ...filterParams,
    }

    const result = await props.loadDataFunction(params)

    items.value = result.items
    totalRecords.value = result.meta.total_items
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Ошибка',
      detail: String(error),
      life: 4000,
    })
  } finally {
    loading.value = false
  }
}

// Обработчики событий
const onPageChange = (event: DataTablePageEvent) => {
  currentPage.value = event.page + 1
  perPage.value = event.rows
  loadData()
}

const onSortChange = (event: DataTableSortEvent) => {
  sortField.value = typeof event.sortField === 'string' ? event.sortField : null
  sortOrder.value = typeof event.sortOrder === 'number' ? event.sortOrder : null
  loadData()
}

const onFilter = (event: DataTableFilterEvent) => {
  filters.value = event.filters
  currentPage.value = 1
  loadData()
}

// Обновление данных
const refreshData = (): void => {
  if (props.clearCacheFunction) {
    props.clearCacheFunction()
  }
  loadData()
}

onMounted(() => {
  loadData()
})
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
        <hr class="border-zinc-300" >
        <div class="p-25 flex flex-col gap-25">
          <DataTable
            v-model:filters="filters"
            data-key="id"
            filter-display="menu"
            :lazy="true"
            :value="items"
            show-gridlines
            :paginator="totalRecords > perPage"
            :rows="perPage"
            :loading="loading"
            :total-records="totalRecords"
            @page="onPageChange"
            @sort="onSortChange"
            @filter="onFilter"
          >
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
              <!-- Основной контент колонки -->
              <template #body="{ data }">
                <div v-if="column.statusConfig">
                  <Tag
                    :value="data[column.field]"
                    :class="`px-5 py-3 rounded-md font-semibold ${getStatusSeverity(data[column.field], column.statusConfig)}`"
                    :unstyled="true"
                  />
                </div>
                <span v-else>
                  {{ formatValue(data[column.field], column.formatter, column.customRenderer) }}
                </span>
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

              <!-- Кнопки фильтра -->
              <template v-if="column.filterable" #filterclear="{ filterCallback }">
                <Button
                  type="button"
                  icon="pi pi-times"
                  severity="secondary"
                  @click="filterCallback()"
                />
              </template>
              <template v-if="column.filterable" #filterapply="{ filterCallback }">
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

<style scoped></style>
