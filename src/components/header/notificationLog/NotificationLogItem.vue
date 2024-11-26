<template>
  <div class="not-log-item">
    <div class="status-indicator">
      <CircleSVG v-if="!props.isChecked"
                 title="Отметить как прочитанное"
                 @click="handleCheckNotification(props.notificationId)"
      />
    </div>
    <div class="line-content">
      <div class="head">
        <div>#{{ props.taskId }}</div>
        <div>{{ props.name }}</div>
      </div>
      <div class="message">{{ props.message }}</div>
    </div>
    <div class="time-info">
      {{ new Date(props.createdAt).toLocaleString() }}
    </div>
  </div>
</template>

<script setup lang="ts">
import CircleSVG from "../../ui/svg/CircleSVG.vue";

const props = defineProps<{
  name: string,
  taskId: number,
  message: string,
  isChecked: boolean,
  notificationId: number,
  createdAt: string,
  handleCheckNotification: Function
}>();
</script>

<style scoped>
.not-log-item {
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

.time-info {
  width: 80px;
}

.line-content {
  width: 500px;
}
</style>