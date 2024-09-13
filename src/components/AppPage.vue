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
import {useRouter} from "vue-router";
import SocketEmit from "../api/socketEmit.ts";

const store = useStore();
const userModule = store.state.userModule;
const router = useRouter();

watchEffect(() => {
  if (!userModule.isAuth) {
    router.push('/authorization')
  }
})

router.beforeEach((to, from, next) => {
  if (from.name === 'tasks' && to.name !== 'tasks') {
    if (from.params.id) {
      SocketEmit.leaveRoom({type: 'task', id: Number(from.params.id)})
    }
    store.dispatch('taskModule/resetAction')
    SocketEmit.leaveRoom({type: 'taskList'})
  }
  if (from.name === 'projects' && to.name !== 'projects') {
    if (to.name !== 'board') {
      store.commit('projectModule/setCurrentProject', {})
    }
    if (from.params.id) {
      SocketEmit.leaveRoom({type: 'project', id: Number(from.params.id)})
    }
    store.dispatch('projectModule/resetProjectAction');
    SocketEmit.leaveRoom({type: 'projectList'})
  }
  if (from.name === 'board' && to.name !== 'board') {
    if (from.params.id) {
      SocketEmit.leaveRoom({type: 'board', id: Number(from.params.id)})
      store.commit('projectModule/setCurrentProject', {})
      store.commit('projectModule/setBoardRoom', [])
    }
    SocketEmit.leaveRoom({type: 'boardList'})
  }
  next();
})
</script>

<style scoped>
.main {
  display: grid;
  height: 100lvh;
  grid-template-columns: 200px auto;
  grid-template-rows: 50px calc(100lvh - 50px);
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