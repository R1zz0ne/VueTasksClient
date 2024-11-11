<template>
  <form class="form-create-task">
    <span class="title">Создание задачи</span>
    <div class="field-block">
      <label>Название</label>
      <MInput v-model="form.name"/>
    </div>
    <MErrorMessage :errors="errors?.name"/>
    <div class="field-block">
      <label>Описание</label>
      <MInput v-model="form.description"/>
    </div>
    <MErrorMessage :errors="errors?.description"/>
    <div class="field-block">
      <label>Приоритет</label>
      <MSelect v-model="form.priority" :elements="taskPriorityMap" type="string"/>
    </div>
    <MErrorMessage :errors="errors?.priority"/>
    <div class="field-block">
      <label>Желаемый срок</label>
      <VueDatePicker
          class="date-picker"
          v-model="form.completionDate"
          :flow="['calendar', 'time']"
          locale="ru"
          :format="datePickerFormat"
      ></VueDatePicker>
    </div>
    <MErrorMessage :errors="errors?.completionDate"/>
    <div class="field-block">
      <label>Исполнитель</label>
      <MSelectedInput :set-select-user="setSelectUser" :select-user="form.member"/>
    </div>
    <MErrorMessage :errors="errors?.member?.userId"/>
    <div class="btn-block">
      <MButton @click.prevent="handleCancel" type="danger">Отмена</MButton>
      <MButton @click.prevent="handleSubmit" type="success">Создать</MButton>
    </div>
  </form>
</template>

<script setup lang="ts">
import MInput from "../../../../../ui/MInput.vue";
import MButton from "../../../../../ui/MButton.vue";
import * as z from "zod"
import {ref, watchEffect} from "vue";
import MSelectedInput from "../../../../../ui/MSelectedInputUser.vue";
import {IUser} from "../../../../../../models/userModels.ts";
import MSelect from "../../../../../ui/MSelect.vue";
import MErrorMessage from "../../../../../ui/MErrorMessage.vue";
import {datePickerFormat, taskPriorityMap} from "../../../../../../utils/constants.ts";
import SocketEmit from "../../../../../../api/socketEmit.ts";
import {ICreateTaskForm} from "../../../../../../models/taskModels.ts";

const setSelectUser = (selectUser: Omit<IUser, 'email'>): void => {
  form.value.member.userId = selectUser.userId
  form.value.member.name = selectUser.name
}

const form = ref<ICreateTaskForm>({
  name: "",
  description: "",
  priority: "",
  completionDate: "",
  member: {
    userId: 0,
    name: ""
  }
})
const isTrySubmit = ref<boolean>(false);

const formSchema = z.object({
  name: z.string()
      .min(5, "Название должно содержать не менее 5 символов")
      .max(150, "Название должно содержать не более 150 символов"),
  description: z.string().min(1, "Описание обязательно для заполнения"),
  priority: z.string().min(1, "Приоритет обязателен для заполнения"),
  completionDate: z.date({invalid_type_error: "Желаемый срок обязателен для заполнения"}),
  member: z.object({
    userId: z.number().positive("Исполнитель не может быть пустым")
  })
})

type formSchemaType = z.infer<typeof formSchema>
const errors = ref<z.ZodFormattedError<formSchemaType> | null>(null)

const handleSubmit = async () => {
  const validSchema: z.SafeParseReturnType<formSchemaType, formSchemaType> = formSchema.safeParse(form.value);
  if (!validSchema.success) {
    errors.value = validSchema.error.format()
  } else {
    errors.value = null;
    SocketEmit.createTaskEmit({
      name: form.value.name,
      description: form.value.description,
      priority: form.value.priority,
      completionDate: form.value.completionDate,
      projectId: projectId,
      member: form.value.member.userId
    })
    setDialogVisible(false);
  }
  isTrySubmit.value = true;
}
const {setDialogVisible, projectId} = defineProps<{ setDialogVisible: Function, projectId: number }>();
const handleCancel = (): void => {
  setDialogVisible(false);
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
  margin-top: 1rem;
  margin-right: 1rem;
  margin-left: 1rem;
  display: flex;
  gap: 5px;
  align-items: center;

  label {
    width: 140px;
    text-align: right;
    color: var(--neutral-600);
  }

  input {
    width: calc(100% - 145px);
  }

  select {
    width: calc(100% - 145px);
  }
}

.title {
  font-size: 20px;
  font-weight: bold;
}

.form-create-task {
  text-align: center;
  width: 700px;
  margin-top: 1rem;
  margin-bottom: 1rem;
}

.date-picker {
  --dp-input-padding: 0px 30px 0px 12px; /*Padding in the input*/
  --dp-border-radius: 10px;
  --dp-font-size: 0.85rem;
  --dp-border-color: var(--neutral-500);
  --dp-background-color: var(--neutral-100);
  --dp-border-color-hover: var(--neutral-500);
  width: calc(100% - 145px);
}

.btn-block {
  display: flex;
  margin-top: 1rem;
  margin-left: 1rem;
  margin-right: 1rem;
  justify-content: right;
  gap: 0.5rem;
}
</style>