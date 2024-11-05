<template>
  <div class="item-content">
    <div class="field-block">
      <label></label>
      <m-input placeholder="Название" class="title" v-model.trim="form.name"></m-input>
    </div>
    <m-error-message :errors="errors?.name"/>
    <div class="field-block">
      <label>Описание</label>
      <m-textarea rows="10" v-model="form.description"></m-textarea>
    </div>
    <div class="field-block">
      <label>Владелец</label>
      <m-selected-input :select-user="form.owner" :set-select-user="setSelectUser"></m-selected-input>
    </div>
    <m-error-message :errors="errors?.owner?.userId"/>
    <div class="buttons">
      <m-button @click="handleCancel" type="danger">Отменить</m-button>
      <m-button @click="handleSubmit" type="success"> Сохранить</m-button>
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
import {IProjectProps} from "../../../../../../models/projectModels.ts";
import MTextarea from "../../../../../ui/MTextarea.vue";
import SocketEmit from "../../../../../../api/socketEmit.ts";
import MErrorMessage from "../../../../../ui/MErrorMessage.vue";

const {setMode} = defineProps<Pick<IProjectProps, 'setMode'>>()

const form = ref({
  name: '',
  description: '',
  owner: {
    userId: 0,
    name: ''
  }
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
    SocketEmit.createProjectEmit({
      name: form.value.name,
      description: form.value.description,
      owner: form.value.owner.userId,
    })
    setMode('view', false)
  }
  isTrySubmit.value = true;
}

const handleCancel = () => {
  setMode('view', false)
}

const setSelectUser = (selectUser: Omit<IUser, 'email'>) => {
  form.value.owner.userId = selectUser.userId
  form.value.owner.name = selectUser.name
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