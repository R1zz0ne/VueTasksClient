<template>
  <div class="nav-block">
    <div class="search">
      <m-input v-model="searchString" style="height: 28px" placeholder="Поиск..."></m-input>
    </div>
    <list-items path="board" :search-string="searchString"></list-items>
    <div class="pag">TODO: paginations</div>
  </div>
</template>

<script setup lang="ts">
import MInput from "../../../../ui/MInput.vue";
import ListItems from "../projectsPage/listItems/ListItems.vue";
import {ref} from "vue";

const searchString = ref("")
</script>

<style scoped>
.nav-block {
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