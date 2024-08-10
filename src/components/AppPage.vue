<template>
  <div class="main">
    <Header class="header"/>
    <Navbar class="nav"/>
    <router-view class="body"></router-view>
  </div>
</template>

<script setup lang="ts">
import Header from "./header/Header.vue";
import Navbar from "./navbar/Navbar.vue";
import {watchEffect} from "vue";
import {useStore} from "vuex";
import router from "../router/router.ts";

const store = useStore().state.userModule;

watchEffect(() => {
  if (!store.isAuth) {
    router.push('/authorization')
  }
})

</script>

<style scoped>
.main {
  display: grid;
  height: 100lvh;
  grid-template-columns: 200px auto;
  grid-template-rows: 50px auto;
}
.header {
  background-color: var(--primary-700);
  grid-column: 1/3;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 10px;
}
.nav {
  background-color: var(--neutral-300);
  border-right: 1px solid var(--neutral-400);
  display: flex;
  justify-content: center;
}
.body {
  background-color: var(--neutral-300);
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}
</style>