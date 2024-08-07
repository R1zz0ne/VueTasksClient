<script setup lang="ts">
import {onMounted} from "vue";
import ErrorSnackbar from "./components/ui/NotificationSnackbar.vue";
import {useStore} from "vuex";
import SocketEmit from "./api/socketEmit.ts";

onMounted(async () => {
  if (localStorage.getItem('refresh')) {
    await useStore().dispatch('userModule/refreshAuth')
    SocketEmit.getNotificationLogEmit()
  }
})
</script>

<template>
  <error-snackbar/>
  <router-view></router-view>
</template>

<style scoped>
</style>
