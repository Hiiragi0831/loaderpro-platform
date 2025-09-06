<script setup lang="ts"></script>

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
            <InputText placeholder="Поиск" size="large" />
          </IconField>
          <Button size="large">Найти</Button>
        </div>

        <div class="grid grid-cols-4 gap-20 mt-30">
          <ProductItem />
          <ProductItem />
          <ProductItem />
          <ProductItem />
          <ProductItem />
          <ProductItem />
          <ProductItem />
          <ProductItem />
          <ProductItem />
          <ProductItem />
          <ProductItem />
          <ProductItem />
        </div>

        <Paginator class="mt-30" :rows="10" :total-records="120"></Paginator>
      </div>
    </section>
  </main>
</template>

<style scoped></style>
