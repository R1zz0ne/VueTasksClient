<template>
  <div v-if="errors" class="m-error-message">
    <span v-for="error in errors._errors">{{error}}</span>
  </div>
</template>

<script setup lang="ts">
defineProps(['errors'])
</script>

<style scoped>
.m-error-message {
  color: var(--danger-500);
}
</style>