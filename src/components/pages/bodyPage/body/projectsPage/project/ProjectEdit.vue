<template>
  <div class="item-content">
    <span class="title">Редактирование проекта # {{ projectStoreCurrentProject.projectId }}</span>
    <div class="field-block">
      <label>Название</label>
      <m-input placeholder="Тема" v-model="form.name"></m-input>
    </div>
    <m-error-message :errors="errors?.name" />
    <div class="field-block">
      <label>Описание</label>
      <m-textarea rows="10" v-model="form.description"></m-textarea>
    </div>
    <div class="field-block">
      <label>Владелец</label>
      <m-selected-input :select-user="form.owner" :set-select-user="setSelectUser"></m-selected-input>
    </div>
    <m-error-message :errors="errors?.owner?.userId" />
    <div class="buttons">
      <m-button @click="handleCancel" type="danger">Отменить</m-button>
      <m-button @click="handleSubmit" type="success">Сохранить</m-button>
    </div>
    <record-footer :editor="projectState.currentProject.editor" :viewers="projectState.projectRoom"/>
  </div>
</template>

<script setup lang="ts">
import MInput from "../../../../../ui/MInput.vue";
import MButton from "../../../../../ui/MButton.vue";
import MSelectedInput from "../../../../../ui/MSelectedInputUser.vue";
import * as z from "zod";
import {ref, watchEffect} from "vue";
import {IUser} from "../../../../../../models/userModels.ts";
import {useStore} from "vuex";
import MTextarea from "../../../../../ui/MTextarea.vue";
import {IProjectProps} from "../../../../../../models/projectModels.ts";
import RecordFooter from "../../RecordFooter.vue";
import SocketEmit from "../../../../../../api/socketEmit.ts";
import MErrorMessage from "../../../../../ui/MErrorMessage.vue";

const store = useStore();
const {setMode} = defineProps<Omit<IProjectProps, 'mode'>>()
const setSelectUser = (selectUser: Omit<IUser, 'email'>) => {
  form.value.owner.userId = selectUser.userId
  form.value.owner.name = selectUser.name
}

const projectState = store.state.projectModule;
const projectStoreCurrentProject = projectState.currentProject;

const form = ref({
  name: projectStoreCurrentProject.name,
  description: projectStoreCurrentProject.description,
  owner: {
    userId: projectStoreCurrentProject.owner.userId,
    name: projectStoreCurrentProject.owner.name
  },
  tasks: projectStoreCurrentProject.tasks
})
const isTrySubmit = ref(false);

const formSchema = z.object({
  name: z.string()
      .min(5, "Название должно содержать не менее 5 символов")
      .max(150, "Название должно содержать не более 150 символов"),
  owner: z.object({
    userId: z.number().positive("Владелец не может быть пустым")
  })
})

type formSchemaType = z.infer<typeof formSchema>
const errors = ref<z.ZodFormattedError<formSchemaType> | null>(null)

const handleSubmit = async () => {
  const validSchema = formSchema.safeParse(form.value);
  if (!validSchema.success) {
    errors.value = validSchema.error.format()
  } else {
    errors.value = null;
    SocketEmit.updateProjectEmit({
      projectId: projectStoreCurrentProject.projectId,
      name: form.value.name,
      description: form.value.description,
      owner: form.value.owner.userId
    })
    setMode('view', true);
  }
  isTrySubmit.value = true;
}

const handleCancel = () => {
  setMode('view', true)
}

watchEffect(() => {
  if (isTrySubmit.value) {
    const validSchema = formSchema.safeParse(form.value);
    if (!validSchema.success) {
      errors.value = validSchema.error.format()
    } else {
      errors.value = null;
    }
  }
})
</script>

<style scoped>
.buttons {
  display: flex;
  gap: 5px;
  justify-content: right;
  margin: 1rem 1rem 0 1rem;
}

.field-block {
  position: relative;
  margin: 1rem 1rem 0 1rem;
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

.item-content {
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
</style>