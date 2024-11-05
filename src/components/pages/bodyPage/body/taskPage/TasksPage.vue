<template>
  <div>
    <TaskList></TaskList>
    <div class="content-container">
      <Task v-if="$route.params.id && taskState.currentTask.taskId"></Task>
      <div v-else></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import TaskList from "./taskList/TaskList.vue";
import Task from "./task/Task.vue";
import {useStore} from "vuex";

const taskState = useStore().state.taskModule;
</script>

<style scoped>
.content-container {
  width: 100%;
  height: 100%;
  text-align: center;
  padding: 5px;
}
</style>
