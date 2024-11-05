<template>
  <div :class="[disabled && disabled === 'true' ? 'text-area-disabled' : 'text-area-active']"
       :style="[rows ? `height: ${2+Number(rows)*16}px` : 'height:82px']">
  <textarea
      :class="[disabled && disabled === 'true' ? 'disabled' : 'active']"
      :value="modelValue"
      @input="$emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
      :rows="rows ? rows : 5"
  />
  </div>
</template>

<script setup lang="ts">
interface IMTextareaProps {
  modelValue?: any
  rows?: string
  disabled?: string
}

const {modelValue, rows} = defineProps<IMTextareaProps>()
</script>

<style scoped>
textarea {
  width: 100%;
}

.active {
  background-color: var(--neutral-100);
  font-size: 0.85rem;
  color: var(--neutral-700);
  transition: outline 0s;
  border-radius: 10px;
  box-sizing: border-box;
  resize: none;
  display: inline-block;
  padding-left: 0.5rem;
  padding-right: 0.5rem;
  border: none;
  border: 1px var(--neutral-500) solid;
}

.active:focus {
  outline: 2px solid var(--primary-500);
  outline-offset: -2px;
}

.disabled {
  background-color: var(--neutral-300);
  color: #000000;
  border: none;
  font-size: 1rem;
  font-family: "Times New Roman";
  outline: none;
  box-sizing: border-box;
  resize: none;
  display: inline-block;
}

.text-area-active {
  border-radius: 10px;
  overflow: hidden;
  padding: -1px;
}

.text-area-disabled {
  border-radius: 0;
  overflow: hidden;
}
</style>