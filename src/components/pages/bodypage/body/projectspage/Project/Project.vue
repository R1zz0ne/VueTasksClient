<template>
  <div class="content">
    <project-view v-if="mode === 'view' && $route.params.id" :set-mode="setMode"></project-view>
    <project-edit v-if="mode === 'edit' && $route.params.id" :set-mode="setMode"></project-edit>
    <project-create v-if="mode === 'create'" :setMode="setMode"></project-create>
  </div>
</template>

<script setup lang="ts">
import ProjectView from "./ProjectView.vue";
import ProjectEdit from "./ProjectEdit.vue";
import ProjectCreate from "./ProjectCreate.vue";
import {IProjectProps} from "../../../../../../models/ProjectModels.ts";
import SocketEmit from "../../../../../../api/socketEmit.ts";
import {onMounted, onUnmounted, watch} from "vue";
import {useStore} from "vuex";
import {useRoute} from "vue-router";

const route = useRoute();
const {mode, setMode} = defineProps<IProjectProps>();
const store = useStore();
const projectState = store.state.projectModule;

const joinRoom = (project_id: number) => {
  SocketEmit.joinRoom({type: 'project', id: project_id});
}
const leaveRoom = (project_id: number) => {
  SocketEmit.leaveRoom({type: 'project', id: project_id});
  store.commit('projectModule/setCurrentProject', {})
  store.commit('projectModule/setProjectRoom', [])
}

onMounted(() => {
  joinRoom(projectState.currentProject.project_id)
})
onUnmounted(() => {
  if (projectState.currentProject.project_id) {
    leaveRoom(projectState.currentProject.project_id)
  }
})
watch(() => route.params.id, (newProjectId, oldProjectId) => {
  if (newProjectId !== oldProjectId) {
    leaveRoom(Number(oldProjectId));
    setMode('view', false)
    joinRoom(Number(newProjectId));
  }
})
</script>

<style scoped>
.content {
  height: 100%;
}
</style>