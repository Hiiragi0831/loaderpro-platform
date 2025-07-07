<script setup lang="ts">
import { ref } from 'vue'
import { FilterMatchMode } from '@primevue/core/api'
import type { DataTableFilterEvent, DataTableFilterMeta, DataTablePageEvent, DataTableSortEvent } from 'primevue'

// Типы данных элемента таблицы
interface QueryHistoryItem {
  createTime: string
  numOrders: string
  firstname: string
  lastname: string
  statusName: string
  total: number
}

const toast = useToast()

const items = ref<QueryHistoryItem[]>([])
const totalRecords = ref(0)
const loading = ref(false)

const currentPage = ref(1)
const perPage = ref(10)
const sortField = ref<string | null>(null)
const sortOrder = ref<number | null>(null)

const statuses = ['Котел', 'В запросе', 'Обработан', 'Подбор']
const filters = ref<DataTableFilterMeta>({
  statusName: { value: null, matchMode: FilterMatchMode.EQUALS }
})

function getSeverity(status: string): string {
  switch (status) {
    case 'В запросе':
      return 'bg-yellow-100 text-yellow-800'
    case 'Обработан':
      return 'bg-green-100 text-green-800'
    case 'Подбор':
      return 'bg-blue-100 text-blue-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

function formatDateIntl(dateStr: string): string {
  const date = new Date(dateStr.replace(' ', 'T'))
  return new Intl.DateTimeFormat('ru-RU').format(date)
}

function getFilterValue<T = unknown>(field: string): T | null {
  const filter = filters.value[field]
  return (typeof filter === 'object' && filter !== null && 'value' in filter)
    ? (filter as { value: T }).value
    : null
}

const loadData = async () => {
  const params = new URLSearchParams()

  params.set('page', String(currentPage.value))
  params.set('limit', String(perPage.value))

  if (sortField.value) {
    const sortValue = sortOrder.value === 1
      ? sortField.value
      : `-${sortField.value}`
    params.set('sortBy', sortValue)
  }

  const status = getFilterValue<string>('statusName')
  if (status) {
    params.set('statusName', status)
  }

  loading.value = true
  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/orders?${params}`, {
      method: 'GET',
    })
    if (res.ok) {
      const result = await res.json()

      items.value = result.items
      totalRecords.value = result.meta.total_items
    } else {
      const error = await res.text()
      toast.add({ severity: 'error', summary: 'Ошибка', detail: error, life: 4000 })
    }
  } catch (e) {
    toast.add({ severity: 'error', summary: 'Ошибка', detail: String(e), life: 4000 })
  } finally {
    loading.value = false
  }
}

const onPageChange = (event: DataTablePageEvent) => {
  currentPage.value = event.page + 1 // PrimeVue начинается с 0
  perPage.value = event.rows

  loadData()
}

const onSortChange = (event: DataTableSortEvent) => {
  sortField.value = typeof event.sortField === 'string' ? event.sortField : null
  sortOrder.value = typeof event.sortOrder === 'number' ? event.sortOrder : null

  loadData()
}

function onFilter(event: DataTableFilterEvent) {
  filters.value = event.filters
  currentPage.value = 1

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
          <h3>История запросов</h3>
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
            <Column field="createTime" header="Дата создания" class="w-1/4 !p-10" :sortable="true">
              <template #body="slotProps">
                {{ formatDateIntl(slotProps.data.createTime) }}
              </template>
            </Column>
            <Column field="numOrders" header="Номер запроса" class="!p-10" />
            <Column
              field="statusName"
              header="Статус"
              class="w-1/4"
              :show-filter-match-modes="false"
              :show-clear-button="true"
            >
              <template #body="{ data }">
                <Tag
                  :value="data.statusName"
                  :class="`px-5 py-3 rounded-md font-semibold ${getSeverity(data.statusName)}`"
                  :unstyled="true"
                />
              </template>
              <template #filter="{ filterModel }">
                <Select
                  v-model="filterModel.value"
                  :options="statuses"
                  placeholder="Выберите статус"
                  class="w-full"
                >
                  <template #option="slotProps">
                    <Tag
                      :value="slotProps.option"
                      :severity="getSeverity(slotProps.option)"
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
            <Column field="total" header="Сумма" class="!p-10" :sortable="true">
              <template #body="slotProps">
                {{ slotProps.data.total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') }} ₽
              </template>
            </Column>
          </DataTable>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped></style>
