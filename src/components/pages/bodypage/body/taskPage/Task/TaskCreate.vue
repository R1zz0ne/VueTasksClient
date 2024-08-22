<template>
  <form class="formCreateTask">
    <span class="title">Создание задачи</span>
    <div class="fieldBlock">
      <label>Название</label>
      <m-input v-model="form.name"></m-input>
    </div>
    <m-error-message :errors="errors?.name"/>
    <div class="fieldBlock">
      <label>Описание</label>
      <m-input v-model="form.description"></m-input>
    </div>
    <m-error-message :errors="errors?.description"/>
    <div class="fieldBlock">
      <label>Приоритет</label>
      <m-select v-model="form.priority" :elements="taskPriorityMap" type="string"/>
    </div>
    <m-error-message :errors="errors?.priority"/>
    <div class="fieldBlock">
      <label>Желаемый срок</label>
      <vue-date-picker
          class="datePicker"
          v-model="form.complation_date"
          :flow="['calendar', 'time']"
          locale="ru"
          :format="datePickerFormat"
      ></vue-date-picker>
    </div>
    <m-error-message :errors="errors?.complation_date"/>
    <div class="fieldBlock">
      <label>Исполнитель</label>
      <m-selected-input :set-select-user="setSelectUser" :select-user="form.member"></m-selected-input>
    </div>
    <m-error-message :errors="errors?.member?.user_id"/>
    <div class="btnBlock">
      <m-button @click.prevent="handleCancel" type="danger">Отмена</m-button>
      <m-button @click.prevent="handleSubmit" type="success">Создать</m-button>
    </div>
  </form>
</template>

<script setup lang="ts">
import MInput from "../../../../../ui/MInput.vue";
import MButton from "../../../../../ui/MButton.vue";
import * as z from "zod";
import {ref, watchEffect} from "vue";
import MSelectedInput from "../../../../../ui/MSelectedInputUser.vue";
import {IUser} from "../../../../../../models/UserModels.ts";
import MSelect from "../../../../../ui/MSelect.vue";
import MErrorMessage from "../../../../../ui/MErrorMessage.vue";
import {datePickerFormat, taskPriorityMap} from "../../../../../../utils/constants.ts";
import SocketEmit from "../../../../../../api/socketEmit.ts";

const setSelectUser = (selectUser: Omit<IUser, 'email'>) => {
  form.value.member.user_id = selectUser.user_id
  form.value.member.name = selectUser.name
}

const form = ref({
  name: "",
  description: "",
  priority: "",
  complation_date: null,
  member: {
    user_id: 0,
    name: ""
  }
})
const isTrySubmit = ref(false);

const formSchema = z.object({
  name: z.string()
      .min(5, "Название должно содержать не менее 5 символов")
      .max(150, "Название должно содержать не более 150 символов"),
  description: z.string().min(1, "Описание обязательно для заполнения"),
  priority: z.string().min(1, "Приоритет обязателен для заполнения"),
  complation_date: z.date({invalid_type_error: "Желаемый срок обязателен для заполнения"}),
  member: z.object({
    user_id: z.number().positive("Исполнитель не может быть пустым")
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
    SocketEmit.createTaskEmit({
      name: form.value.name,
      description: form.value.description,
      priority: form.value.priority,
      complation_date: form.value.complation_date,
      project_id: projectId,
      member: form.value.member.user_id
    })
    setDialogVisible(false);
  }
  isTrySubmit.value = true;
}
const {setDialogVisible, projectId} = defineProps<{ setDialogVisible: Function, projectId: number }>();
const handleCancel = () => {
  setDialogVisible(false);
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

.fieldBlock {
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

.formCreateTask {
  text-align: center;
  width: 700px;
  margin-top: 1rem;
  margin-bottom: 1rem;
}

.datePicker {
  --dp-input-padding: 0px 30px 0px 12px; /*Padding in the input*/
  --dp-border-radius: 10px;
  --dp-font-size: 0.85rem;
  --dp-border-color: var(--neutral-500);
  --dp-background-color: var(--neutral-100);
  --dp-border-color-hover: var(--neutral-500);
  width: calc(100% - 145px);
}

.btnBlock {
  display: flex;
  margin-top: 1rem;
  margin-left: 1rem;
  margin-right: 1rem;
  justify-content: right;
  gap: 0.5rem;
}
</style>