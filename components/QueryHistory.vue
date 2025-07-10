
<script setup lang="ts">
import { ref, computed } from 'vue'
import { FilterMatchMode } from '@primevue/core/api'
import type { DataTableFilterEvent, DataTableFilterMeta, DataTablePageEvent, DataTableSortEvent } from 'primevue'
import { useFormatter } from '@/utils/useFormatter'
import { useQueryHistoryStore } from '@/stores/queryHistory'
import type { QueryHistoryItem } from '~/types/queryType'
import { getFilterValue } from '~/utils/getFilterValue'


const toast = useToast()
const { formatMoney, formatNumber, formatDate } = useFormatter()
const queryHistoryStore = useQueryHistoryStore()

const items = ref<QueryHistoryItem[]>([])
const totalRecords = ref(0)

const currentPage = ref(1)
const perPage = ref(10)
const sortField = ref<string | null>(null)
const sortOrder = ref<number | null>(null)

const statuses = ['Котел', 'В запросе', 'Обработан', 'Подбор']
const filters = ref<DataTableFilterMeta>({
  status_name: { value: null, matchMode: FilterMatchMode.EQUALS }
})

// Используем computed для получения состояния загрузки из стора
const loading = computed(() => queryHistoryStore.isLoading)

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

const loadData = async () => {
  try {
    const status = getFilterValue<string>('status_name', filters)
    const sortValue = sortField.value && sortOrder.value
      ? (sortOrder.value === 1 ? sortField.value : `-${sortField.value}`)
      : undefined

    const params = {
      page: currentPage.value,
      limit: perPage.value,
      ...(sortValue && { sortBy: sortValue }),
      ...(status && { status_name: status }),
    }

    const result = await queryHistoryStore.fetchQueryHistory(params)

    items.value = result.items
    totalRecords.value = result.meta.total_items
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Ошибка',
      detail: String(error),
      life: 4000
    })
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

// Функция для обновления данных (например, после создания нового запроса)
const refreshData = () => {
  queryHistoryStore.clearCache()
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
          <Button
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
            <Column field="create_time" header="Дата создания" class="w-1/4 !p-10" :sortable="true">
              <template #body="slotProps">
                {{ formatDate(slotProps.data.create_time) }}
              </template>
            </Column>
            <Column field="num_orders" header="Номер запроса" class="!p-10">
              <template #body="slotProps">
                {{ formatNumber(slotProps.data.num_orders) }}
              </template>
            </Column>
            <Column
              field="status_name"
              header="Статус"
              class="w-1/4"
              :show-filter-match-modes="false"
              :show-clear-button="true"
            >
              <template #body="{ data }">
                <Tag
                  :value="data.status_name"
                  :class="`px-5 py-3 rounded-md font-semibold ${getSeverity(data.status_name)}`"
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
                {{ formatMoney(slotProps.data.total) }}
              </template>
            </Column>
          </DataTable>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped></style>
