<template>
  <div>
    <m-button @click="logout">Выйти</m-button>
  </div>
</template>

<script setup lang="ts">
import MButton from "../ui/MButton.vue";
import {useStore} from "vuex";

const store = useStore();

const logout = () => {
  store.dispatch('userModule/logout')
}
</script>

<style scoped>
</style>
