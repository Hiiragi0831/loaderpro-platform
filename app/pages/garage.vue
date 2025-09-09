<script setup lang="ts">
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
              <InputText placeholder="Поиск ТС" />
            </IconField>
          </div>
          <div class="flex">
            <Button class="ml-auto">+ Добавить ТС</Button>
          </div>
        </div>

        <div class="grid gap-20 mt-30">
          <GarageItem />
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped></style>
