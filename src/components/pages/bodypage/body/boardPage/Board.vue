<template>
  <div class="board" v-if="$route.params.id">
    <div class="board_row">
      <span>Зарегистрировано</span>
      <div class="drag-container"
           @dragover="onDragOver"
           @drop="onDrop('assigned')">
        <div v-for="task in columns.assigned" :key="task.task_id" class="draggable-item"
             :draggable="true"
             @dragstart="onDragStart(task)">
          {{ task.name }}
        </div>
      </div>
    </div>
    <div class="board_row">
      <span>В работе</span>
      <div class="drag-container"
           @dragover="onDragOver"
           @drop="onDrop('in_progress')">
        <div v-for="task in columns.in_progress" :key="task.task_id" class="draggable-item"
             :draggable="true"
             @dragstart="onDragStart(task)">
          {{ task.name }}
        </div>
      </div>
    </div>
    <div class="board_row">
      <span>Завершено</span>
      <div class="drag-container"
           @dragover="onDragOver"
           @drop="onDrop('completed')">
        <div v-for="task in columns.completed" :key="task.task_id" class="draggable-item"
             :draggable="true"
             @dragstart="onDragStart(task)">
          {{ task.name }}
        </div>
      </div>
    </div>
  </div>
  <div v-else class="board"></div>
</template>

<script setup lang="ts">
import {ref, watchEffect} from "vue";
import {useStore} from "vuex";
import {ITaskShort} from "../../../../../models/TaskModels.ts";

const store = useStore();

const columns = ref({
  assigned: [] as ITaskShort[],
  in_progress: [] as ITaskShort[],
  completed: [] as ITaskShort[]
})

let draggedTaskID: number | null = null;

const onDragStart = (task: ITaskShort) => {
  draggedTaskID = task.task_id;
};

const onDragOver = (event: any) => {
  event.preventDefault();
};

const onDrop = (targetStatus: string) => {
  store.dispatch('projectModule/updateStatusTaskAC', {task_id: draggedTaskID, status: targetStatus})
};

const updateColumns = (tasksArray: ITaskShort[]) => {
  columns.value.assigned = [];
  columns.value.in_progress = [];
  columns.value.completed = [];

  tasksArray.forEach((task) => {
    switch (task.status) {
      case 'assigned':
        columns.value.assigned.push(task);
        break;
      case 'in_progress':
        columns.value.in_progress.push(task);
        break;
      case 'completed':
        columns.value.completed.push(task);
        break;
    }
  })
};

watchEffect(() => { //
  if (store.state.projectModule.currentProject.project_id) {
    updateColumns(store.state.projectModule.currentProject.tasks);
  } else {

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

.board_row {
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