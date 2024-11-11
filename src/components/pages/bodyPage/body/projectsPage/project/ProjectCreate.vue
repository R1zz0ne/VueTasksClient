<template>
  <div class="item-content">
    <div class="field-block">
      <label></label>
      <MInput placeholder="Название" class="title" v-model.trim="form.name"></MInput>
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
      <MButton @click="handleSubmit" type="success"> Сохранить</MButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import MInput from "../../../../../ui/MInput.vue";
import MButton from "../../../../../ui/MButton.vue";
import * as z from "zod";
import {ref, watchEffect} from "vue";
import MSelectedInput from "../../../../../ui/MSelectedInputUser.vue";
import {IUser} from "../../../../../../models/userModels.ts";
import {ICreateProjectForm, IProjectProps} from "../../../../../../models/projectModels.ts";
import MTextarea from "../../../../../ui/MTextarea.vue";
import SocketEmit from "../../../../../../api/socketEmit.ts";
import MErrorMessage from "../../../../../ui/MErrorMessage.vue";

const {setMode} = defineProps<Pick<IProjectProps, 'setMode'>>()

const form = ref<ICreateProjectForm>({
  name: '',
  description: '',
  owner: {
    userId: 0,
    name: ''
  }
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
    SocketEmit.createProjectEmit({
      name: form.value.name,
      description: form.value.description,
      owner: form.value.owner.userId,
    })
    setMode('view', false)
  }
  isTrySubmit.value = true;
}

const handleCancel = (): void => {
  setMode('view', false)
}

const setSelectUser = (selectUser: Omit<IUser, 'email'>): void => {
  form.value.owner.userId = selectUser.userId
  form.value.owner.name = selectUser.name
}

watchEffect((): void => {
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
}

.title {
  font-size: 20px;
}

.buttons {
  display: flex;
  gap: 5px;
  justify-content: right;
  margin: 1rem 1rem 0 1rem;
}
</style>