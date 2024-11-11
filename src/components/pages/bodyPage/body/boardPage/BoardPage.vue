<template>
  <div>
    <BoardList></BoardList>
    <div class="content-container">
      <Board v-if="$route.params.id && projectState.currentProject.projectId"></Board>
      <div v-else></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Board from "./Board.vue";
import BoardList from "./BoardList.vue";
import {useStore} from "vuex";
import {key} from "../../../../../store/store.ts";
import {IProjectModuleState} from "../../../../../models/projectModels.ts";

const projectState: IProjectModuleState = useStore(key).state.projectModule;
</script>

<style scoped>
.content-container {
  display: flex;
  gap: 5px;
  flex-direction: column;
  padding: 5px;
  width: 100%;
  height: 100%;
}
</style>