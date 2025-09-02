<script setup lang="ts">
const route = useRoute();
</script>

<template>
  <main class="py-30">
    <section>
      <div class="container m-auto">
        <div
          class="rounded-2xl overflow-hidden bg-blue-50 shadow-lg p-30 grid grid-cols-5 text-lg gap-15 items-center text-center"
        >
          <p>Дата создания: <b>01.09.2025</b></p>
          <p>
            Номер запроса: <b>{{ route.params.id }}</b>
          </p>
          <p>Статус: <b>Котел</b></p>
          <p>Действительно до: <b>01.10.2025</b></p>
          <Button icon="pi pi-file-export" label="Экспортировать в файл" />
        </div>
        <div class="flex flex-col gap-30 mt-30">
          <QueryProductItem />
          <QueryProductItem />
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped></style>
