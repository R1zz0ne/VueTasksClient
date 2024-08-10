<template>
  <div class="dialog" v-if="show" @click.stop="hideDialog">
    <div class="dialogContent" @click.stop>
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
const {show, isClose} = defineProps({
  show: {type: Boolean, required: true},
  isClose: {type: String, default: 'all'}
}); //Не получается использовать TS с defineProps и withDefaults
const emits = defineEmits(['update:show']);
const hideDialog = () => {
  if (isClose === "all") {
    emits('update:show', false);
  }
}
</script>

<style scoped>
.dialog {
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.5);
  position: fixed;
  display: flex;
  z-index: 999;
}

.dialogContent {
  margin: auto;
  background: var(--neutral-200);
  border-radius: 12px;
  padding: 12px;
  padding: 0;
  min-width: 30%;
}
</style>