<template>
  <div class="auth_block">
    <form class="auth" @submit.prevent>
      <span class="title">Авторизация</span>
      <m-input placeholder="Почта" v-model.trim="data.email"/>
      <div class="btn_pass">
        <m-input placeholder="Пароль" v-model="data.password" :type="inputType"/>
        <EyeSVG v-if="inputType === 'password'" @click="setInputType('text')"/>
        <EyeOffSVG v-else @click="setInputType('password')"/>
      </div>
      <m-button @click="onSubmitAuth()">Авторизоваться</m-button>
      <div class="regBlock">
        <m-button @click="$router.push('/registration')">Регистрация</m-button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import MInput from "../../ui/MInput.vue";
import MButton from "../../ui/MButton.vue";
import {reactive, ref, watchEffect} from "vue";
import {IAuthForm} from "../../../models/UserModels.ts";
import router from "../../../router/router.ts";
import {useStore} from "vuex";
import EyeSVG from "../../ui/svg/EyeSVG.vue";
import EyeOffSVG from "../../ui/svg/EyeOffSVG.vue";

const store = useStore();
const data = reactive<IAuthForm>({email: '', password: ''})
const inputType = ref<"password" | "text">('password');

const setInputType = (type: "password" | "text") => {
  inputType.value = type;
}

const onSubmitAuth = () => {
  store.dispatch('userModule/login', data)
}
watchEffect(() => {
  if (store.state.userModule.isAuth) {
    router.push('/')
  }
})
</script>

<style scoped>
.auth_block {
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

.regBlock {
  width: 100%;
  margin-top: 0.5rem;
  border-top: 1px solid var(--neutral-500);
}

.title {
  font-size: 24px;
  margin-bottom: 1rem;
}

.btn_pass {
  position: relative;

  svg {
    position: absolute;
    right: 2px;
    top: 3px;
    cursor: pointer;
  }
}
</style>