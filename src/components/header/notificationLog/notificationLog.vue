<template>
  <div class="not_log_container">
    <div class="tab-panel">
      <div class="tab-item"
           :class="[notificationListMode === 'active' ? 'tab-item-act' : '']"
           @click="setNotificationListMode('active')"
      >Не прочитанные
      </div>
      <div class="tab-item"
           :class="[notificationListMode === 'all' ? 'tab-item-act' : '']"
           @click="setNotificationListMode('all')"
      >Все
      </div>
    </div>
    <div v-for="el in reversedNotificationLog" :key="el.notification_id">
      <notification-log-item :name="el.name"
                             :is_checked="el.is_checked"
                             :task_id="el.task_id"
                             :message="el.message"
                             :notification_id="el.notification_id"
                             :created_at="el.created_at"
                             :handle-check-notification="handleCheckNotification"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import {useStore} from "vuex";
import NotificationLogItem from "./notificationLogItem.vue";
import {computed, ref} from "vue";

const notificationListMode = ref('active')
const store = useStore();
const state = store.state;

const reversedNotificationLog = computed(() => {
  if (notificationListMode.value === "active") {
    const activeNotification = state.notificationModule.notification_log.filter((el) => el.is_checked === false)
    return activeNotification.reverse();
  } else {
    return state.notificationModule.notification_log.slice().reverse();
  }
})
const handleCheckNotification = (notification_id: number) => {
  store.dispatch('notificationModule/checkNotification', {notification_id})
}


const setNotificationListMode = (value: string) => {
  notificationListMode.value = value;
}
</script>

<style scoped>
.not_log_container {
  padding-top: 1rem;
  padding-bottom: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.tab-panel {
  width: 80%;
  display: flex;
  flex-direction: row;
  padding-bottom: 1rem;
}

.tab-item {
  width: 100%;
  text-align: center;
  border: 1px solid var(--primary-400);
  cursor: pointer;
  color: var(--primary-600);
}

.tab-item:first-child {
  border-bottom-left-radius: 5px;
  border-top-left-radius: 5px;
}

.tab-item:last-child {
  border-bottom-right-radius: 5px;
  border-top-right-radius: 5px;
}

.tab-item-act {
  background-color: var(--primary-300);
  font-weight: bold;
}
</style>