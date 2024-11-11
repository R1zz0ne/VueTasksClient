<template>
  <div class="item-content" v-if="!!projectStore.currentProject.projectId">
    <div class="field-block">
      <label class="title"># {{ projectStore.currentProject.projectId }}</label>
      <span class="title">{{ projectStore.currentProject.name }}</span>
      <MButton class="btn-edit" @click="handleEdit" type="none">
        <EditSVG fill="var(--primary-600)" style="vertical-align: center"/>
      </MButton>
    </div>
    <div class="field-block">
      <label>Описание</label>
      <span style="display: flex; flex-direction: column">
        <span v-for="(val, index) in projectStore.currentProject.description.split('\n')"
              :key="`desc ${index}`"

        >{{ val }}</span>
      </span>
    </div>
    <div class="field-block">
      <label>Владелец</label>
      <span :title="projectStore.currentProject.owner.email">{{ projectStore.currentProject.owner.name }}</span>
    </div>
    <div class="tasks-block">
      <div class="tasks-title-block">
        <span>Список связанных задач</span>
        <div class="tasks-title-btn">
          <MButton @click="$router.push(`/board/${projectStore.currentProject.projectId}`)">
            Открыть доску
          </MButton>
          <MButton @click="changeDialogVisible(true)">Создать задачу</MButton>
        </div>
        <MDialog v-model:show="dialogVisible" is-close="onlyButton">
          <TaskCreate :set-dialog-visible="changeDialogVisible"
                      :project-id="projectStore.currentProject.projectId"></TaskCreate>
        </MDialog>
      </div>
      <table>
        <tr>
          <th>Название</th>
          <th class="task-priority">Приоритет</th>
          <th class="task-data">Желаемый срок</th>
          <th>Исполнитель</th>
        </tr>
        <tr v-for="task in projectStore.currentProject.tasks" :key="task.taskId">
          <td>
            <MLink :click-func="getTaskAndVisible"
                   :id="task.taskId"
                   object="task">{{ task.name }}
            </MLink>
          </td>
          <td>{{ taskPriorityMap[task.priority] }}</td>
          <td>{{ new Date(task.completionDate).toLocaleString() }}</td>
          <td :title="task.member.email">{{ task.member.name }}</td>
        </tr>
      </table>
      <MDialog v-model:show="taskInfoVisible">
        <Task :change-task-info-visible="changeTaskInfoVisible"/>
      </MDialog>
    </div>
    <RecordFooter :editor="projectStore.currentProject.editor" :viewers="projectStore.projectRoom"/>
  </div>
  <div class="item-content" v-else></div>
</template>

<script setup lang="ts">
import MButton from "../../../../../ui/MButton.vue";
import {Store, useStore} from "vuex";
import MDialog from "../../../../../ui/MDialog.vue";
import {ref} from "vue";
import TaskCreate from "../../taskPage/task/TaskCreate.vue";
import MLink from "../../../../../ui/MLink.vue";
import Task from "../../taskPage/task/Task.vue";
import EditSVG from "../../../../../ui/svg/EditSVG.vue";
import {IProjectModuleState, IProjectProps} from "../../../../../../models/projectModels.ts";
import {taskPriorityMap} from "../../../../../../utils/constants.ts";
import RecordFooter from "../../RecordFooter.vue";
import {setError} from "../../../../../../services/setError.ts";
import {key, State} from "../../../../../../store/store.ts";

const dialogVisible = ref<boolean>(false);
const taskInfoVisible = ref<boolean>(false);
const store: Store<State> = useStore(key);
const projectStore: IProjectModuleState = store.state.projectModule;

const {setMode} = defineProps<Omit<IProjectProps, 'mode'>>()


const changeDialogVisible = (value: boolean): void => {
  dialogVisible.value = value;
}
const changeTaskInfoVisible = (value: boolean): void => {
  taskInfoVisible.value = value;
}
const getTaskAndVisible = async (taskId: number): Promise<void> => {
  await store.dispatch('taskModule/getTaskAC', taskId);
  changeTaskInfoVisible(true);
}

const handleEdit = (): void => {
  if (typeof projectStore.currentProject.editor?.userId === 'number') {
    setError({
      type: "error",
      message: `Этот проект уже редактирует пользователь "${projectStore.currentProject.editor.name}", попробуйте позже`
    })
  } else {
    setMode('edit', true);
  }
}
</script>

<style scoped>
.btn-edit {
  position: absolute;
  height: 1rem;
  width: 1rem;
  right: calc(1rem + 5px + 5px);
  padding: 0;
}

.item-content {
  width: 100%;
  height: 100%;
  text-align: center;
  padding: 5px;
  display: flex;
  flex-direction: column;
}

.title {
  font-size: 1.25rem;
  font-weight: bold;
}

.tasks-block {
  margin: 0 1rem 1rem 1rem;
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

.task-priority {
  text-align: center;
  width: 100px;
}

.task-data {
  text-align: center;
  width: 100px;
}

.field-block {
  margin: 0 1rem 1rem 1rem;
  display: flex;
  gap: 5px;
  align-items: start;

  label {
    width: 140px;
    text-align: right;
    color: var(--neutral-600);
  }

  span {
    width: calc(100% - 145px);
    text-align: left;

    span {
      width: 100%;
    }
  }

  div {
    width: calc(100% - 145px);
  }
}

.field-block:first-child {
  margin: 1rem;
}

.tasks-title-block {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.tasks-title-btn {
  display: flex;
  flex-direction: row;
  gap: 0.5rem;
}
</style>