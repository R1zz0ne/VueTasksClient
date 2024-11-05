<template>
  <div class="form-view-task" v-if="task.currentTask.taskId">
    <div class="field-block">
      <label class="title"># {{ task.currentTask.taskId }}</label>
      <span class="title">{{ task.currentTask.name }}</span>
      <m-button class="edit-btn" type="none" @click="handleClick">
        <edit-s-v-g fill="var(--primary-600)" style="vertical-align: center"/>
      </m-button>
    </div>
    <div class="field-block">
      <label>Статус</label>
      <span>{{ taskStatusMap[task.currentTask.status as ITaskStatusMap] }}</span>
    </div>
    <div class="field-block">
      <label>Описание</label>
      <span>{{ task.currentTask.description }}</span>
    </div>
    <div class="field-block">
      <label>Проект</label>
      <span>{{ task.currentTask.project.name }}</span>
    </div>
    <div class="field-block">
      <label>Приоритет</label>
      <span>{{ taskPriorityMap[task.currentTask.priority as ITaskPriorityMap] }}</span>
    </div>
    <div class="field-block">
      <label>Желаемый срок</label>
      <span>{{ new Date(task.currentTask.completionDate).toLocaleString() }}</span>
    </div>
    <div class="field-block">
      <label>Исполнитель</label>
      <span>{{ task.currentTask.member.name }}</span>
    </div>
    <record-footer :viewers="task.taskRoom" :editor="task.currentTask.editor"/>
  </div>
  <div class="form-view-task" v-else></div>
</template>

<script setup lang="ts">
import {useStore} from "vuex";
import MButton from "../../../../../ui/MButton.vue";
import EditSVG from "../../../../../ui/svg/EditSVG.vue";
import {taskPriorityMap, taskStatusMap} from "../../../../../../utils/constants.ts";
import {ITaskPriorityMap, ITaskStatusMap} from "../../../../../../models/taskModels.ts";
import {setError} from "../../../../../../services/setError.ts";
import RecordFooter from "../../RecordFooter.vue";

const {setMode} = defineProps<{ setMode: Function }>()
const task = useStore().state.taskModule;

const handleClick = () => {
  if (typeof task.currentTask.editor?.userId === 'number') {
    setError({
      message: `Эту задачу уже редактирует пользователь "${task.currentTask.editor?.name}", попробуйте позже`
    })
  } else {
    setMode('edit')
  }
}
</script>

<style scoped>
.field-block {
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

.field-block:first-child {
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

.form-view-task {
  width: 100%;
  max-width: 700px;
  height: 100%;
  text-align: left;
  padding: 5px;
  display: flex;
  flex-direction: column;
}

.edit-btn {
  position: absolute;
  right: 0;
  width: 1rem;
  height: 1rem;
  padding: 0;
}
</style>