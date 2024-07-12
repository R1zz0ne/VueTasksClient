<template>
  <li @click="$router.push(path)"
      :class="{active: $route.path === path || $route.path.startsWith(`${path}/`)}"
  >{{ title }}
  </li>
</template>

<script setup lang="ts">
defineProps(['path', 'title'])
</script>

<style scoped>
li {
  width: 8rem;
  padding: 0.5rem;
  border: 2px solid var(--primary-600);
  border-radius: 0.5rem;
  text-align: center;
  color: var(--primary-600);
  font-weight: bold;
  cursor: pointer;
}

.active {
  box-shadow: 2px 2px var(--primary-700);
}
</style>