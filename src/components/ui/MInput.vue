<template>
  <input
      type="text"
      :placeholder="placeholder"
      :value="modelValue"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      :readonly="readonly ? true : false"
      :class="[readonly ? 'readonly' : '']"
  >
</template>

<script setup lang="ts">

interface IMInputProps {
  placeholder?: string,
  modelValue?: any,
  readonly?: boolean
}

const {placeholder, modelValue, readonly} = defineProps<IMInputProps>()
</script>

<style scoped>
input {
  box-sizing: border-box;
  border: 1px var(--neutral-500) solid;
  background-color: var(--neutral-100);
  border-radius: 10px;
  line-height: calc(0.85rem * 1.5);
  font-size: 0.85rem;
  padding-left: 0.5rem;
  padding-right: 0.5rem;
  color: var(--neutral-700);
  transition: outline 0s;
}

input:focus {
  color: var(--neutral-700);
  outline: 2px solid var(--primary-500);
  outline-offset: -1px;
}

input::placeholder {
  color: var(--neutral-400);
}

.readonly {
  background-color: var(--neutral-200);
}
</style>