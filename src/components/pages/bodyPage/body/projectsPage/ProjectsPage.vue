<template>
  <div>
    <div class="nav-block">
      <div class="search">
        <MInput v-model="searchInput" style="height: 28px" placeholder="Поиск..."></MInput>
        <MButton @click="setMode('create', true)">+</MButton>
      </div>
      <ListItems path="projects"
                 :search-string="searchInput"
                 v-if="projectState.projectList.length > 0"
      ></ListItems>
      <div v-else class="list-items"></div>
      <div class="pag">Кол-во записей: {{ projectState.pageInfo.totalRecords }}</div>
    </div>
    <div class="content-container">
      <Project :mode="mode" :set-mode="setMode"></Project>
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
import {key, State} from "../../../../../store/store.ts";
import {IProjectModuleState, IProjectVisibleMode} from "../../../../../models/projectModels.ts";

const mode = ref<IProjectVisibleMode>("view");
const searchInput = ref<string>("");
const state: State = useStore(key).state;
const projectState: IProjectModuleState = state.projectModule;

const setMode = (value: IProjectVisibleMode, updateEditor: boolean): void => {
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