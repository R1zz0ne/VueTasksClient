<template>
  <div>
    <div class="navBlock">
      <div class="search">
        <m-input v-model="searchInput" style="height: 28px" placeholder="Поиск..."></m-input>
        <m-button @click="setMode('create')">+</m-button>
      </div>
      <list-items path="projects" :search-string="searchInput"></list-items>
      <div class="pag">TODO: paginations</div>
    </div>
    <project :mode="mode" :set-mode="setMode"></project>
  </div>
</template>

<script setup lang="ts">
import ListItems from "./listitems/ListItems.vue";
import {ref} from "vue";
import MButton from "../../ui/MButton.vue";
import MInput from "../../ui/MInput.vue";
import Project from "./Project/Project.vue";

const mode = ref("view");
const searchInput = ref("");
const setMode = (value: 'view' | 'edit' | 'create') => {
  mode.value = value;
}
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
  display: flex;
  align-items: center;
  flex-direction: row;
  gap: 5px;
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