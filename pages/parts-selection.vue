<script setup lang="ts">
import { ref } from 'vue'

const selectedTransportId = ref<number | null>(null)
const showFormRequest = ref(false)

const handleTransportSelect = (id: number) => {
  selectedTransportId.value = id
  showFormRequest.value = true
}

const handleFormRequestSent = () => {
  selectedTransportId.value = null
  showFormRequest.value = false
}
</script>

<template>
  <main class="py-30">
    <PartsSelectionTransport
      v-if="!showFormRequest"
      @select="handleTransportSelect"
    />
    <PartsSelectionFormRequest
      v-if="showFormRequest"
      :transport-id="selectedTransportId"
      @sent="handleFormRequestSent"
    />
  </main>
</template>

<style scoped></style>
