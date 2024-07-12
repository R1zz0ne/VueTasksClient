<template>
  <div class="table-wrapper" :style="{ width: wrapperWidth + 'px' }">
    <div class="table-container" :style="{ width: tableWidth + 'px' }">
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
      <div
          v-for="task in filterableTaskList"
          class="table-row"
          :key="task.task_id"
          @click="handleClick(task.task_id)"
          :class="[task.task_id === Number($route.params.id) ? 'select' : '']"
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
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref, reactive, onMounted, onBeforeUnmount, watchEffect} from 'vue';
import {useStore} from 'vuex';
import {useRouter} from 'vue-router';
import {ITaskList} from '../../../models/TaskModels.ts';

const store = useStore();
const router = useRouter();
const filterableTaskList = ref<ITaskList[]>([]);
const columnsName = ["ID", "Название", "Статус", "Приоритет"];
const columnsValue = ["task_id", "name", "status", "priority"];
const columnWidths = reactive([30, 100, 85, 85]);
const tableWidth = ref(299); // Ширина таблицы для ограничения и скролла
const wrapperWidth = ref(299);

const maxWithList: number = 500;

const isResizing = ref(false);
const currentColumnIndex = ref<number | null>(null);
const startX = ref<number | null>(null);
const startWidth = ref<number | null>(null);

const startResizing = (index: number, event: MouseEvent) => {
  isResizing.value = true;
  currentColumnIndex.value = index;
  startX.value = event.clientX;
  startWidth.value = columnWidths[index];

  document.addEventListener('mousemove', resizeColumn);
  document.addEventListener('mouseup', stopResizing);
};

const resizeColumn = (event: MouseEvent) => {
  if (!isResizing.value || currentColumnIndex.value === null || startX.value === null || startWidth.value === null) return;

  const delta = event.clientX - startX.value;
  const newWidth = startWidth.value + delta;

  if (newWidth < 30) return; // Минимальная ширина столбца 30px

  columnWidths[currentColumnIndex.value] = newWidth;

  // Обновление общей ширины таблицы
  const totalWidth = columnWidths.reduce((acc, width) => acc + width, 0);
  wrapperWidth.value = Math.min(maxWithList, totalWidth);
  tableWidth.value = wrapperWidth.value < maxWithList ? wrapperWidth.value : Math.max(maxWithList, totalWidth);
};

const stopResizing = () => {
  if (isResizing.value) {
    isResizing.value = false;
    document.removeEventListener('mousemove', resizeColumn);
    document.removeEventListener('mouseup', stopResizing);
  }
};

onMounted(() => {
  document.addEventListener('mouseup', stopResizing);
});

onBeforeUnmount(() => {
  document.removeEventListener('mouseup', stopResizing);
});

const props = defineProps<{ path: string, searchString: string, elements: ITaskList[] }>();

const handleClick = (taskId: number) => {
  router.push(`/${props.path}/${taskId}`);
  store.dispatch('taskModule/getTaskAC', taskId);
};

watchEffect(() => {
  filterableTaskList.value = props.elements.filter((el) => el.name.includes(props.searchString));
});
</script>

<style scoped>
.table-wrapper {
  overflow-x: auto;
  flex-grow: 1;
  max-width: 500px;
}

.table-container {
  display: flex;
  flex-direction: column;
  min-width: 299px;
}

.table-row {
  display: flex;
  width: 100%;
  cursor: pointer;
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
