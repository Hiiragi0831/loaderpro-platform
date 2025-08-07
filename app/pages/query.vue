<script setup lang="ts">
const store = useQueryViewStore();
</script>

<template>
  <main class="py-30 flex flex-col gap-30">
    <section>
      <div class="container mx-auto flex flex-col gap-15">
        <Tabs :value="store.activeView">
          <TabList>
            <Tab value="new-request" @click="store.setActiveView('new-request')"
              >Новый запрос</Tab
            >
            <Tab value="history" @click="store.setActiveView('history')"
              >История</Tab
            >
            <Tab value="funnel" @click="store.setActiveView('funnel')"
              >Воронка</Tab
            >
          </TabList>
        </Tabs>
      </div>
    </section>

    <QueryNewRequest v-if="store.activeView === 'new-request'" />
    <QueryHistory v-else-if="store.activeView === 'history'" />
    <QueryFunnel v-else-if="store.activeView === 'funnel'" />
  </main>
</template>

<style scoped></style>
