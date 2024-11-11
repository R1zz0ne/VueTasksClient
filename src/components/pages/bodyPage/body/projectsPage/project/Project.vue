<template>
  <div class="content">
    <ProjectView v-if="mode === 'view' && $route.params.id && projectState.currentProject.projectId"
                 :set-mode="setMode"></ProjectView>
    <ProjectEdit v-if="mode === 'edit' && $route.params.id && projectState.currentProject.projectId"
                 :set-mode="setMode"></ProjectEdit>
    <ProjectCreate v-if="mode === 'create'" :setMode="setMode"></ProjectCreate>
  </div>
</template>

<script setup lang="ts">
import ProjectView from "./ProjectView.vue";
import ProjectEdit from "./ProjectEdit.vue";
import ProjectCreate from "./ProjectCreate.vue";
import {IProjectModuleState, IProjectProps} from "../../../../../../models/projectModels.ts";
import SocketEmit from "../../../../../../api/socketEmit.ts";
import {onMounted, onUnmounted, watch} from "vue";
import {Store, useStore} from "vuex";
import {RouteLocationNormalizedLoaded, useRoute} from "vue-router";
import {key, State} from "../../../../../../store/store.ts";

const route: RouteLocationNormalizedLoaded = useRoute();
const {mode, setMode} = defineProps<IProjectProps>();
const store: Store<State> = useStore(key);
const projectState: IProjectModuleState = store.state.projectModule;

const joinRoom = (projectId: number): void => {
  SocketEmit.joinRoom({type: 'project', id: projectId});
}
const leaveRoom = (projectId: number): void => {
  SocketEmit.leaveRoom({type: 'project', id: projectId});
  store.commit('projectModule/setProjectRoom', [])
}

onMounted((): void => {
  joinRoom(projectState.currentProject.projectId)
})
onUnmounted((): void => {
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