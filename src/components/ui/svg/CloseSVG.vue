<template>
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
    <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
    <g id="SVGRepo_iconCarrier">
      <path d="M4 4L20 20M20 4L4 20" stroke-width="3" stroke-linecap="round"
            :stroke="color"
            stroke-linejoin="round"></path>
    </g>
  </svg>
</template>

<script setup lang="ts">
import {ref} from "vue";

const {stroke} = defineProps<{ stroke: string }>()
const color = ref('');
switch (stroke) {
  case 'error':
    color.value = 'var(--danger-700)';
    break;
  case 'info':
    color.value = 'var(--primary-700)';
    break;
  case 'success':
    color.value = 'var(--success-700)';
    break;
  case 'warning':
    color.value = 'var(--warning-700)';
    break;
  default:
    color.value = '#000000';
}
</script>

<style scoped>
</style>