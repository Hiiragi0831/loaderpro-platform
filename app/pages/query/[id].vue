<script setup lang="ts">
const route = useRoute();
</script>

<template>
  <main class="py-30">
    <section>
      <div class="container m-auto">
        <p>{{ route.params.id }}</p>
        <div
          class="flex rounded-2xl overflow-hidden bg-white shadow-2xl p-30"
        >
          <div class="flex gap-10">
            <p>Ролик мачты</p>
            <p>DAEWOO-DOOSAN (954)</p>
            <p>D580007</p>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped></style>
