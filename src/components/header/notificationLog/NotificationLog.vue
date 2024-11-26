<template>
  <div class="not-log-container">
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
    <div v-for="el in reversedNotificationLog" :key="el.notificationId">
      <NotificationLogItem :name="el.name"
                           :isChecked="el.isChecked"
                           :taskId="el.taskId"
                           :message="el.message"
                           :notificationId="el.notificationId"
                           :createdAt="el.createdAt"
                           :handle-check-notification="handleCheckNotification"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import {Store, useStore} from "vuex";
import NotificationLogItem from "./NotificationLogItem.vue";
import {computed, ComputedRef, Ref, ref} from "vue";
import {key, State} from "../../../store/store.ts";
import {INotificationsLog} from "../../../models/notificationModels.ts";
import {listMode} from "../../../utils/constants.ts";

const notificationListMode: Ref<string> = ref('active')
const store: Store<State> = useStore(key);
const state: State = store.state;

const reversedNotificationLog: ComputedRef<INotificationsLog[]> = computed(() => {
  if (notificationListMode.value === listMode.active) {
    const activeNotification: INotificationsLog[] = state.notificationModule.notificationLog.filter((el) => !el.isChecked)
    return activeNotification.reverse();
  } else {
    return state.notificationModule.notificationLog.slice().reverse();
  }
})
const handleCheckNotification = (notificationId: number): void => {
  store.dispatch('notificationModule/checkNotification', {notificationId})
}


const setNotificationListMode = (value: string): void => {
  notificationListMode.value = value;
}
</script>

<style scoped>
.not-log-container {
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