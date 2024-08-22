<template>
  <div>
    <TaskList></TaskList>
    <div class="contentConteiner">
      <Task v-if="$route.params.id && taskState.currentTask.task_id"></Task>
      <div v-else></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import TaskList from "./TaskList.vue";
import Task from "./Task/Task.vue";
import {useStore} from "vuex";

const taskState = useStore().state.taskModule;
</script>

<style scoped>
.contentConteiner {
  width: 100%;
  height: 100%;
  text-align: center;
  padding: 5px;
}
</style>
