<template>
  <div class="navBlock">
    <div class="list-block">
      <div class="search">
        <m-input v-model="searchString" style="height: 28px" placeholder="Поиск..."></m-input>
        <div>
          <m-button @click="setVisibleFilter(!visibleFilter)">~</m-button>
          <div v-if="visibleFilter" class="filter">
            <div class="filter-row">
              <div>Статус</div>
              <m-select :elements="taskStatusMap" v-model="filter.status" type="string"/>
            </div>
            <div class="filter-row">
              <div>Приоритет</div>
              <m-select :elements="taskPriorityMap" v-model="filter.priority" type="string"/>
            </div>
            <div class="btn-block">
              <m-button type="danger" @click="cleanFilter">Сброс</m-button>
              <m-button type="success" @click="applyFilter">Применить</m-button>
            </div>
          </div>
        </div>
      </div>
      <div class="tab-panel">
        <div
            class="tab-item"
            :class="[taskListMode === 'active' ? 'tab-item-act' : '']"
            @click="setTaskListMode('active')"
        >Активные
        </div>
        <div
            class="tab-item"
            :class="[taskListMode === 'completed' ? 'tab-item-act' : '']"
            @click="setTaskListMode('completed')"
        >Завершенные
        </div>
      </div>
    </div>
    <task-list-items path="tasks" :search-string="searchString" :elements="filterableArray"></task-list-items>
    <div class="pag">TODO: paginations</div>
  </div>
</template>

<script setup lang="ts">
import MInput from "../../../../ui/MInput.vue";
import TaskListItems from "./TaskListItems.vue";
import {Ref, ref, watchEffect} from "vue";
import MButton from "../../../../ui/MButton.vue";
import MSelect from "../../../../ui/MSelect.vue";
import {convTaskList, taskPriorityMap, taskStatusMap} from "../../../../../utils/constants.ts";
import {useStore} from "vuex";
import {IConvTaskList, ITaskList, ITaskListFilter} from "../../../../../models/TaskModels.ts";

const store = useStore();

const searchString = ref("")
const visibleFilter = ref(false);
const filter: Ref<ITaskListFilter> = ref({
  status: null,
  priority: null
})
const filterableArray = ref([] as IConvTaskList[])
const taskListMode = ref("active");

const setTaskListMode = async (value: 'active' | 'completed') => {
  if (value === 'active' && taskListMode.value !== 'active') {
    await store.dispatch('taskModule/getTaskListAC')
  } else if (value === 'completed' && taskListMode.value !== 'completed') {
    await store.dispatch('taskModule/getCloseTaskListAC')
  }
  taskListMode.value = value;
}

const setVisibleFilter = (value: boolean) => {
  visibleFilter.value = value
}

const taskModule = useStore().state.taskModule;

const applyFilter = () => {
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

const cleanFilter = () => {
  filter.value.priority = null;
  filter.value.status = null;
  filterableArray.value = convTaskList(taskModule.taskList);
}

filterableArray.value = convTaskList(taskModule.taskList);

watchEffect(() => {
  applyFilter()
})
</script>

<style scoped>
.tab-panel {
  width: 80%;
  display: flex;
  flex-direction: row;
}

.tab-item {
  width: 100%;
  text-align: center;
  border: 1px solid var(--primary-400);
  cursor: pointer;
  color: var(--primary-600);
}

.tab-item:first-child {
  border-bottom-left-radius: 5px;
  border-top-left-radius: 5px;
}

.tab-item:last-child {
  border-bottom-right-radius: 5px;
  border-top-right-radius: 5px;
}

.tab-item-act {
  background-color: var(--primary-300);
  font-weight: bold;
}

.list-block {
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
  align-items: center;
}

.navBlock {
  /*min-width: 300px;
  max-width: 600px;*/
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
</style>