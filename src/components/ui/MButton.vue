<template>
  <button :class="[type ? type : 'primary']">
    <slot/>
  </button>
</template>

<script setup lang="ts">
interface IPropsMButton {
  type?: 'primary' | 'success' | 'danger' | 'none'
}

const {type} = defineProps<IPropsMButton>()
</script>

<style scoped>
button {
  padding: 5px;
  outline: none;
  border-radius: 10px;
  border: none;
  height: 1.75rem;
  cursor: pointer;
}

.primary {
  background-color: var(--primary-500);
  color: var(--neutral-100);
}
.primary:hover, .primary:focus {
  background-color: var(--primary-600);
}
.primary:active {
  background-color: var(--primary-700);
  color: var(--neutral-50);
}

.success {
  background-color: var(--success-500);
  color: var(--neutral-100);
}
.success:hover, .success:focus {
  background-color: var(--success-600);
}
.success:active {
  background-color: var(--success-700);
  color: var(--neutral-50);
}

.danger {
  background-color: var(--danger-500);
  color: var(--neutral-100);
}
.danger:hover, .danger:focus {
  background-color: var(--danger-600);
}
.danger:active {
  background-color: var(--danger-700);
  color: var(--neutral-50);
}

.none {
  background-color: transparent;
}
</style>
