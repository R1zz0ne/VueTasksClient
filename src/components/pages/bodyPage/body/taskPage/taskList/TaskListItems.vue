<template>
  <div class="table-wrapper" :style="{ width: wrapperWidth + 'px' }">
    <div class="table-row table-header">
      <div
          v-for="(column, index) in columnsName"
          :key="index"
          class="table-cell"
          :style="{ flexBasis: columnWidths[index] + 'px' }"
      >
        {{ column }}
        <div
            class="resize-handle"
            @mousedown.stop="startResizing(index, $event)"
        ></div>
      </div>
    </div>
    <div class="table-body">
      <div
          v-for="task in filterableTaskList"
          class="table-row table-data"
          :key="task.taskId"
          @click="handleClick(task.taskId)"
          :class="[task.taskId === Number($route.params.id) ? 'select' : '']"
      >
        <div
            v-for="(column, index) in columnsValue"
            :key="index"
            class="table-cell"
            :style="{ flexBasis: columnWidths[index] + 'px' }"
        >
          {{ task[column] }}
        </div>
      </div>
      <div ref="observer"/>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref, reactive, onMounted, onBeforeUnmount, watchEffect} from 'vue';
import {Store, useStore} from 'vuex';
import {Router, useRouter} from 'vue-router';
import {IConvTaskList, ITaskListKey} from '../../../../../../models/taskModels.ts';
import {key, State} from "../../../../../../store/store.ts";

const props = defineProps<{ path: string, searchString: string, elements: IConvTaskList[], handleMore: Function }>();

const store: Store<State> = useStore(key);
const router: Router = useRouter();
const filterableTaskList = ref<IConvTaskList[]>([]);
const columnsName: string[] = ["ID", "Название", "Статус", "Приоритет"];
const columnsValue: ITaskListKey[] = ["taskId", "name", "status", "priority"];
const columnWidths = reactive<number[]>([30, 100, 85, 85]);
const tableWidth = ref<number>(299); // Ширина таблицы для ограничения и скролла
const wrapperWidth = ref<number>(299);
const observer = ref<null>(null);
let observe: IntersectionObserver | null = null;

const maxWithList: number = 500;

const isResizing = ref<boolean>(false);
const currentColumnIndex = ref<number | null>(null);
const startX = ref<number | null>(null);
const startWidth = ref<number | null>(null);

const startResizing = (index: number, event: MouseEvent): void => {
  isResizing.value = true;
  currentColumnIndex.value = index;
  startX.value = event.clientX;
  startWidth.value = columnWidths[index];

  document.addEventListener('mousemove', resizeColumn);
  document.addEventListener('mouseup', stopResizing);
};

const resizeColumn = (event: MouseEvent): void => {
  if (!isResizing.value || currentColumnIndex.value === null || startX.value === null || startWidth.value === null) return;

  const delta: number = event.clientX - startX.value;
  const newWidth: number = startWidth.value + delta;

  if (newWidth < 30) return; // Минимальная ширина столбца 30px

  columnWidths[currentColumnIndex.value] = newWidth;

  // Обновление общей ширины таблицы
  const totalWidth: number = columnWidths.reduce((acc, width) => acc + width, 0);
  wrapperWidth.value = Math.min(maxWithList, totalWidth);
  tableWidth.value = wrapperWidth.value < maxWithList ? wrapperWidth.value : Math.max(maxWithList, totalWidth);
};

const stopResizing = (): void => {
  if (isResizing.value) {
    isResizing.value = false;
    document.removeEventListener('mousemove', resizeColumn);
    document.removeEventListener('mouseup', stopResizing);
  }
};

onMounted((): void => {
  document.addEventListener('mouseup', stopResizing);
  if (observer.value) {
    observe = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        props.handleMore()
      }
    }, {rootMargin: '0px 0px 100px 0px', threshold: 0.1})
    observe.observe(observer.value)
  }
});

onBeforeUnmount((): void => {
  document.removeEventListener('mouseup', stopResizing);
  if (observe) {
    observe.disconnect();
  }
});


const handleClick = (taskId: number): void => {
  router.push(`/${props.path}/${taskId}`);
  store.dispatch('taskModule/getTaskAC', taskId);
};

watchEffect((): void => {
  filterableTaskList.value = props.elements.filter((el) => el.name.includes(props.searchString));
});
</script>

<style scoped>
.table-wrapper {
  flex-grow: 1;
  min-width: 299px;
  max-width: 500px;
  display: flex;
  flex-direction: column;
  overflow: auto;
}

.table-row {
  display: flex;
  width: 100%;
  cursor: pointer;
}

.table-body {
  flex-grow: 1;
  overflow: auto;
}

.table-data {
  height: 2.5rem;
  align-items: center;
  border-bottom: 1px solid var(--neutral-400);
}

.table-cell {
  align-items: center;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  position: relative;
}

.table-header {
  font-weight: bold;
  padding-bottom: 5px;
  cursor: default;
  flex-shrink: 0;
}

.resize-handle {
  width: 5px;
  margin-top: 2px;
  margin-bottom: 2px;
  cursor: ew-resize;
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 1;
}

.resize-handle:hover {
  border-left: 1px solid var(--neutral-500);
}

.select {
  background-color: var(--primary-400);
}
</style>
