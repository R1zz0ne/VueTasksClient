<template>
  <MSnackBar :show="show" :text="text" :type="type" :closeSnackBar="closeSnackBar"/>
</template>

<script setup lang="ts">
import {useSnackbar} from "../../hooks/useSnackbar.ts";
import {ref, watchEffect} from "vue";
import {useStore} from "vuex";
import MSnackBar from "./MSnackBar.vue";
import {key} from "../../store/store.ts";
import {IActionNotification, INotificationsModuleState, ITypeNotification} from "../../models/notificationModels.ts";

const {show, showSnackBar, closeSnackBar} = useSnackbar(5000)
const store: INotificationsModuleState = useStore(key).state.notificationModule;
const text = ref<string>('');
const type = ref<ITypeNotification>('info');

watchEffect((): void => {
  const lastNotification: IActionNotification | undefined = store.actionNotifications.at(-1)
  if (lastNotification) {
    text.value = lastNotification.message;
    type.value = lastNotification.type;
    showSnackBar()
  }
})
</script>

<style scoped>

</style>