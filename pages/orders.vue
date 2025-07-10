<script setup lang="ts">
import { computed, ref } from 'vue'
import type { DataTableFilterEvent, DataTableFilterMeta, DataTablePageEvent, DataTableSortEvent } from 'primevue'
import { FilterMatchMode } from '@primevue/core/api'
import { useFormatter } from '~/utils/useFormatter'
import { useOrderStore } from '~/stores/orders'
import { getFilterValue } from '~/utils/getFilterValue'
import type { OrderItem } from '~/types/orderType'

const toast = useToast()
const { formatMoney, formatNumber, formatDate } = useFormatter()
const orderStore = useOrderStore()

const items = ref<OrderItem[]>([])
const totalRecords = ref(0)
const currentPage = ref(1)
const perPage = ref(10)
const sortField = ref<string | null>(null)
const sortOrder = ref<number | null>(null)

const statuses = ['В обработке', 'Счет отправлен', 'Счет оплачен', 'В пути', 'Отгружен', 'Отменен']
const filters = ref<DataTableFilterMeta>({
  status_name: { value: null, matchMode: FilterMatchMode.EQUALS }
})

const loading = computed(() => orderStore.isLoading)

function getSeverity(status: string): string {
  switch (status) {
    case 'Счет отправлен':
      return 'bg-yellow-100 text-yellow-800'
    case 'Счет оплачен':
      return 'bg-blue-100 text-blue-800'
    case 'В пути':
      return 'bg-sky-100 text-sky-800'
    case 'Отгружен':
      return 'bg-green-100 text-green-800'
    case 'Отменен':
      return 'bg-red-100 text-red-800'
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

    const result = await orderStore.fetchOrderHistory(params)

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
  orderStore.clearCache()
  loadData()
}

onMounted(() => {
  loadData()
})
</script>

<template>
  <main class="py-30">
    <section>
      <div class="container mx-auto flex flex-col gap-15">
        <div class="shadow-lg rounded bg-white">
          <div class="flex justify-between items-center p-25">
            <h3>Заказы</h3>
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
              <Column field="num_orders" header="Номер заказа" class="!p-10">
                <template #body="slotProps">
                  {{ formatNumber(slotProps.data.num_orders) }}
                </template>
              </Column>
              <Column
                field="status_name"
                header="Статус"
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
              <Column field="create_time" header="Дата создания" class="!p-10" :sortable="true">
                <template #body="slotProps">
                  {{ formatDate(slotProps.data.create_time) }}
                </template>
              </Column>
              <Column field="payment_date" header="Дата оплаты" class="!p-10" :sortable="true">
                <template #body="slotProps">
                  {{ slotProps.data.payment_date !== null ? formatDate(slotProps.data.payment_date) : 'Не оплачено' }}
                </template>
              </Column>
              <Column field="shipment_date" header="Дата поставки" class="!p-10" :sortable="true">
                <template #body="slotProps">
                  {{ slotProps.data.shipment_date !== null ? formatDate(slotProps.data.shipment_date) : 'Не отправлено' }}
                </template>
              </Column>
              <Column field="ship_date" header="Дата отгрузки" class="!p-10" :sortable="true">
                <template #body="slotProps">
                  {{ slotProps.data.ship_date !== null ? formatDate(slotProps.data.ship_date) : 'Не отгружено' }}
                </template>
              </Column>
              <Column field="total_price" header="Сумма" class="!p-10" :sortable="true">
                <template #body="slotProps">
                  {{ formatMoney(slotProps.data.total_price) }}
                </template>
              </Column>
            </DataTable>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped></style>
