<template>
  <div class="auth-block">
    <form class="auth" @submit.prevent>
      <span class="title">Регистрация</span>
      <MInput placeholder="Имя" v-model="form.name"></MInput>
      <MErrorMessage :errors="errors?.name"/>
      <MInput placeholder="Почта" v-model="form.email"></MInput>
      <MErrorMessage :errors="errors?.email"/>
      <div class="btn-pass">
        <MInput placeholder="Пароль" v-model="form.password" :type="inputType"></MInput>
        <EyeSVG v-if="inputType === 'password'" @click="setInputType('text')"/>
        <EyeOffSVG v-else @click="setInputType('password')"/>
        <MErrorMessage :errors="errors?.password"/>
      </div>
      <MButton @click="onSubmitReg()">Зарегистрироваться</MButton>
    </form>
  </div>
</template>

<script setup lang="ts">
import MInput from "../../ui/MInput.vue";
import MButton from "../../ui/MButton.vue";
import {ref, watchEffect} from "vue";
import {IRegForm} from "../../../models/userModels.ts";
import {Store, useStore} from "vuex";
import router from "../../../router/router.ts";
import EyeOffSVG from "../../ui/svg/EyeOffSVG.vue";
import EyeSVG from "../../ui/svg/EyeSVG.vue";
import {key, State} from "../../../store/store.ts";
import {IInputType} from "../../../models/otherModels.ts";
import * as z from "zod";
import MErrorMessage from "../../ui/MErrorMessage.vue";

// const data = reactive<IRegForm>({name: '', email: '', password: ''})
const store: Store<State> = useStore(key);
const inputType = ref<IInputType>('password');

const form = ref<IRegForm>({
  name: '',
  email: '',
  password: ''
})
const isTrySubmit = ref<boolean>(false);
const formSchema = z.object({
  name: z.string().min(5, "Имя должно содержать больше 5 символов"),
  email: z.string().email("Не верный формат почты"),
  password: z.string().min(5, "Пароль должен содержать более 5 символов")
})
type formSchemaType = z.infer<typeof formSchema>
const errors = ref<z.ZodFormattedError<formSchemaType> | null>(null)

const setInputType = (type: IInputType): void => {
  inputType.value = type;
}

const onSubmitReg = (): void => {
  const validSchema: z.SafeParseReturnType<formSchemaType, formSchemaType> = formSchema.safeParse(form.value);
  if (!validSchema.success) {
    errors.value = validSchema.error.format()
  } else {
    errors.value = null;
    store.dispatch('userModule/registration', form.value)
  }
  isTrySubmit.value = true;
}

watchEffect((): void => {
  if (store.state.userModule.isAuth) {
    router.push('/')
  }
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
.auth-block {
  display: flex;
  height: 100lvh;
  align-items: center;
  justify-content: center;
  background-color: var(--neutral-200);
}

.auth {
  display: flex;
  flex-direction: column;
  width: 340px;
  gap: 5px;
  background-color: var(--neutral-400);
  padding: 1rem;
  border-radius: 10px;
  align-items: center;
}

input {
  width: 100%;
}

button {
  margin-top: 0.5rem;
  width: 100%;
}

.title {
  font-size: 24px;
  margin-bottom: 1rem;
}

.btn-pass {
  position: relative;
  width: 100%;

  svg {
    position: absolute;
    right: 2px;
    top: 3px;
  }
}
</style>