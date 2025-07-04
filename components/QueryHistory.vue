<script setup lang="ts">
import { computed, ref } from 'vue'

const data = ref([])
const rowsPerPage = 10
const first = ref(0)
const totalRecords = computed(() => data.value.length)
const showPaginator = computed(() => totalRecords.value > rowsPerPage)
const toast = useToast()

const getData = async () => {
  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/orders`, {
      method: 'GET',
    })
    if (res.ok) {
      data.value = await res.json()
      toast.add({
        severity: 'success',
        summary: 'Успех',
        detail: 'Данные успешно загружены!',
        life: 4000,
      })
    } else {
      const error = await res.text()
      toast.add({ severity: 'error', summary: 'Ошибка', detail: error, life: 4000 })
    }
  } catch (e) {
    toast.add({ severity: 'error', summary: 'Ошибка', detail: String(e), life: 4000 })
  }
}

function formatDateIntl(dateStr: string): string {
  const date = new Date(dateStr.replace(' ', 'T'))
  return new Intl.DateTimeFormat('ru-RU').format(date)
}

onMounted(() => {
  getData()
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
            :value="data"
            show-gridlines
            :paginator="showPaginator"
            :rows="rowsPerPage"
            :first="first"
            :total-records="totalRecords"
            @update:first="(val) => (first = val)"
          >
            <Column field="createTime" header="Дата создания" class="w-1/4 !p-10" :sortable="true">
              <template #body="slotProps">
                {{ formatDateIntl(slotProps.data.createTime) }}
              </template>
            </Column>
            <Column field="numOrders" header="Номер запроса" class="!p-10" />
            <Column field="statusName" header="Статус" class="!p-10" :sortable="true" />
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
