<template>
  <div>
    <div class="navBlock">
      <div class="search">
        <MInput placeholder="Поиск..."></MInput>
      </div>
      <list-items></list-items>
      <div class="pag">TODO: paginations</div>
    </div>
    <project-content :project="getProject($route.query.id)"></project-content>
  </div>
</template>

<script setup lang="ts">
import MInput from "../../ui/MInput.vue";
import ListItems from "./listitems/ListItems.vue";
import ProjectContent from "./ProjectContent.vue";

const getProject = (id: any) => {
  if(!!id) {
    return projects.find((element) => {
      if(element.id === Number(id)) {
        return element
      }
    })
  } else {
    return null
  }
}

const projects = [
  {
    id: 1,
    name: "project 1",
    tasks: [{id: 1, name: "Задача 1", priority: 1, data: "15.02.24"}]
  }, {
    id: 2,
    name: "project 2",
    tasks: [{id: 2, name: "Задача 2", priority: 1, data: "15.02.24"}]
  }, {
    id: 3,
    name: "project 3",
    tasks: [{id: 3, name: "Задача 3", priority: 4, data: "14.02.24"}]
  }, {
    id: 4,
    name: "project 4",
    tasks: [{id: 4, name: "Задача 4", priority: 3, data: "13.02.24"}]
  }, {
    id: 5,
    name: "project 5",
    tasks: [{id: 5, name: "Задача 5", priority: 2, data: "12.02.24"}]
  }, {
    id: 6,
    name: "project 6",
    tasks: [{id: 6, name: "Задача 6", priority: 1, data: "11.02.24"}]
  },
]
</script>

<style scoped>
.navBlock {
  min-width: 300px;
  border-right: 1px solid var(--neutral-600);
  display: flex;
  flex-direction: column;
  align-self: stretch;
}

.search {
  height: fit-content;
  padding: 5px;
  border-bottom: 1px solid var(--neutral-400);
}

.pag {
  border-top: 1px solid var(--neutral-400);
  height: fit-content;
  padding: 5px;
}

input {
  width: 100%;
}

</style>