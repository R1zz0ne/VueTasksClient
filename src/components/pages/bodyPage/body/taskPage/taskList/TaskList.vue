<template>
  <div class="nav-block">
    <div class="list-block">
      <div class="search">
        <MInput v-model="searchString" style="height: 28px" placeholder="Поиск..."></MInput>
        <div>
          <MButton @click="setVisibleFilter(!visibleFilter)">~</MButton>
          <div v-if="visibleFilter" class="filter">
            <div class="filter-row">
              <div>Статус</div>
              <MSelect :elements="taskStatusMap" v-model="filter.status" type="string"/>
            </div>
            <div class="filter-row">
              <div>Приоритет</div>
              <MSelect :elements="taskPriorityMap" v-model="filter.priority" type="string"/>
            </div>
            <div class="btn-block">
              <MButton type="danger" @click="cleanFilter">Сброс</MButton>
              <MButton type="success" @click="applyFilter">Применить</MButton>
            </div>
          </div>
        </div>
      </div>
      <TaskTabPanel :task-list-mode="taskListMode" :set-task-list-mode="setTaskListMode"/>
    </div>
    <TaskListItems path="tasks"
                   :search-string="searchString"
                   :elements="filterableArray"
                   :handle-more="handleGetTaskMore"
                   v-if="filterableArray.length > 0"
    ></TaskListItems>
    <div v-else class="list-items"/>
    <div class="pag">Кол-во записей: {{ taskModule.pageInfo.totalRecords }}
    </div>
  </div>
</template>

<script setup lang="ts">
import MInput from "../../../../../ui/MInput.vue";
import TaskListItems from "./TaskListItems.vue";
import {ref, watchEffect} from "vue";
import MButton from "../../../../../ui/MButton.vue";
import MSelect from "../../../../../ui/MSelect.vue";
import {convTaskList, taskPriorityMap, taskStatusMap} from "../../../../../../utils/constants.ts";
import {Store, useStore} from "vuex";
import {
  IConvTaskList,
  ITaskList,
  ITaskListFilter,
  ITaskListMode,
  ITaskModuleState
} from "../../../../../../models/taskModels.ts";
import SocketEmit from "../../../../../../api/socketEmit.ts";
import TaskTabPanel from "./TaskTabPanel.vue";
import {key, State} from "../../../../../../store/store.ts";

const store: Store<State> = useStore(key);
const taskModule: ITaskModuleState = useStore(key).state.taskModule;

const searchString = ref<string>("")
const visibleFilter = ref<boolean>(false);
const filter = ref<ITaskListFilter>({
  status: null,
  priority: null
})
const filterableArray = ref<IConvTaskList[]>([])
const taskListMode = ref<ITaskListMode>("active");

const setTaskListMode = async (value: ITaskListMode): Promise<void> => {
  if (value === 'active' && taskListMode.value !== 'active') {
    store.commit('taskModule/setCurrentPage', 1)
    store.commit('taskModule/cleanTaskList')
    await SocketEmit.getTaskListEmit(store.state.taskModule.pageInfo.page);
  } else if (value === 'completed' && taskListMode.value !== 'completed') {
    store.commit('taskModule/setCurrentPage', 1)
    store.commit('taskModule/cleanTaskList')
    await SocketEmit.getCloseTaskListEmit(store.state.taskModule.pageInfo.page);
  }
  taskListMode.value = value;
  store.commit('taskModule/setTaskListMode', value);
}

const setVisibleFilter = (value: boolean): void => {
  visibleFilter.value = value
}

const applyFilter = (): void => {
  const isStatus: boolean = filter.value.status !== null;
  const isPriority: boolean = filter.value.priority !== null;
  const taskList: ITaskList[] = taskModule.taskList;
  let array: ITaskList[] = taskList;
  if (isStatus || isPriority) {
    if (isStatus) {
      array = array.filter((el) => el.status === filter.value.status)
    }
    if (isPriority) {
      array = array.filter((el) => el.priority === filter.value.priority)
    }
    filterableArray.value = convTaskList(array);
  } else {
    filterableArray.value = convTaskList(taskList);
  }
}

const cleanFilter = (): void => {
  filter.value.priority = null;
  filter.value.status = null;
  filterableArray.value = convTaskList(taskModule.taskList);
}

filterableArray.value = convTaskList(taskModule.taskList);

watchEffect((): void => {
  applyFilter()
})

const handleGetTaskMore = async (): Promise<void> => {
  if (taskModule.pageInfo.totalPages > taskModule.pageInfo.page) {
    const newPage: number = taskModule.pageInfo.page + 1;
    store.commit('taskModule/setCurrentPage', newPage);
    if (taskListMode.value === 'active') {
      await SocketEmit.getTaskListEmit(newPage);
    } else {
      await SocketEmit.getCloseTaskListEmit(newPage);
    }
  }
}
</script>

<style scoped>
.list-block {
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
  align-items: center;
}

.nav-block {
  border-right: 1px solid var(--neutral-600);
  display: flex;
  flex-direction: column;
  align-self: stretch;
}

.search {
  width: 100%;
  height: fit-content;
  padding: 5px;
  display: flex;
  align-items: center;
  flex-direction: row;
  gap: 5px;
}

.pag {
  border-top: 1px solid var(--neutral-400);
  height: fit-content;
  padding: 5px;
}

input {
  width: 100%;
}

.filter {
  border: 1px solid var(--neutral-700);
  width: min-content;
  height: min-content;
  position: absolute;
  background-color: var(--neutral-300);
  border-radius: 5px;
  padding: 5px;
  display: flex;
  flex-direction: column;
  gap: 5px;
  z-index: 5;
}

.filter-row {
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
  gap: 5px;

  select {
    width: 150px;
  }
}

.btn-block {
  display: flex;
  gap: 5px;
  justify-content: right;
}

.list-items {
  flex-grow: 1;
  min-width: 299px;
}
</style>