<template>
  <select
      :value="modelValue"

      @change="onChange"
  >
    <option v-for="(value, name) in validElements"
            :value="name"
            :key="name"
    >{{ value }}
    </option>
  </select>
</template>

<script setup lang="ts">
import {computed, ComputedRef, ref, watch} from "vue";
import {ISelectProps, ISelectPropsElements} from "../../models/otherModels.ts";

const {modelValue, elements, type} = defineProps<ISelectProps>()
const emits = defineEmits(['update:modelValue']);

const onChange = (event: Event): void => {
  const value: string = (event.target as HTMLInputElement).value;
  if (type === "number") {
    emits('update:modelValue', Number(value));
  } else {
    emits('update:modelValue', value);
  }
}

const validElements: ComputedRef<ISelectPropsElements | {}> = computed(() => {
  return typeof elements === 'object' && elements !== null && !Array.isArray(elements)
      ? elements
      : {}
})
const selectRef = ref<HTMLSelectElement | null>(null);
watch(() => modelValue, (newValue) => {
  if (selectRef.value && selectRef.value.value !== newValue) {
    selectRef.value.value = newValue;
  }
})
</script>

<style scoped>
select {
  background-color: var(--neutral-100);
  font-size: 0.85rem;
  height: calc(1rem * 1.4);
  border: 1px var(--neutral-500) solid;
  border-radius: 10px;
  padding-left: 0.5rem;
  padding-right: 0.5rem;
  color: var(--neutral-700);
}

select:focus {
  color: var(--neutral-700);
  outline: 2px solid var(--primary-500);
  outline-offset: -1px;
}
</style>
