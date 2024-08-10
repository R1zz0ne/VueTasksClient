<template>
  <svg viewBox="0 0 20 20" fill="var(--primary-400)" xmlns="http://www.w3.org/2000/svg">
    <g>
      <title>{{props.title}}</title>
      <circle cx="10" cy="10" r="6"/>
    </g>
  </svg>
</template>

<script setup lang="ts">
const props = defineProps<{ title: string }>();
</script>

<style scoped>
</style>