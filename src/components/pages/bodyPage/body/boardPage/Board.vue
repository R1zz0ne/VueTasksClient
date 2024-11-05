<template>
  <div class="board">
    <div class="board-row">
      <span>Зарегистрировано</span>
      <div class="drag-container"
           @dragover="onDragOver"
           @drop="onDrop('assigned')">
        <div v-for="task in columns.assigned" :key="task.taskId" class="draggable-item"
             :draggable="true"
             @dragstart="onDragStart(task)">
          {{ task.name }}
        </div>
      </div>
    </div>
    <div class="board-row">
      <span>В работе</span>
      <div class="drag-container"
           @dragover="onDragOver"
           @drop="onDrop('inProgress')">
        <div v-for="task in columns.inProgress" :key="task.taskId" class="draggable-item"
             :draggable="true"
             @dragstart="onDragStart(task)">
          {{ task.name }}
        </div>
      </div>
    </div>
    <div class="board-row">
      <span>Завершено</span>
      <div class="drag-container"
           @dragover="onDragOver"
           @drop="onDrop('completed')">
        <div v-for="task in columns.completed" :key="task.taskId" class="draggable-item"
             :draggable="true"
             @dragstart="onDragStart(task)">
          {{ task.name }}
        </div>
      </div>
    </div>
  </div>
  <RecordFooter :editor="null" :viewers="store.state.projectModule.boardRoom"/>
</template>

<script setup lang="ts">
import {onMounted, onUnmounted, ref, watch, watchEffect} from "vue";
import {useStore} from "vuex";
import {ITaskShort, ITaskStatusMap} from "../../../../../models/taskModels.ts";
import SocketEmit from "../../../../../api/socketEmit.ts";
import {useRoute} from "vue-router";
import RecordFooter from "../RecordFooter.vue";

const store = useStore();
const route = useRoute();

const columns = ref({
  assigned: [] as ITaskShort[],
  inProgress: [] as ITaskShort[],
  completed: [] as ITaskShort[]
})

let draggedTaskID: number | null = null;

const onDragStart = (task: ITaskShort) => {
  draggedTaskID = task.taskId;
};

const onDragOver = (event: any) => {
  event.preventDefault();
};

const onDrop = (targetStatus: ITaskStatusMap) => {
  SocketEmit.updateStatusTaskEmit({taskId: draggedTaskID!, status: targetStatus})
};

const updateColumns = (tasksArray: ITaskShort[]) => {
  columns.value.assigned = [];
  columns.value.inProgress = [];
  columns.value.completed = [];

  tasksArray.forEach((task) => {
    switch (task.status) {
      case 'assigned':
        columns.value.assigned.push(task);
        break;
      case 'inProgress':
        columns.value.inProgress.push(task);
        break;
      case 'completed':
        columns.value.completed.push(task);
        break;
    }
  })
};

watchEffect(() => {
  if (store.state.projectModule.currentProject.projectId) {
    updateColumns(store.state.projectModule.currentProject.tasks);
  } else {

  }
})

//rooms
const joinRoom = (projectId: number) => {
  SocketEmit.joinRoom({type: 'board', id: projectId})
}
const leaveRoom = (projectId: number) => {
  SocketEmit.leaveRoom({type: 'board', id: projectId})
  store.commit('projectModule/setCurrentProject', {})
  store.commit('projectModule/setBoardRoom', [])
}

onMounted(() => {
  joinRoom(store.state.projectModule.currentProject.projectId)
})
onUnmounted(() => {
  if (store.state.projectModule.currentProject.projectId) {
    leaveRoom(store.state.projectModule.currentProject.projectId)
  }
})
watch(() => route.params.id, (newProjectId, oldProjectId) => {
  if (newProjectId !== oldProjectId) {
    leaveRoom(Number(oldProjectId));
    joinRoom(Number(newProjectId));
  }
})
</script>

<style scoped>
.board {
  display: flex;
  gap: 5px;
  flex-direction: row;
  padding: 5px;
  width: 100%;
  height: 100%;
  align-items: center;
}

.board-row {
  border: 1px solid black;
  border-radius: 5px;
  height: 80%;
  flex: 1;
  display: flex;
  flex-direction: column;

  span {
    display: block;
    text-align: center;
    font-size: 18px;
    background-color: var(--neutral-400);
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
  }
}

.draggable-item {
  margin: 5px;
  border: 1px black dashed;
  cursor: grab;
}

.drag-container {
  height: 100%;
}
</style>