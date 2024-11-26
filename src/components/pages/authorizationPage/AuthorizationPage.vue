<template>
  <div class="auth-block">
    <form class="auth" @submit.prevent>
      <span class="title">Авторизация</span>
      <MInput placeholder="Почта" v-model.trim="form.email"/>
      <MErrorMessage :errors="errors?.email"/>
      <div class="btn-pass">
        <MInput placeholder="Пароль" v-model="form.password" :type="inputType"/>
        <EyeSVG v-if="inputType === 'password'" @click="setInputType('text')"/>
        <EyeOffSVG v-else @click="setInputType('password')"/>
      </div>
      <MErrorMessage :errors="errors?.password"/>
      <MButton @click="onSubmitAuth()">Авторизоваться</MButton>
      <div class="reg-block">
        <MButton @click="$router.push('/registration')">Регистрация</MButton>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import MInput from "../../ui/MInput.vue";
import MButton from "../../ui/MButton.vue";
import {ref, watchEffect} from "vue";
import {IAuthForm} from "../../../models/userModels.ts";
import router from "../../../router/router.ts";
import {Store, useStore} from "vuex";
import EyeSVG from "../../ui/svg/EyeSVG.vue";
import EyeOffSVG from "../../ui/svg/EyeOffSVG.vue";
import {key, State} from "../../../store/store.ts";
import {IInputType} from "../../../models/otherModels.ts";
import * as z from "zod";
import MErrorMessage from "../../ui/MErrorMessage.vue";

const store: Store<State> = useStore(key);
const inputType = ref<IInputType>('password');
const isTrySubmit = ref<boolean>(false);

const form = ref<IAuthForm>({
  email: '',
  password: '',
})

const formSchema = z.object({
  email: z.string()
      .email("Не верный формат почты"),
  password: z.string().min(1, "Пароль не может быть пустым")
})

type formSchemaType = z.infer<typeof formSchema>;
const errors = ref<z.ZodFormattedError<formSchemaType> | null>(null);

const setInputType = (type: IInputType): void => {
  inputType.value = type;
}

const onSubmitAuth = (): void => {
  const validSchema: z.SafeParseReturnType<formSchemaType, formSchemaType> = formSchema.safeParse(form.value);
  if (!validSchema.success) {
    errors.value = validSchema.error.format()
  } else {
    errors.value = null;
    store.dispatch('userModule/login', form.value)
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
  flex-direction: column;
  gap: 5px;
  height: 100lvh;
  align-items: center;
  justify-content: center;
  background-color: var(--neutral-200);
}

.auth {
  display: flex;
  flex-direction: column;
  gap: 5px;
  background-color: var(--neutral-400);
  padding: 1rem;
  border-radius: 10px;
  align-items: center;
}

button {
  width: 100%;
  margin-top: 0.5rem;
}

.reg-block {
  width: 100%;
  margin-top: 0.5rem;
  border-top: 1px solid var(--neutral-500);
}

.title {
  font-size: 24px;
  margin-bottom: 1rem;
}

.btn-pass {
  position: relative;

  svg {
    position: absolute;
    right: 2px;
    top: 3px;
    cursor: pointer;
  }
}
</style>