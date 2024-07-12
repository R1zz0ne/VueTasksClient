<template>
  <div class="text_area" :style="[rows ? `height: ${2+rows*16}px` : 'height:82px']">
  <textarea
      :value="modelValue"
      @input="$emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
      :rows="rows ? rows : 5"
  />
  </div>
</template>

<script setup lang="ts">
interface IMTextareaProps {
  modelValue?: any
  rows?: number
}

const {modelValue, rows} = defineProps<IMTextareaProps>()
//TODO: есть проблемы со стилями, когда появляется скролл
</script>

<style scoped>
textarea {
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
  width: 100%;
}

textarea:focus {
  outline: 2px solid var(--primary-500);
  outline-offset: -2px;
}

.text_area {
  border-radius: 10px;
  overflow: hidden;
  padding: -1px;
}
</style>