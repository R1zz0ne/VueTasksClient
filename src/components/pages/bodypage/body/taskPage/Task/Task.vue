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
      task_id: taskState.currentTask.task_id,
      editor: state.userModule.user.user_id
    })
  } else {
    SocketEmit.updateTaskEditor({
      task_id: taskState.currentTask.task_id,
      editor: null
    })
  }
  mode.value = value;
}


const joinRoom = (task_id: number) => {
  SocketEmit.joinRoom({type: 'task', id: task_id})
}
const leaveRoom = (task_id: number) => {
  SocketEmit.leaveRoom({type: 'task', id: task_id})
  store.commit('taskModule/setCurrentTask', {})
  store.commit('taskModule/setTaskRoom', [])
}

onMounted(() => {
  joinRoom(taskState.currentTask.task_id)
})

onUnmounted(() => {
  if (taskState.currentTask.task_id) {
    leaveRoom(taskState.currentTask.task_id)
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