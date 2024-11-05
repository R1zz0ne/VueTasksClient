<template>
  <div class="content">
    <task-view v-if="mode === 'view'" :set-mode="setMode"></task-view>
    <task-edit v-if="mode === 'edit'" :set-mode="setMode"></task-edit>
  </div>
</template>

<script setup lang="ts">
import TaskView from "./TaskView.vue";
import TaskEdit from "./TaskEdit.vue";
import {onMounted, onUnmounted, ref, watch} from "vue";
import {useStore} from "vuex";
import {useRoute} from "vue-router";
import SocketEmit from "../../../../../../api/socketEmit.ts";

const mode = ref('view');
const route = useRoute();
const store = useStore();
const state = store.state;
const taskState = state.taskModule;

const setMode = (value: 'view' | 'edit') => {
  if (value === 'edit') {
    SocketEmit.updateTaskEditor({
      taskId: taskState.currentTask.taskId,
      editor: state.userModule.user.userId
    })
  } else {
    SocketEmit.updateTaskEditor({
      taskId: taskState.currentTask.taskId,
      editor: null
    })
  }
  mode.value = value;
}


const joinRoom = (taskId: number) => {
  SocketEmit.joinRoom({type: 'task', id: taskId})
}
const leaveRoom = (taskId: number) => {
  SocketEmit.leaveRoom({type: 'task', id: taskId})
  store.commit('taskModule/setCurrentTask', {})
  store.commit('taskModule/setTaskRoom', [])
}

onMounted(() => {
  joinRoom(taskState.currentTask.taskId)
})

onUnmounted(() => {
  if (taskState.currentTask.taskId) {
    leaveRoom(taskState.currentTask.taskId)
  }
})

watch(() => route.params.id, (newTaskId, oldTaskId) => {
  if (newTaskId !== oldTaskId) {
    leaveRoom(Number(oldTaskId));
    joinRoom(Number(newTaskId));
  }
})
</script>

<style scoped>
.content {
  height: 100%;
}
</style>