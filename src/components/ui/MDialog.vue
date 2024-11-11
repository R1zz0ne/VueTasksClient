<template>
  <div class="dialog" v-if="show" @click.stop="hideDialog">
    <div class="dialog-content" @click.stop>
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
const {show, isClose} = defineProps({
  show: {type: Boolean, required: true},
  isClose: {type: String, default: 'all'}
});
const emits = defineEmits(['update:show']);
const hideDialog = (): void => {
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
  z-index: 998;
}

.dialog-content {
  margin: auto;
  background: var(--neutral-300);
  border-radius: 12px;
  padding: 0;
  min-width: 30%;
}
</style>