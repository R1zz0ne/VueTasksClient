<template>
  <div>
    <div class="nav-block">
      <div class="search">
        <m-input v-model="searchInput" style="height: 28px" placeholder="Поиск..."></m-input>
        <m-button @click="setMode('create', true)">+</m-button>
      </div>
      <list-items path="projects"
                  :search-string="searchInput"
                  v-if="projectState.projectList.length > 0"
      ></list-items>
      <div v-else class="list-items"></div>
      <div class="pag">Кол-во записей: {{ projectState.pageInfo.totalRecords }}</div>
    </div>
    <div class="content-container">
      <project :mode="mode" :set-mode="setMode"></project>
    </div>
  </div>
</template>

<script setup lang="ts">
import ListItems from "./listItems/ListItems.vue";
import {ref} from "vue";
import Project from "./project/Project.vue";
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
      projectId: projectState.currentProject.projectId,
      editor: state.userModule.user.userId
    })
  }
  if (mode.value === 'edit' && value !== 'edit' && updateEditor) {
    SocketEmit.updateProjectEditor({
      projectId: projectState.currentProject.projectId,
      editor: null
    })
  }
  mode.value = value;
}
</script>

<style scoped>
.nav-block {
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

.content-container {
  width: 100%;
  height: 100%;
  text-align: center;
  padding: 5px;
}

.list-items {
  flex-grow: 1;
}
</style>