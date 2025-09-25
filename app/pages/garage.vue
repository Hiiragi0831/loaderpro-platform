<script setup lang="ts">
import {onMounted} from "vue";
import {useApi} from "~/composables/useApi";

interface CatalogData {
  items: Array<{
    id: number
    transportbrand: string
    transportmodel: string
    transportyearproduction: string
    transportserialnumber: string
  }>
  meta: {
    total_items: number
    total_pages: number
    current_page: number
  }
}

const data = ref<CatalogData>({
  items: [],
  meta: {
    total_items: 0,
    total_pages: 0,
    current_page: 1,
  }
})
const currentPage = ref(1)
const itemsPerPage = ref(12)
const searchQuery = ref('')
const loading = ref(false)

const loadItems = async () => {
  loading.value = true
  try {
    const userStr = localStorage.getItem("user");
    if (!userStr) return;

    const user = JSON.parse(userStr);
    const queryParams = new URLSearchParams({
      page: currentPage.value.toString(),
      limit: itemsPerPage.value.toString(),
      ...(searchQuery.value && { search: searchQuery.value })
    })

    const res = await fetch(`${useApi().apiUrl}/garage?${queryParams}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${user.token}` },
    });

    if (res.ok) {
      data.value = await res.json();
    } else {
      console.error(`Ошибка загрузки: ${res.statusText}`)
    }
  } finally {
    loading.value = false
  }
}

// Обработчики событий
const onPageChange = (event: { page: number }) => {
  currentPage.value = event.page + 1
  loadItems()
}

const handleSearch = () => {
  currentPage.value = 1 // Сброс на первую страницу при поиске
  loadItems()
}

onMounted(() => {
  loadItems();
});

watch(searchQuery, (newValue) => {
  if (!newValue) { // Если поисковая строка пуста
    currentPage.value = 1 // Сброс на первую страницу
    loadItems() // Загрузка данных
  }
})
</script>

<template>
  <main class="relative grid py-30">
    <section>
      <div class="container m-auto">
        <h1 class="mb-30">Гараж</h1>
        <div class="flex justify-between items-center mb-20">
          <div class="flex w-400 gap-20 justify-between items-center">
            <IconField class="w-full">
              <InputIcon class="pi pi-search" />
              <InputText placeholder="Поиск ТС" v-model="searchQuery" @keyup.enter="handleSearch"/>
            </IconField>
          </div>
          <div class="flex">
            <Button class="ml-auto">+ Добавить ТС</Button>
          </div>
        </div>

        <div v-if="loading" class="grid gap-20 mt-30">
          <Skeleton v-for="n in 12" :key="n" class="!h-300 flex w-full" />
        </div>

        <div v-else class="grid gap-20 mt-30">
          <GarageItem
              v-for="item in data.items"
              :key="item.id"
              :stamp="item.transportbrand"
              :model="item.transportmodel"
              :serialNumber="item.transportserialnumber"
              :yearProduction="item.transportyearproduction"
          />
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped></style>
