<template>
  <div class="auth-block">
    <form class="auth" @submit.prevent>
      <span class="title">Регистрация</span>
      <MInput placeholder="Имя" v-model="data.name"></MInput>
      <MInput placeholder="Почта" v-model="data.email"></MInput>
      <div class="btn-pass">
        <MInput placeholder="Пароль" v-model="data.password" :type="inputType"></MInput>
        <EyeSVG v-if="inputType === 'password'" @click="setInputType('text')"/>
        <EyeOffSVG v-else @click="setInputType('password')"/>
      </div>
      <MButton @click="onSubmitReg()">Зарегистрироваться</MButton>
    </form>
  </div>
</template>

<script setup lang="ts">
import MInput from "../../ui/MInput.vue";
import MButton from "../../ui/MButton.vue";
import {reactive, ref, watchEffect} from "vue";
import {IRegForm} from "../../../models/userModels.ts";
import {Store, useStore} from "vuex";
import router from "../../../router/router.ts";
import EyeOffSVG from "../../ui/svg/EyeOffSVG.vue";
import EyeSVG from "../../ui/svg/EyeSVG.vue";
import {key, State} from "../../../store/store.ts";
import {IInputType} from "../../../models/otherModels.ts";

const data = reactive<IRegForm>({name: '', email: '', password: ''})
const store: Store<State> = useStore(key);
const inputType = ref<IInputType>('password');

const setInputType = (type: IInputType): void => {
  inputType.value = type;
}

const onSubmitReg = (): void => {
  store.dispatch('userModule/registration', data)
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
  margin-top: 0.5rem;
  width: 100%;
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
  }
}
</style>