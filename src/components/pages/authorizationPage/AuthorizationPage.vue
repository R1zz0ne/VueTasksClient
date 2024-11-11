<template>
  <div class="auth-block">
    <form class="auth" @submit.prevent>
      <span class="title">Авторизация</span>
      <MInput placeholder="Почта" v-model.trim="data.email"/>
      <div class="btn-pass">
        <MInput placeholder="Пароль" v-model="data.password" :type="inputType"/>
        <EyeSVG v-if="inputType === 'password'" @click="setInputType('text')"/>
        <EyeOffSVG v-else @click="setInputType('password')"/>
      </div>
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
import {reactive, ref, watchEffect} from "vue";
import {IAuthForm} from "../../../models/userModels.ts";
import router from "../../../router/router.ts";
import {Store, useStore} from "vuex";
import EyeSVG from "../../ui/svg/EyeSVG.vue";
import EyeOffSVG from "../../ui/svg/EyeOffSVG.vue";
import {key, State} from "../../../store/store.ts";
import {IInputType} from "../../../models/otherModels.ts";

const store: Store<State> = useStore(key);
const data = reactive<IAuthForm>({email: '', password: ''})
const inputType = ref<IInputType>('password');

const setInputType = (type: IInputType) => {
  inputType.value = type;
}

const onSubmitAuth = (): void => {
  store.dispatch('userModule/login', data)
}
watchEffect((): void => {
  if (store.state.userModule.isAuth) {
    router.push('/')
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