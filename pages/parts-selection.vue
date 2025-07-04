<script setup lang="ts">
import { ref } from 'vue'
import PartsSelectionTransport from '@/components/PartsSelectionTransport.vue'
import PartsSelectionFormRequest from '@/components/PartsSelectionFormRequest.vue'

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
    <Transition name="fade" mode="out-in">
      <component
        :is="showFormRequest ? PartsSelectionFormRequest : PartsSelectionTransport"
        :key="showFormRequest ? 'form' : 'transport'"
        :bind="showFormRequest ? { transportId: selectedTransportId } : {}"
        :on="showFormRequest
          ? { sent: handleFormRequestSent }
          : { select: handleTransportSelect }"
      />
    </Transition>
  </main>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
