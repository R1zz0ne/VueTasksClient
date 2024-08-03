<template>
  <div class="contentConteiner">
    <div v-if="$route.params.id">
      <task-view v-if="mode === 'view'" :set-mode="setMode"></task-view>
      <task-edit v-if="mode === 'edit'" :set-mode="setMode"></task-edit>
    </div>
    <div v-else></div>
  </div>
</template>

<script setup lang="ts">
import TaskView from "./TaskView.vue";
import TaskEdit from "./TaskEdit.vue";
import {ref} from "vue";

const mode = ref('view');
const setMode = (value: 'view' | 'edit') => {
  mode.value = value;
}
</script>

<style scoped>
.contentConteiner {
  width: 100%;
  height: 100%;
  text-align: center;
  padding: 5px;
}
</style>