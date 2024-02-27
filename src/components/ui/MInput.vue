<template>
  <input
      type="text"
      :placeholder="placeholder"
      :value="modelValue"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
  >
</template>

<script setup lang="ts">
defineProps(['placeholder', 'modelValue'])
</script>

<style scoped>
input {
  box-sizing: border-box;
  border: 1px var(--neutral-500) solid;
  background-color: var(--neutral-100);
  border-radius: 10px;
  height: 1.5rem;
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
</style>