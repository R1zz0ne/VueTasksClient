<template>
  <form class="form-edit-task">
    <span class="title">Редактирование задачи # {{ form.taskId }}</span>
    <div class="field-block">
      <label>Название</label>
      <MInput v-model="form.name"></MInput>
    </div>
    <MErrorMessage :errors="errors?.name"/>
    <div class="field-block">
      <label>Статус</label>
      <MSelect v-model="form.status" :elements="taskStatusMap" type="string"/>
    </div>
    <div class="field-block">
      <label>Описание</label>
      <MInput v-model="form.description"></MInput>
    </div>
    <MErrorMessage :errors="errors?.description"/>
    <div class="field-block">
      <label>Проект</label>
      <MInput v-model="form.project.name" readonly></MInput>
    </div>
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
      <MSelectedInput :set-select-user="setSelectUser" :select-user="form.member"></MSelectedInput>
    </div>
    <MErrorMessage :errors="errors?.member?.userId"/>
    <div class="btn-block">
      <MButton @click.prevent="handleCancel" type="danger">Отмена</MButton>
      <MButton @click.prevent="handleSubmit" type="success">Сохранить</MButton>
    </div>
    <RecordFooter :viewers="store.state.taskModule.taskRoom" :editor="store.state.taskModule.currentTask.editor"/>
  </form>
</template>

<script setup lang="ts">
import MInput from "../../../../../ui/MInput.vue";
import MButton from "../../../../../ui/MButton.vue";
import * as z from "zod";
import {ref, watchEffect} from "vue";
import MSelectedInput from "../../../../../ui/MSelectedInputUser.vue";
import {IUser} from "../../../../../../models/userModels.ts";
import MSelect from "../../../../../ui/MSelect.vue";
import MErrorMessage from "../../../../../ui/MErrorMessage.vue";
import {datePickerFormat, taskPriorityMap, taskStatusMap} from "../../../../../../utils/constants.ts";
import {Store, useStore} from "vuex";
import SocketEmit from "../../../../../../api/socketEmit.ts";
import RecordFooter from "../../RecordFooter.vue";
import {key, State} from "../../../../../../store/store.ts";
import {IUpdateTaskForm} from "../../../../../../models/taskModels.ts";
import VueDatePicker from "@vuepic/vue-datepicker"

const store: Store<State> = useStore(key);
const setSelectUser = (selectUser: Omit<IUser, 'email'>): void => {
  form.value.member.userId = selectUser.userId
  form.value.member.name = selectUser.name
}

const form = ref<IUpdateTaskForm>({
  taskId: store.state.taskModule.currentTask.taskId,
  name: store.state.taskModule.currentTask.name,
  description: store.state.taskModule.currentTask.description,
  priority: store.state.taskModule.currentTask.priority,
  completionDate: new Date(store.state.taskModule.currentTask.completionDate),
  project: {
    projectId: store.state.taskModule.currentTask.project.projectId,
    name: store.state.taskModule.currentTask.project.name
  },
  member: {
    userId: store.state.taskModule.currentTask.member.userId,
    name: store.state.taskModule.currentTask.member.name
  },
  status: store.state.taskModule.currentTask.status
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

const handleSubmit = async (): Promise<void> => {
  const validSchema: z.SafeParseReturnType<formSchemaType, formSchemaType> = formSchema.safeParse(form.value);
  if (!validSchema.success) {
    errors.value = validSchema.error.format()
  } else {
    errors.value = null;
    SocketEmit.updateTaskEmit({
      taskId: form.value.taskId,
      name: form.value.name,
      description: form.value.description,
      priority: form.value.priority,
      completionDate: form.value.completionDate,
      projectId: form.value.project.projectId,
      member: form.value.member.userId,
      status: form.value.status
    })
    setMode('view');
  }
  isTrySubmit.value = true;
}
const {setMode} = defineProps<{ setMode: Function }>();
const handleCancel = (): void => {
  setMode('view');
}

watchEffect((): void => {
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
  margin: 0 1rem 1rem 1rem;
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
  margin: 1rem;
  display: inline-block;
}

.form-edit-task {
  text-align: center;
  width: 700px;
  height: 100%;
  padding: 5px;
  display: flex;
  flex-direction: column;
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
  margin: 0 1rem 1rem 1rem;
  justify-content: right;
  gap: 0.5rem;
}
</style>