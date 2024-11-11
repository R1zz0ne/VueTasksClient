<template>
  <div class="header">
    <MButton @click="handleVisible">Журнал уведомлений</MButton>
    <MDialog v-model:show="isVisible">
      <NotificationLog/>
    </MDialog>
    <MButton @click="logout">Выйти</MButton>
  </div>
</template>

<script setup lang="ts">
import MButton from "../ui/MButton.vue";
import {useStore} from "vuex";
import {Ref, ref} from "vue";
import MDialog from "../ui/MDialog.vue";
import NotificationLog from "./notificationLog/NotificationLog.vue";
import {key} from "../../store/store.ts";

const isVisible: Ref<boolean> = ref(false);

const handleVisible = (): void => {
  isVisible.value = !isVisible.value
}

const store = useStore(key);

const logout = (): void => {
  store.dispatch('userModule/logout')
}
</script>

<style scoped>
.header {
  gap: 1rem;
}
</style>
