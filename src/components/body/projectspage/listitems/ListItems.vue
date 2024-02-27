<template>
  <ul class="listItems">
    <li v-for="project in projects" :key="project.id" @click="$router.push(`/projects?id=${project.id}`)">{{project.name}}</li>
  </ul>
</template>

<script setup lang="ts">
const projects = [
  {
    id: 1,
    name: "project 1"
  },{
    id: 2,
    name: "project 2"
  },{
    id: 3,
    name: "project 3"
  },{
    id: 4,
    name: "project 4"
  },{
    id: 5,
    name: "project 5"
  },{
    id: 6,
    name: "project 6"
  },
]
</script>

<style scoped>
.listItems {
  flex-grow: 1;
  list-style-type: none;

  li {
    padding: 10px 5px 10px 5px;
    border-bottom: 1px solid var(--neutral-400);
  }
}
</style>