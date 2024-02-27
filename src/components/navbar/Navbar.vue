<template>
  <div>
    <ul>
      <nav-item path="/tasks" title="Задачи" />
      <nav-item path="/projects" title="Проекты" />
    </ul>
  </div>
</template>

<script setup lang="ts">
import NavItem from "./NavItem.vue";
</script>

<style scoped>
ul {
  margin: 0.5rem;
  list-style-type: none;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}
</style>
