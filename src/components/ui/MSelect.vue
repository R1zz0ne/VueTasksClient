<!--<template>-->
<!--  <select-->
<!--      :value="modelValue"-->
<!--      @input="$emit('update:modelValue', Number(($event.target as HTMLSelectElement).value))"-->
<!--  >-->
<!--    <option v-for="element in elements"-->
<!--            :value="element.id"-->
<!--            :key="element.id"-->
<!--    >{{ element.name }}-->
<!--    </option>-->
<!--  </select>-->
<!--</template>-->

<template>
  <select
      :value="modelValue"
      @input="onInput(($event.target as HTMLSelectElement).value)"
  >
    <option v-for="(value, name) in elements"
            :value="name"
            :key="name"
    >{{ value }}
    </option>
  </select>
</template>

<script setup lang="ts">
interface ISelectProps {
  modelValue: any,
  elements: any,
  type: 'number' | 'string'
}

const {modelValue, elements, type} = defineProps<ISelectProps>()

const emits = defineEmits(['update:modelValue']);
const onInput = (value: string) => {
  if (type === 'number') {
    emits('update:modelValue', Number(value))
  } else {
    emits('update:modelValue', value)
  }
}
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
