<template>
  <div class="auth_block">
    <form class="auth" @submit.prevent>
      <span class="title">Регистрация</span>
      <m-input placeholder="Имя" v-model="data.name"></m-input>
      <m-input placeholder="Почта" v-model="data.email"></m-input>
      <m-input placeholder="Пароль" v-model="data.password"></m-input>
      <m-button @click="onSubmitReg()">Зарегистрироваться</m-button>
    </form>
  </div>
</template>

<script setup lang="ts">
import MInput from "../../ui/MInput.vue";
import MButton from "../../ui/MButton.vue";
import {reactive, watchEffect} from "vue";
import {IAuthResponse, IRegForm} from "../../../models/UserModels.ts";
import {useStore} from "vuex";
import {AxiosResponse} from "axios"
import ApiAuth from "../../../api/apiAuth.ts";
import router from "../../../router/router.ts";
import {setAuthData} from "../../../services/setAuthData.ts";
import {setError} from "../../../services/setError.ts";

const data = reactive<IRegForm>({name: '', email: '', password: ''})
const store = useStore();

const onSubmitReg = async () => {
  try {
    const response: AxiosResponse<IAuthResponse> = await ApiAuth.registration(data.name, data.email, data.password);
    setAuthData(response, true);
  } catch (e: any) {
    setError(e.response.data) //TODO: Доработать журнал ошибок
  }
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
</style>