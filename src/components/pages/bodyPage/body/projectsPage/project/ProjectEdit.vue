<template>
  <div class="item-content">
    <span class="title">Редактирование проекта # {{ projectStoreCurrentProject.projectId }}</span>
    <div class="field-block">
      <label>Название</label>
      <MInput placeholder="Тема" v-model="form.name"></MInput>
    </div>
    <MErrorMessage :errors="errors?.name"/>
    <div class="field-block">
      <label>Описание</label>
      <MTextarea rows="10" v-model="form.description"></MTextarea>
    </div>
    <div class="field-block">
      <label>Владелец</label>
      <MSelectedInput :select-user="form.owner" :set-select-user="setSelectUser"></MSelectedInput>
    </div>
    <MErrorMessage :errors="errors?.owner?.userId"/>
    <div class="buttons">
      <MButton @click="handleCancel" type="danger">Отменить</MButton>
      <MButton @click="handleSubmit" type="success">Сохранить</MButton>
    </div>
    <RecordFooter :editor="projectState.currentProject.editor" :viewers="projectState.projectRoom"/>
  </div>
</template>

<script setup lang="ts">
import MInput from "../../../../../ui/MInput.vue";
import MButton from "../../../../../ui/MButton.vue";
import MSelectedInput from "../../../../../ui/MSelectedInputUser.vue";
import * as z from "zod";
import {ref, watchEffect} from "vue";
import {IUser} from "../../../../../../models/userModels.ts";
import {Store, useStore} from "vuex";
import MTextarea from "../../../../../ui/MTextarea.vue";
import {
  IProject,
  IProjectModuleState,
  IProjectProps,
  IUpdateProjectForm
} from "../../../../../../models/projectModels.ts";
import RecordFooter from "../../RecordFooter.vue";
import SocketEmit from "../../../../../../api/socketEmit.ts";
import MErrorMessage from "../../../../../ui/MErrorMessage.vue";
import {key, State} from "../../../../../../store/store.ts";

const store: Store<State> = useStore(key);
const {setMode} = defineProps<Omit<IProjectProps, 'mode'>>()
const setSelectUser = (selectUser: Omit<IUser, 'email'>): void => {
  form.value.owner.userId = selectUser.userId
  form.value.owner.name = selectUser.name
}

const projectState: IProjectModuleState = store.state.projectModule;
const projectStoreCurrentProject: IProject = projectState.currentProject;

const form = ref<IUpdateProjectForm>({
  name: projectStoreCurrentProject.name,
  description: projectStoreCurrentProject.description,
  owner: {
    userId: projectStoreCurrentProject.owner.userId,
    name: projectStoreCurrentProject.owner.name
  },
  tasks: projectStoreCurrentProject.tasks
})
const isTrySubmit = ref<boolean>(false);

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

const handleSubmit = async (): Promise<void> => {
  const validSchema: z.SafeParseReturnType<formSchemaType, formSchemaType> = formSchema.safeParse(form.value);
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

const handleCancel = (): void => {
  setMode('view', true)
}

watchEffect(() => {
  if (isTrySubmit.value) {
    const validSchema: z.SafeParseReturnType<formSchemaType, formSchemaType> = formSchema.safeParse(form.value);
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