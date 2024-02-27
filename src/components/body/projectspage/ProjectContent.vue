<template>
  <div class="itemContent" v-if="!!project">
    <div class="title">{{project.name}}</div>
    <div class="tasksBlock">
      <span>Список связанных задач</span>
      <table>
        <tr>
          <th>Название</th>
          <th>Приоритет</th>
          <th>Срок</th>
        </tr>
        <tr v-for="task in project.tasks" :key="task.id">
          <td>{{task.name}}</td>
          <td class="taskPriority">{{task.priority}}</td>
          <td class="taskData">{{task.data}}</td>
        </tr>
      </table>
    </div>
  </div>
  <div class="itemContent" v-else> else</div>
</template>

<script setup lang="ts">
interface IProject {
  project: {
    id: number,
    name: string,
    tasks: {
      id: number,
      name: string,
      priority: number,
      data: string
    }[]
  } | null
} //TODO: вынести интерфейс в отдельные файлы с моделями
const {project}  = defineProps<IProject>()
</script>

<style scoped>
.itemContent {
  width: 100%;
  height: 100%;
  text-align: center;
  padding: 5px;
}
.title {
  font-size: 20px;
  font-weight: bold;
}
.tasksBlock {
  margin: 1rem;
  text-align: start;
  span {
    padding-left: 10px;
    font-weight: bold;
  }
  table {
    width: 100%;
    border-spacing: 0;
    border-collapse: collapse;
    td, th {
      border: 1px solid var(--neutral-400);
    }
  }
}
.taskPriority {
  text-align: center;
  width: 100px;
}
.taskData {
  text-align: center;
  width: 100px;
}
</style>