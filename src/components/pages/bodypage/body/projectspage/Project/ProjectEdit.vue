<template>
  <div class="itemContent">
    <span class="title">Редактирование проекта # {{ projectStoreCurrentProject.project_id }}</span>
    <div class="fieldBlock">
      <label>Название</label>
      <m-input placeholder="Тема" v-model="localProject.name"></m-input>
    </div>
    <div class="fieldBlock">
      <label>Описание</label>
      <m-textarea rows="10" v-model="localProject.description"></m-textarea>
    </div>
    <div class="fieldBlock">
      <label>Владелец</label>
      <m-selected-input :select-user="localProject.owner" :set-select-user="setSelectUser"></m-selected-input>
    </div>
    <div class="buttons">
      <m-button @click="setMode('view', true)" type="danger">Отменить</m-button>
      <m-button @click="handleUpdate" type="success">Сохранить</m-button>
    </div>
    <record-footer :editor="projectState.currentProject.editor" :viewers="projectState.projectRoom"/>
  </div>
</template>

<script setup lang="ts">
import MInput from "../../../../../ui/MInput.vue";
import MButton from "../../../../../ui/MButton.vue";
import MSelectedInput from "../../../../../ui/MSelectedInputUser.vue";
import {ref} from "vue";
import {IUser} from "../../../../../../models/UserModels.ts";
import {useStore} from "vuex";
import MTextarea from "../../../../../ui/MTextarea.vue";
import {IProjectProps} from "../../../../../../models/ProjectModels.ts";
import RecordFooter from "../../RecordFooter.vue";
import SocketEmit from "../../../../../../api/socketEmit.ts";

const store = useStore();
const {setMode} = defineProps<Omit<IProjectProps, 'mode'>>()

const projectState = store.state.projectModule;
const projectStoreCurrentProject = projectState.currentProject;

const localProject = ref({
  name: projectStoreCurrentProject.name,
  description: projectStoreCurrentProject.description,
  owner: {
    user_id: projectStoreCurrentProject.owner.user_id,
    name: projectStoreCurrentProject.owner.name
  },
  tasks: projectStoreCurrentProject.tasks
})
const setSelectUser = (selectUser: Omit<IUser, 'email'>) => {
  localProject.value.owner.user_id = selectUser.user_id
  localProject.value.owner.name = selectUser.name
}

const handleUpdate = async () => {
  SocketEmit.updateProjectEmit({
    project_id: projectStoreCurrentProject.project_id,
    name: localProject.value.name,
    description: localProject.value.description,
    owner: localProject.value.owner.user_id
  })
  setMode('view', true);
}
</script>

<style scoped>
.buttons {
  display: flex;
  gap: 5px;
  justify-content: right;
  margin: 0 1rem 1rem 1rem;
}

.fieldBlock {
  position: relative;
  margin: 0 1rem 1rem 1rem;
  display: flex;
  gap: 5px;
  align-items: start;

  label {
    width: 140px;
    text-align: right;
    color: var(--neutral-600);
  }

  input {
    width: calc(100% - 145px);
  }

  div {
    width: calc(100% - 145px);
  }
}

.itemContent {
  width: 100%;
  height: 100%;
  text-align: center;
  padding: 5px;
  display: flex;
  flex-direction: column;
}


.title {
  font-size: 20px;
  font-weight: bold;
  margin: 1rem;
  display: inline-block;
}

.projectId {
  font-weight: bold;
}
</style>