<template>
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
</template>

<script setup lang="ts">
const {taskListMode, setTaskListMode} = defineProps<{
  taskListMode: string,
  setTaskListMode: Function
}>();
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
</style>