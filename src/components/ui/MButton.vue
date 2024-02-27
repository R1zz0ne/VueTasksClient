<template>
  <button>
    <slot/>
  </button>
</template>

<script setup lang="ts">

</script>

<style scoped>
button {
  padding: 5px;
  background-color: var(--primary-500);
  outline: none;
  border-radius: 10px;
  border: none;
  height: 1.75rem;
  color: var(--neutral-100);
}

button:hover, button:focus {
  background-color: var(--primary-600);
}



button:active {
  background-color: var(--primary-700);
  color: var(--neutral-50);
}
</style>