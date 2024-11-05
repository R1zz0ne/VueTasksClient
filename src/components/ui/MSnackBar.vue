<template>
  <div class="snackbar" v-if="show">
    <div class="msg-block" :class="type">
      <span>{{ text }}</span>
      <m-button type="none" @click="handleClick" class="close-btn">
        <close-s-v-g style="vertical-align: center" :stroke="type"/>
      </m-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import CloseSVG from "./svg/CloseSVG.vue";
import MButton from "./MButton.vue";

const {show, text, type, closeSnackbar} = defineProps({
  show: Boolean,
  text: String,
  type: String,
  closeSnackbar: {
    type: Function,
    required: true
  },
})
const handleClick = () => {
  closeSnackbar();
}
</script>

<style scoped>
.snackbar {
  position: absolute;
  margin-top: 5%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}

.msg-block {
  display: flex;
  flex-direction: row;
  border-radius: 10px;
  padding: 0.75rem;
  min-width: 300px;
  justify-content: space-between;
  align-items: center;
}

.close-btn {
  height: 1rem;
  width: 1rem;
  padding: 0;
  margin-left: 5px;
  background-color: transparent;
  border: transparent;
  border-radius: 2px;
}

.error {
  background-color: var(--danger-200);
  color: var(--danger-700);
}

.info {
  background-color: var(--primary-200);
  color: var(--primary-700);
}

.success {
  background-color: var(--success-200);
  color: var(--success-700);
}

.warning {
  background-color: var(--warning-300);
  color: var(--warning-700);
}
</style>