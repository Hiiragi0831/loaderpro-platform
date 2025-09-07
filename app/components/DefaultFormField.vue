<template>
  <FloatLabel variant="on">
    <InputText
      v-if="type === 'text'"
      :id="id"
      :model-value="modelValue"
      :invalid="invalid"
      size="large"
      @update:model-value="$emit('update:modelValue', $event)"
    />

    <InputMask
      v-else-if="type === 'mask'"
      :id="id"
      :model-value="modelValue"
      :mask="mask"
      :invalid="invalid"
      size="large"
      @update:model-value="$emit('update:modelValue', $event)"
    />

    <Select
      v-else-if="type === 'select'"
      :model-value="modelValue"
      :label-id="id"
      :options="options"
      option-label="name"
      option-value="name"
      class="w-full h-full"
      fluid
      :invalid="invalid"
      size="large"
      @update:model-value="$emit('update:modelValue', $event)"
    />

    <label :for="id">{{ label }}</label>

    <Message
      v-if="error"
      severity="error"
      size="small"
      variant="simple"
      class="absolute"
    >
      {{ error }}
    </Message>
  </FloatLabel>
</template>

<script setup lang="ts">
interface Props {
  id: string;
  modelValue: any;
  invalid: boolean;
  label: string;
  error?: string;
  type: "text" | "mask" | "select";
  mask?: string;
  options?: any[];
}

defineProps<Props>();

defineEmits<{
  "update:modelValue": [value: any];
}>();
</script>
