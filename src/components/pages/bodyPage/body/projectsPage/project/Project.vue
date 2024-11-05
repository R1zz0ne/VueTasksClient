<template>
  <div class="content">
    <project-view v-if="mode === 'view' && $route.params.id && projectState.currentProject.projectId"
                  :set-mode="setMode"></project-view>
    <project-edit v-if="mode === 'edit' && $route.params.id && projectState.currentProject.projectId"
                  :set-mode="setMode"></project-edit>
    <project-create v-if="mode === 'create'" :setMode="setMode"></project-create>
  </div>
</template>

<script setup lang="ts">
import ProjectView from "./ProjectView.vue";
import ProjectEdit from "./ProjectEdit.vue";
import ProjectCreate from "./ProjectCreate.vue";
import {IProjectProps} from "../../../../../../models/projectModels.ts";
import SocketEmit from "../../../../../../api/socketEmit.ts";
import {onMounted, onUnmounted, watch} from "vue";
import {useStore} from "vuex";
import {useRoute} from "vue-router";

const route = useRoute();
const {mode, setMode} = defineProps<IProjectProps>();
const store = useStore();
const projectState = store.state.projectModule;

const joinRoom = (projectId: number) => {
  SocketEmit.joinRoom({type: 'project', id: projectId});
}
const leaveRoom = (projectId: number) => {
  SocketEmit.leaveRoom({type: 'project', id: projectId});
  store.commit('projectModule/setProjectRoom', [])
}

onMounted(() => {
  joinRoom(projectState.currentProject.projectId)
})
onUnmounted(() => {
  if (projectState.currentProject.projectId) {
    leaveRoom(projectState.currentProject.projectId)
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