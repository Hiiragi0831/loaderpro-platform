<script setup lang="ts">
import { useApi } from '~/composables/useApi'
import { onMounted } from 'vue'

interface CatalogData {
  items: Array<{
    id: number
    name: string
    image: string
  }>
  meta: {
    total_items: number
    total_pages: number
    current_page: number
    per_page: number
    remaining_count: number
  }
}

const data = ref<CatalogData>({
  items: [],
  meta: {
    total_items: 0,
    total_pages: 0,
    current_page: 1,
    remaining_count: 0
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

    const res = await fetch(`${useApi().apiUrl}/catalog?${queryParams}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${user.token}` },
    });

    if (res.ok) {
      data.value = await res.json();
    } else {
      error.value = `Ошибка загрузки: ${res.statusText}`;
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
        <div class="flex justify-between items-center mb-20">
          <h1>Каталог</h1>
        </div>

        <div class="flex w-full gap-20 justify-between items-center">
          <IconField class="w-full">
            <InputIcon class="pi pi-search" />
            <InputText
              v-model="searchQuery"
              placeholder="Поиск"
              size="large"
              @keyup.enter="handleSearch"
            />
          </IconField>
          <Button size="large" @click="handleSearch">Найти</Button>
        </div>

        <div v-if="loading" class="grid grid-cols-4 gap-20 mt-30">
          <Skeleton v-for="n in 12" :key="n" class="!h-300 flex w-full" />
        </div>

        <div v-else class="grid grid-cols-4 gap-20 mt-30">
          <ProductItem
            v-for="item in data.items"
            :key="item.id"
            :image="item.image"
            :name="item.name"
            :link="`/product/${item.id}`"
          />
        </div>

        <Paginator
          v-if="data.meta?.total_items > 0"
          class="mt-30"
          :rows="itemsPerPage"
          :totalRecords="data.meta.total_items"
          :page="currentPage - 1"
          @page="onPageChange"
        />
      </div>
    </section>
  </main>
</template>

<style scoped>

</style>
