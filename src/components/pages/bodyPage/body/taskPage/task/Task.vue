<template>
  <div class="content">
    <TaskView v-if="mode === 'view'" :set-mode="setMode"></TaskView>
    <TaskEdit v-if="mode === 'edit'" :set-mode="setMode"></TaskEdit>
  </div>
</template>

<script setup lang="ts">
import TaskView from "./TaskView.vue";
import TaskEdit from "./TaskEdit.vue";
import {onMounted, onUnmounted, ref, watch} from "vue";
import {Store, useStore} from "vuex";
import {RouteLocationNormalizedLoaded, useRoute} from "vue-router";
import SocketEmit from "../../../../../../api/socketEmit.ts";
import {key, State} from "../../../../../../store/store.ts";
import {ITaskModuleState, ITaskVisibleMode} from "../../../../../../models/taskModels.ts";

const mode = ref<ITaskVisibleMode>('view');
const route: RouteLocationNormalizedLoaded = useRoute();
const store: Store<State> = useStore(key);
const state: State = store.state;
const taskState: ITaskModuleState = state.taskModule;

const setMode = (value: ITaskVisibleMode): void => {
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

const joinRoom = (taskId: number): void => {
  SocketEmit.joinRoom({type: 'task', id: taskId})
}
const leaveRoom = (taskId: number): void => {
  SocketEmit.leaveRoom({type: 'task', id: taskId})
  store.commit('taskModule/setCurrentTask', {})
  store.commit('taskModule/setTaskRoom', [])
}

onMounted((): void => {
  joinRoom(taskState.currentTask.taskId)
})

onUnmounted((): void => {
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