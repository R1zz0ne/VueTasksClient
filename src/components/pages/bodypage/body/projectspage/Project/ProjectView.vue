<template>
  <div class="itemContent" v-if="!!projectStore.currentProject.project_id">
    <div class="fieldBlock">
      <label class="title"># {{ projectStore.currentProject.project_id }}</label>
      <span class="title">{{ projectStore.currentProject.name }}</span>
      <m-button class="btnEdit" @click="handleEdit" type="none">
        <edit-s-v-g fill="var(--primary-600)" style="vertical-align: center"/>
      </m-button>
    </div>
    <div class="fieldBlock">
      <label>Описание</label>
      <span style="display: flex; flex-direction: column">
        <span v-for="(val, index) in projectStore.currentProject.description.split('\n')"
              :key="`desc ${index}`"

        >{{ val }}</span>
      </span>
    </div>
    <div class="fieldBlock">
      <label>Владелец</label>
      <span :title="projectStore.currentProject.owner.email">{{ projectStore.currentProject.owner.name }}</span>
    </div>
    <div class="tasksBlock">
      <div class="tasksTitleBlock">
        <span>Список связанных задач</span>
        <div class="tasksTitleBtn">
          <m-button @click="$router.push(`/board/${projectStore.currentProject.project_id}`)">
            Открыть доску
          </m-button>
          <m-button @click="changeDialogVisible(true)">Создать задачу</m-button>
        </div>
        <m-dialog v-model:show="dialogVisible" is-close="onlyButton">
          <TaskCreate :set-dialog-visible="changeDialogVisible"
                      :project-id="projectStore.currentProject.project_id"></TaskCreate>
        </m-dialog>
      </div>
      <table>
        <tr>
          <th>Название</th>
          <th class="taskPriority">Приоритет</th>
          <th class="taskData">Желаемый срок</th>
          <th>Исполнитель</th>
        </tr>
        <tr v-for="task in projectStore.currentProject.tasks" :key="task.id">
          <td>
            <m-link :click-func="getTaskAndVisible"
                    :id="task.task_id"
                    object="task">{{ task.name }}
            </m-link>
          </td>
          <td>{{ taskPriorityMap[task.priority] }}</td>
          <td>{{ new Date(task.complation_date).toLocaleString() }}</td>
          <td :title="task.member.email">{{ task.member.name }}</td>
        </tr>
      </table>
      <m-dialog v-model:show="taskInfoVisible">
        <task :change-task-info-visible="changeTaskInfoVisible"/>
      </m-dialog>
    </div>
    <record-footer :editor="projectStore.currentProject.editor" :viewers="projectStore.projectRoom"/>
  </div>
  <div class="itemContent" v-else></div>
</template>

<script setup lang="ts">
import MButton from "../../../../../ui/MButton.vue";
import {useStore} from "vuex";
import MDialog from "../../../../../ui/MDialog.vue";
import {ref} from "vue";
import TaskCreate from "../../taskPage/Task/TaskCreate.vue";
import MLink from "../../../../../ui/MLink.vue";
import Task from "../../taskPage/Task/Task.vue";
import EditSVG from "../../../../../ui/svg/EditSVG.vue";
import {IProjectProps} from "../../../../../../models/ProjectModels.ts";
import {taskPriorityMap} from "../../../../../../utils/constants.ts";
import RecordFooter from "../../RecordFooter.vue";
import {setError} from "../../../../../../services/setError.ts";

const dialogVisible = ref(false);
const taskInfoVisible = ref(false);
const store = useStore();
const projectStore = store.state.projectModule;

const {setMode} = defineProps<Omit<IProjectProps, 'mode'>>()


const changeDialogVisible = (value: boolean) => {
  dialogVisible.value = value;
}
const changeTaskInfoVisible = (value: boolean) => {
  taskInfoVisible.value = value;
}
const getTaskAndVisible = async (taskId: number) => {
  await store.dispatch('taskModule/getTaskAC', taskId);
  changeTaskInfoVisible(true);
}

const handleEdit = () => {
  if (typeof projectStore.currentProject.editor?.user_id === 'number') {
    setError({
      message: `Этот проект уже редактирует пользователь "${projectStore.currentProject.editor.name}", попробуйте позже`
    })
  } else {
    setMode('edit', true);
  }
}
</script>

<style scoped>
.btnEdit {
  position: absolute;
  height: 1rem;
  width: 1rem;
  right: calc(1rem + 5px + 5px);
  padding: 0;
}

.itemContent {
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

.tasksBlock {
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

.taskPriority {
  text-align: center;
  width: 100px;
}

.taskData {
  text-align: center;
  width: 100px;
}

.fieldBlock {
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

.fieldBlock:first-child {
  margin: 1rem;
}

.tasksTitleBlock {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.tasksTitleBtn {
  display: flex;
  flex-direction: row;
  gap: 0.5rem;
}
</style>