<template>
  <div class="contentConteiner">
    <div>
      <project-view v-if="mode === 'view' && $route.params.id" :set-mode="setMode"></project-view>
      <project-edit v-if="mode === 'edit' && $route.params.id" :set-mode="setMode"></project-edit>
      <project-create v-if="mode === 'create'" :setMode="setMode"></project-create>
    </div>
  </div>
</template>

<script setup lang="ts">
import ProjectView from "./ProjectView.vue";
import ProjectEdit from "./ProjectEdit.vue";
import ProjectCreate from "./ProjectCreate.vue";
import {IProjectProps} from "../../../../models/ProjectModels.ts";

const {mode, setMode} = defineProps<IProjectProps>();
</script>

<style scoped>
.contentConteiner {
  width: 100%;
  height: 100%;
  text-align: center;
  padding: 5px;
}
</style>