<template>
  <div>
    <div class="navBlock">
      <div class="search">
        <m-input v-model="searchInput" style="height: 28px" placeholder="Поиск..."></m-input>
        <m-button @click="setMode('create', true)">+</m-button>
      </div>
      <list-items path="projects" :search-string="searchInput"></list-items>
      <div class="pag">TODO: paginations</div>
    </div>
    <div class="contentConteiner">
      <project v-if="$route.params.id && projectState.currentProject.project_id" :mode="mode"
               :set-mode="setMode"></project>
      <div v-else></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import ListItems from "./listitems/ListItems.vue";
import {ref} from "vue";
import Project from "./Project/Project.vue";
import MInput from "../../../../ui/MInput.vue";
import MButton from "../../../../ui/MButton.vue";
import {useStore} from "vuex";
import SocketEmit from "../../../../../api/socketEmit.ts";

const mode = ref("view");
const searchInput = ref("");
const state = useStore().state;
const projectState = state.projectModule;

const setMode = (value: 'view' | 'edit' | 'create', updateEditor: boolean) => {
  if (value === 'edit' && updateEditor) {
    SocketEmit.updateProjectEditor({
      project_id: projectState.currentProject.project_id,
      editor: state.userModule.user.user_id
    })
  }
  if (mode.value === 'edit' && value !== 'edit' && updateEditor) {
    SocketEmit.updateProjectEditor({
      project_id: projectState.currentProject.project_id,
      editor: null
    })
  }
  mode.value = value;
}
</script>

<style scoped>
.navBlock {
  min-width: 300px;
  border-right: 1px solid var(--neutral-600);
  display: flex;
  flex-direction: column;
  align-self: stretch;
}

.search {
  height: fit-content;
  padding: 5px;
  border-bottom: 1px solid var(--neutral-400);
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

.contentConteiner {
  width: 100%;
  height: 100%;
  text-align: center;
  padding: 5px;
}
</style>