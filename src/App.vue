<script setup lang="ts">
import {onMounted} from "vue";
import {IAuthResponse} from "./models/UserModels.ts";
import ApiAuth from "./api/apiAuth.ts";
import {AxiosResponse} from "axios";
import {setAuthData} from "./services/setAuthData.ts";
import {setError} from "./services/setError.ts";

onMounted(async () => {
  if (localStorage.getItem('token')) {
    try {
      const response: AxiosResponse<IAuthResponse> = await ApiAuth.refresh(); //TODO: лучше наверно через actions стора делать
      setAuthData(response, true);
    } catch (e: any) {
      setError(e.response.data) //TODO: Доработать журнал ошибок
    }
  }
})
</script>

<template>
  <router-view></router-view>
</template>

<style scoped>
</style>
