<template>
  <div>
    <ul>
      <nav-item path="/tasks" title="Мои задачи" room="taskList" />
      <nav-item path="/projects" title="Проекты" room="projectList" />
      <nav-item path="/board" title="Доска" room="boardList" />
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
