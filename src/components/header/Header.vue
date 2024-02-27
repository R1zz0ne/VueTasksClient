<template>
  <div>
    <m-button @click="logout">Выйти</m-button>
  </div>
</template>

<script setup lang="ts">
import MButton from "../ui/MButton.vue";
import {AxiosResponse} from "axios";
import ApiAuth from "../../api/apiAuth.ts";
import {setAuthData} from "../../services/setAuthData.ts";
import {setError} from "../../services/setError.ts";

const logout = async () => {
  try {
    const response: AxiosResponse<any> = await ApiAuth.logout();
    setAuthData(response, false);
  } catch (e: any) {
    setError(e.response.data); //TODO: Доработать журнал ошибок
  }

}
</script>

<style scoped>
</style>
