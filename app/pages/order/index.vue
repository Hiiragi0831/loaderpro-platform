<script setup lang="ts">
import { FilterMatchMode } from "@primevue/core/api";
import { watchDebounced } from "@vueuse/core";
import type { DataTableFilterEvent, DataTablePageEvent, DataTableSortEvent } from "primevue";
import { ref } from "vue";
import { baseTableStore } from "~/stores/baseTableStore";

const useOrderStore = baseTableStore("orderStore", "orders");
const orderStore = useOrderStore();

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
const expandLoading = ref<Record<string, boolean>>({}); // Состояние загрузки для каждого заказа

const qualities = ref(["В обработке", "Счет отправлен", "Счет оплачен", "В пути", "Отгружен", "Отменен"]);

const initFilters = () => {
  filters.value = {
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    status: { value: null, matchMode: FilterMatchMode.EQUALS },
    create_time: { value: null, matchMode: FilterMatchMode.DATE_IS },
    payment_date: { value: null, matchMode: FilterMatchMode.DATE_IS },
    shipment_date: { value: null, matchMode: FilterMatchMode.DATE_IS },
    ship_date: { value: null, matchMode: FilterMatchMode.DATE_IS },
  };
};
initFilters();

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
            filterParams[key] = filter.value.toISOString().split("T")[0]; // YYYY-MM-DD
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

    console.log("Отправляемые параметры:", params);

    const response = await orderStore.fetchData(params);

    dataItems.value = response.items || [];
    totalRecords.value = response.meta.total_items;

    // Добавим лог для проверки данных
    console.log("Полученные данные:", dataItems.value);
    console.log("Первый элемент items:", dataItems.value[0]?.items);
  } finally {
    loading.value = false;
  }
};

// загрузка деталей заказа (товаров) по его ID
const loadOrderDetails = async (orderData: any) => {
  const orderId = orderData.id || orderData.num;

  // Устанавливаем состояние загрузки для конкретного заказа
  expandLoading.value[orderId] = true;

  try {
    // Отправляем запрос на получение детальной информации о заказе
    const response = await orderStore.fetchDetails(orderId);

    // Обновляем данные заказа с полученными товарами
    const orderIndex = dataItems.value.findIndex((item: any) => (item.id || item.num) === orderId);

    if (orderIndex !== -1) {
      // Предполагаем, что ответ содержит поле items с товарами
      dataItems.value[orderIndex].items = response.items || response.data?.items || [];
    }

    console.log(`Загружены товары для заказа ${orderId}:`, response);
  } catch (error) {
    console.error(`Ошибка загрузки деталей заказа ${orderId}:`, error);
    // Можно показать toast уведомление об ошибке
  } finally {
    expandLoading.value[orderId] = false;
  }
};

// Обработчик раскрытия строки
const onRowExpand = async (event: any) => {
  const orderData = event.data;

  // Проверяем, есть ли уже загруженные данные
  if (!orderData.items || orderData.items.length === 0) {
    await loadOrderDetails(orderData);
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

onMounted(() => {
  loadData();
});
</script>

<template>
  <main class="py-30">
    <section>
      <div class="container mx-auto flex flex-col gap-15">
        <div class="shadow-lg rounded bg-white">
          <div class="flex justify-between items-center p-25">
            <h3>Заказы</h3>
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
              @row-expand="onRowExpand"
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
              <Column field="num" header="Номер запроса" class="w-1/6">
                <template #body="{ data }">
                  <Button v-slot="slotProps" as-child variant="text">
                    <NuxtLink
                      :class="slotProps.class"
                      :to="{ name: 'order-id', params: { id: data.num } }"
                    >
                      {{ useFormatter().formatNumber(data.num) }}
                    </NuxtLink>
                  </Button>
                </template>
              </Column>
              <Column
                field="status"
                header="Статус"
                filter
                :show-filter-match-modes="false"
                class="w-1/6"
              >
                <template #body="{ data }">
                  <Tag
                    :value="data.status"
                    :class="`px-5 py-3 rounded-md font-semibold ${getSeverityBg(data.status)}`"
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
                        :class="`px-5 py-3 rounded-md font-semibold ${getSeverityBg(slotProps.option)}`"
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
                class="w-1/6"
              >
                <template #body="{ data }">
                  {{ data.create_time? useFormatter().formatDate(data.create_time) : 'Нет данных' }}
                </template>
                <template #filter="{ filterModel }">
                  <DatePicker
                    v-model="filterModel.value"
                    dateFormat="dd.mm.yy"
                    placeholder="дд.мм.гг"
                  />
                </template>
              </Column>
              <Column
                field="payment_date"
                header="Дата оплаты"
                :sortable="true"
                filter
                :show-filter-match-modes="false"
                class="w-1/6"
              >
                <template #body="{ data }">
                  {{ data.payment_date? useFormatter().formatDate(data.payment_date) : 'Нет данных' }}
                </template>
                <template #filter="{ filterModel }">
                  <DatePicker
                    v-model="filterModel.value"
                    dateFormat="dd.mm.yy"
                    placeholder="дд.мм.гг"
                  />
                </template>
              </Column>
              <Column
                field="shipment_date"
                header="Дата поставки"
                :sortable="true"
                filter
                :show-filter-match-modes="false"
                class="w-1/6"
              >
                <template #body="{ data }">
                  {{ data.shipment_date? useFormatter().formatDate(data.shipment_date) : 'Нет данных' }}
                </template>
                <template #filter="{ filterModel }">
                  <DatePicker
                    v-model="filterModel.value"
                    dateFormat="dd.mm.yy"
                    placeholder="дд.мм.гг"
                  />
                </template>
              </Column>
              <Column
                field="ship_date"
                header="Дата отгрузки"
                :sortable="true"
                filter
                :show-filter-match-modes="false"
                class="w-1/6"
              >
                <template #body="{ data }">
                  {{ data.ship_date? useFormatter().formatDate(data.ship_date) : 'Нет данных' }}
                </template>
                <template #filter="{ filterModel }">
                  <DatePicker
                    v-model="filterModel.value"
                    dateFormat="dd.mm.yy"
                    placeholder="дд.мм.гг"
                  />
                </template>
              </Column>
              <template #expansion="slotProps">
                <div class="p-6">
                  <p class="text-lg font-semibold mb-4">
                    Позиции запроса №
                    {{ useFormatter().formatNumber(slotProps.data.num) }}
                  </p>

                  <!-- Показываем индикатор загрузки для конкретного заказа -->
                  <div
                    v-if="expandLoading[slotProps.data.id || slotProps.data.num]"
                    class="text-center py-4"
                  >
                    <ProgressSpinner style="width: 30px; height: 30px" />
                    <p class="text-gray-500 mt-2">Загрузка товаров...</p>
                  </div>

                  <!-- Показываем сообщение если нет товаров -->
                  <div
                    v-else-if="
                      !slotProps.data.items || slotProps.data.items.length === 0
                    "
                    class="text-center py-4 text-gray-500"
                  >
                    Нет позиций для отображения
                  </div>

                  <!-- Показываем таблицу с товарами -->
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
                      <template #body="{ data }"> {{ data.count }} шт.</template>
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
