<template>
  <div>
    <BoardList></BoardList>
    <div class="contentConteiner">
      <Board v-if="$route.params.id && projectState.currentProject.project_id"></Board>
      <div v-else></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Board from "./Board.vue";
import BoardList from "./BoardList.vue";
import {useStore} from "vuex";

const projectState = useStore().state.projectModule;
</script>

<style scoped>
.contentConteiner {
  display: flex;
  gap: 5px;
  flex-direction: column;
  padding: 5px;
  width: 100%;
  height: 100%;
}
</style>