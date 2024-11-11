<script setup lang="ts">
import {onMounted} from "vue";
import ErrorSnackbar from "./components/ui/NotificationSnackbar.vue";
import {useStore} from "vuex";
import SocketEmit from "./api/socketEmit.ts";
import {key} from "./store/store.ts";

onMounted(async (): Promise<void> => {
  if (localStorage.getItem('refresh')) {
    await useStore(key).dispatch('userModule/refreshAuth')
    SocketEmit.getNotificationLogEmit()
  }
})
</script>

<template>
  <ErrorSnackbar/>
  <RouterView></RouterView>
</template>

<style scoped>
</style>
