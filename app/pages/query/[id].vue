<script setup lang="ts">
interface QueryUser {
  id: number;
  firstname: string;
  lastname: string;
}

interface QueryItem {
  id: number;
  name: string;
  brand: string;
  num_parts: string;
  count: number;
}

interface QueryData {
  id: number;
  create_time: string;
  num: string;
  user: QueryUser;
  total_price: number;
  status: string;
  items: QueryItem[];
}

const route = useRoute();
const queryData = ref<QueryData>({} as QueryData);
const isLoading = ref(true);

async function fetchQueryData() {
  const token = JSON.parse(<string>localStorage.getItem("user")).token;
  const res = await fetch(`${useApi().apiUrl}/querys/${route.params.id}`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
  });
  queryData.value = await res.json();
  isLoading.value = false;
}

function addOneMonth(dateStr: string): string {
  const date = new Date(dateStr);
  date.setMonth(date.getMonth() + 1);
  // Форматирование в YYYY-MM-DD
  return date.toISOString().slice(0, 10);
}

onMounted(fetchQueryData);
</script>

<template>
  <main class="py-30">
    <section>
      <div class="container m-auto">
        <div v-if="isLoading" class="text-center py-30">
          <ProgressSpinner />
        </div>
        <div v-else>
          <div
            class="rounded-2xl overflow-hidden bg-blue-50 shadow-lg p-30 grid grid-cols-5 text-lg gap-15 items-center text-center"
          >
            <p>
              Номер запроса: <b>{{ queryData.num }}</b>
            </p>
            <p>Статус: <b>{{ queryData.status }}</b></p>
            <p>Создан: <b>{{ useFormatter().formatDate(queryData.create_time)}}</b></p>
            <p>Действителен до: <b>{{useFormatter().formatDate(addOneMonth(queryData.create_time))}}</b></p>
            <Button icon="pi pi-file-export" label="Экспортировать в файл" />
          </div>
          <div class="flex flex-col gap-30 mt-30">
            <QueryProductItem v-for="item in queryData.items" :key="item.id" :item="item" />
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped></style>
