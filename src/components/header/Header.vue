<template>
  <div class="header">
    <m-button @click="handleVisible">Журнал уведомлений</m-button>
    <m-dialog v-model:show="isVisible">
      <notification-log/>
    </m-dialog>
    <m-button @click="logout">Выйти</m-button>
  </div>
</template>

<script setup lang="ts">
import MButton from "../ui/MButton.vue";
import {useStore} from "vuex";
import {Ref, ref} from "vue";
import MDialog from "../ui/MDialog.vue";
import NotificationLog from "./notificationLog/NotificationLog.vue";

const isVisible: Ref<boolean> = ref(false);

const handleVisible = () => {
  isVisible.value = !isVisible.value
}

const store = useStore();

const logout = () => {
  store.dispatch('userModule/logout')
}
</script>

<style scoped>
.header {
  gap: 1rem;
}
</style>
