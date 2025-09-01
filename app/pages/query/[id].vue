<script setup lang="ts">
const route = useRoute();
</script>

<template>
  <main class="py-30">
    <section>
      <div class="container m-auto">
        <p>{{ route.params.id }}</p>
        <div class="flex flex-col gap-30">
          <QueryProductItem />
          <QueryProductItem />
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped></style>
