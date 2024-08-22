<template>
  <div class="formViewTask" v-if="task.currentTask.task_id">
    <div class="fieldBlock">
      <label class="title"># {{ task.currentTask.task_id }}</label>
      <span class="title">{{ task.currentTask.name }}</span>
      <m-button class="editBtn" type="none" @click="handleClick">
        <edit-s-v-g fill="var(--primary-600)" style="vertical-align: center"/>
      </m-button>
    </div>
    <div class="fieldBlock">
      <label>Статус</label>
      <span>{{ taskStatusMap[task.currentTask.status as ITaskStatusMap] }}</span>
    </div>
    <div class="fieldBlock">
      <label>Описание</label>
      <span>{{ task.currentTask.description }}</span>
    </div>
    <div class="fieldBlock">
      <label>Проект</label>
      <span>{{ task.currentTask.project.name }}</span>
    </div>
    <div class="fieldBlock">
      <label>Приоритет</label>
      <span>{{ taskPriorityMap[task.currentTask.priority as ITaskPriorityMap] }}</span>
    </div>
    <div class="fieldBlock">
      <label>Желаемый срок</label>
      <span>{{ new Date(task.currentTask.complation_date).toLocaleString() }}</span>
    </div>
    <div class="fieldBlock">
      <label>Исполнитель</label>
      <span>{{ task.currentTask.member.name }}</span>
    </div>
    <record-footer :viewers="task.taskRoom" :editor="task.currentTask.editor"/>
  </div>
  <div class="formViewTask" v-else></div>
</template>

<script setup lang="ts">
import {useStore} from "vuex";
import MButton from "../../../../../ui/MButton.vue";
import EditSVG from "../../../../../ui/svg/EditSVG.vue";
import {taskPriorityMap, taskStatusMap} from "../../../../../../utils/constants.ts";
import {ITaskPriorityMap, ITaskStatusMap} from "../../../../../../models/TaskModels.ts";
import {setError} from "../../../../../../services/setError.ts";
import RecordFooter from "../../RecordFooter.vue";

const {setMode} = defineProps<{ setMode: Function }>()
const task = useStore().state.taskModule;

const handleClick = () => {
  if (typeof task.currentTask.editor?.user_id === 'number') {
    setError({
      message: `Эту задачу уже редактирует пользователь "${task.currentTask.editor?.name}", попробуйте позже`
    })
  } else {
    setMode('edit')
  }
}
</script>

<style scoped>
.fieldBlock {
  position: relative;
  margin: 0 1rem 1rem 1rem;
  display: flex;
  gap: 5px;
  align-items: center;

  label {
    width: 140px;
    text-align: right;
    color: var(--neutral-600);
  }

  span {
    width: calc(100% - 145px);
  }
}

.fieldBlock:first-child {
  margin: 1rem;
}

.title {
  font-size: 20px;
  font-weight: bold;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.fieldBlock > span.title {
  width: calc(100% - 155px);
}

.formViewTask {
  width: 100%;
  max-width: 700px;
  height: 100%;
  text-align: left;
  padding: 5px;
  display: flex;
  flex-direction: column;
}

.editBtn {
  position: absolute;
  right: 0;
  width: 1rem;
  height: 1rem;
  padding: 0;
}
</style>