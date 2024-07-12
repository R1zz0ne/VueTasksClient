<template>
  <div class="board">
    <div class="board_row">
      <span>Зарегистрировано</span>
      <div class="drag-container"
           @dragover="onDragOver"
           @drop="onDrop('registered')">
        <div v-for="task in columns.registered" :key="task.id" class="draggable-item"
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
        <div v-for="task in columns.in_progress" :key="task.id" class="draggable-item"
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
           @drop="onDrop('done')">
        <div v-for="task in columns.done" :key="task.id" class="draggable-item"
             :draggable="true"
             @dragstart="onDragStart(task)">
          {{ task.name }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref} from "vue";

// const colreg = ref([] as { id: number; name: string; status: string }[]);
// const colinp = ref([] as { id: number; name: string; status: string }[]);
interface IColumns {
  id: number; name: string; status: string
}

const columns = ref({
  registered: [] as IColumns[],
  in_progress: [] as IColumns[],
  done: [] as IColumns[]
})

const tasksArray = ref([
  {id: 1, name: 'Блок 1', status: 'registered'},
  {id: 2, name: 'Блок 2', status: 'registered'},
  {id: 3, name: 'Блок 3', status: 'in_progress'},
  {id: 4, name: 'Блок 4', status: 'in_progress'},
]);

let draggedTaskID = null;

const onDragStart = (task) => {
  draggedTaskID = task.id;
};

const onDragOver = (event) => {
  event.preventDefault();
};

const onDrop = (targetStatus) => {
  const index = tasksArray.value.findIndex((task) => task.id === draggedTaskID);
  if (index !== -1) {
    tasksArray.value[index].status = targetStatus;
  }
  updateColumns();
};

const updateColumns = () => {
  columns.value.registered = [];
  columns.value.in_progress = [];
  columns.value.done = [];

  tasksArray.value.forEach((task) => {
    switch (task.status) {
      case 'registered':
        columns.value.registered.push(task);
        break;
      case 'in_progress':
        columns.value.in_progress.push(task);
        break;
      case 'done':
        columns.value.done.push(task);
        break;
    }
  })
};

updateColumns();
</script>

<style scoped>
.board {
  display: flex;
  gap: 5px;
  flex-direction: row;
  padding: 5px;
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