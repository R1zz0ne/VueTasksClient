<template>
  <li @click="clickHandler"
      :class="{active: $route.path === path || $route.path.startsWith(`${path}/`)}"
  >{{ title }}
  </li>
</template>

<script setup lang="ts">
import {useRouter} from "vue-router";
import SocketEmit from "../../api/socketEmit.ts";

const {path, title, room} = defineProps<{ path: string, title: string, room: string }>()

const router = useRouter();

const clickHandler = () => {
  router.push(path)
  SocketEmit.joinRoom({type: room})
}
</script>

<style scoped>
li {
  width: 8rem;
  padding: 0.5rem;
  border: 2px solid var(--primary-600);
  border-radius: 0.5rem;
  text-align: center;
  color: var(--primary-600);
  font-weight: bold;
  cursor: pointer;
}

.active {
  background-color: var(--neutral-400);
  color: var(--primary-700);
}
</style>