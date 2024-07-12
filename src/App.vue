<script setup lang="ts">
import {onMounted} from "vue";
import ErrorSnackbar from "./components/ui/NotificationSnackbar.vue";
import {useStore} from "vuex";

onMounted(() => {
  if (localStorage.getItem('token')) {
    useStore().dispatch('userModule/refreshAuth')
  }
})
</script>

<template>
  <error-snackbar/>
  <router-view></router-view>
</template>

<style scoped>
</style>
