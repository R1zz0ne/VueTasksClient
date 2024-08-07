<template>
  <div class="not_log_container">
    <div v-for="el in reversedNotificationLog" :key="el.notification_id">
      <notification-log-item :name="el.name"
                             :is_checked="el.isChecked"
                             :task_id="el.task_id"
                             :message="el.message"
                             :notification_id="el.notification_id"
                             :created_at="el.created_at"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import {useStore} from "vuex";
import NotificationLogItem from "./notificationLogItem.vue";
import {computed} from "vue";

const state = useStore().state;

console.log(state.notificationModule.notification_log)

const reversedNotificationLog = computed(() => {
  return state.notificationModule.notification_log.slice().reverse();
})
</script>

<style scoped>
.not_log_container {
  padding-top: 1rem;
  padding-bottom: 1rem;
}
</style>