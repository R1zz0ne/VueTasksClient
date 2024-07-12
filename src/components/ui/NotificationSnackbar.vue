<template>
  <m-snack-bar :show="show" :text="text" :type="type" :close_snackbar="closeSnackbar" />
</template>

<script setup lang="ts">
import {useSnackbar} from "../../hooks/useSnackbar.ts";
import {ref, watchEffect} from "vue";
import {useStore} from "vuex";
import MSnackBar from "./MSnackBar.vue";

const {show, showSnackbar, closeSnackbar} = useSnackbar(5000)
const store = useStore().state.notificationModule;
const text = ref('');
const type = ref('');

watchEffect(() => {
  if (store.notifications.length > 0) {
    text.value = store.notifications.at(-1).message;
    type.value = store.notifications.at(-1).type;
    showSnackbar()
  }
})
</script>

<style scoped>

</style>