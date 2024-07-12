<template>
  <div class="itemContent">
    <div class="fieldBlock">
      <label class="title projectId"># {{projectStoreCurrentProject.project_id}}</label>
      <m-input placeholder="Тема" class="title" v-model="localProject.name"></m-input>
    </div>
    <div class="fieldBlock">
      <label>Описание</label>
      <m-input v-model="localProject.description"></m-input>
    </div>
    <div class="fieldBlock">
      <label>Владелец</label>
      <m-selected-input :select-user="localProject.owner" :set-select-user="setSelectUser"></m-selected-input>
    </div>
    <div class="buttons">
      <m-button @click="setMode('view')" type="danger">Отменить</m-button>
      <m-button @click="handleUpdate" type="success">Сохранить</m-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import MInput from "../../../ui/MInput.vue";
import MButton from "../../../ui/MButton.vue";
import {IProjectProps} from "./Project.vue";
import MSelectedInput from "../../../ui/MSelectedInputUser.vue";
import {ref} from "vue";
import {IUser} from "../../../../models/UserModels.ts";
import {useStore} from "vuex";

const store = useStore();
const {setMode} = defineProps<Omit<IProjectProps, 'mode'>>()

const projectStoreCurrentProject = store.state.projectModule.currentProject;
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
  try {
    const updateProject = await store.dispatch('projectModule/updateProjectAC', {
      project_id: projectStoreCurrentProject.project_id,
      name: localProject.value.name,
      description: localProject.value.description,
      ownerId: localProject.value.owner.user_id
    })
    setMode('view');
  } catch (e) {
    console.log('Произошла ошибка при обновлении проекта'); //TODO: тут try/catch конструкция скорее всего не нужна, т.к. она есть в диспатче. Сейчас просто чтобы лог выводить
  }
}
</script>

<style scoped>
.buttons {
  display: flex;
  gap: 5px;
  justify-content: right;
  margin: 1rem;
}

.fieldBlock {
  position: relative;
  margin: 1rem;
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
}

.itemContent {
  width: 100%;
  height: 100%;
  text-align: center;
  padding: 5px;
}

.title {
  font-size: 1.25rem;
}
.projectId {
  font-weight: bold;
}
</style>