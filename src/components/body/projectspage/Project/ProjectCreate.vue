<template>
  <div class="itemContent">
    <div class="fieldBlock">
      <label></label>
      <m-input placeholder="Тема" class="title" v-model.trim="localProject.name"></m-input>
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
      <m-button @click="setMode('view')" type="danger">Отменить</m-button>
      <m-button @click="handleCreateProject" type="success"> Сохранить</m-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import MInput from "../../../ui/MInput.vue";
import MButton from "../../../ui/MButton.vue";
import {ref} from "vue";
import MSelectedInput from "../../../ui/MSelectedInputUser.vue";
import {IUser} from "../../../../models/UserModels.ts";
import {useStore} from "vuex";
import {useRouter} from "vue-router";
import {IProjectProps} from "../../../../models/ProjectModels.ts";
import MTextarea from "../../../ui/MTextarea.vue";
//TODO: сделать через библиотеку форм (валидация формы)
const store = useStore();
const router = useRouter();

const localProject = ref({
  name: '',
  description: '',
  owner: {
    user_id: 0,
    name: ''
  }
})

const handleCreateProject = async () => {
  const createProject = await store.dispatch('projectModule/createProjectAC', {
    name: localProject.value.name,
    description: localProject.value.description,
    ownerId: localProject.value.owner.user_id,
  });
  router.push(`/projects?id=${createProject.project_id}`)
  setMode('view')
}

const setSelectUser = (selectUser: Omit<IUser, 'email'>) => {
  localProject.value.owner.user_id = selectUser.user_id
  localProject.value.owner.name = selectUser.name
}

const {setMode} = defineProps<Pick<IProjectProps, 'setMode'>>()
</script>

<style scoped>
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

  div {
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
  font-size: 20px;
}

.buttons {
  display: flex;
  gap: 5px;
  justify-content: right;
  margin: 1rem;
}
</style>