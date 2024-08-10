<template>
  <div class="not_log_item">
    <div class="status-indicator">
      <circle-s-v-g v-if="!props.is_checked" title="Отметить как прочитанное" @click="handleCheckNotification(props.notification_id)"/>
    </div>
    <div class="line_content">
      <div class="head">
        <div>#{{ props.task_id }}</div>
        <div>{{ props.name }}</div>
        <div>- {{ props.notification_id }}</div>
      </div>
      <div class="message">{{ props.message }}</div>
    </div>
    <div class="time_info">
      {{ new Date(props.created_at).toLocaleString() }}
    </div>
  </div>
</template>

<script setup lang="ts">
import CircleSVG from "../../ui/svg/CircleSVG.vue";

const props = defineProps<{
  name: string,
  task_id: number,
  message: string,
  is_checked: boolean,
  notification_id: number,
  created_at: any,
  handleCheckNotification: Function
}>();
</script>

<style scoped>
.not_log_item {
  border: 1px solid var(--neutral-400);
  padding: 0.5rem;
  display: flex;
  flex-direction: row;
  gap: 0.5rem;
  align-items: center;
}

.head {
  display: flex;
  flex-direction: row;
  gap: 5px;
  font-weight: bold;
}

.status-indicator {
  width: 24px;
  height: 24px;
}

.time_info {
  width: 80px;
}

.line_content {
  width: 500px;
}
</style>