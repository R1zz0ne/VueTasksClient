<template>
  <a :href="url" @click.prevent="clickFunc(id)">
    <slot></slot>
  </a>
</template>

<script setup lang="ts">
const {clickFunc, id, object} = defineProps<{ clickFunc: Function, id: number, object: string }>();
const url: string = `/${object}/${id}`;
</script>

<style scoped>
a {
  color: var(--primary-700);
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}
</style>