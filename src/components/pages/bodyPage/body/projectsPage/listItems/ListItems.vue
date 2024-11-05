<template>
  <div class="list-items">
    <div v-for="project in filtrableProjectList"
         :key="project.projectId"
         @click="handleClick(project.projectId)"
         :class="{
              'item': true,
              'select': project.projectId === Number($route.params.id),
           }"
    >
      {{ project.name }}
    </div>
    <div ref="observer"/>
  </div>
</template>

<script setup lang="ts">
import {useStore} from "vuex";
import router from "../../../../../../router/router.ts";
import {onBeforeUnmount, onMounted, ref, watchEffect} from "vue";
import {IProjectList} from "../../../../../../models/projectModels.ts";
import SocketEmit from "../../../../../../api/socketEmit.ts";

const store = useStore();
const projectStore = store.state.projectModule;
const filtrableProjectList = ref([] as IProjectList[]);
const observer = ref(null);
let observe: IntersectionObserver | null = null;

const props = defineProps<{ path: string, searchString: string }>();
const handleClick = (projectId: number) => {
  router.push(`/${props.path}/${projectId}`);
  store.dispatch('projectModule/getProjectAC', projectId)
}
const filter = (string: string) => {
  return projectStore.projectList.filter((el) => el.name.includes(string))
}

const handleGetProjectMore = async () => {
  if (projectStore.pageInfo.totalPages > projectStore.pageInfo.page) {
    const newPage: number = projectStore.pageInfo.page + 1;
    store.commit('projectModule/setCurrentPage', newPage);
    await SocketEmit.getProjectListEmit(newPage);
  }
}

watchEffect(() => {
  filtrableProjectList.value = filter(props.searchString)
})

onMounted(() => {
  if (observer.value) {
    observe = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        handleGetProjectMore();
      }
    }, {rootMargin: '0px 0px 100px 0px', threshold: 0.1})
    observe.observe(observer.value)
  }
})

onBeforeUnmount(() => {
  if (observe) {
    observe.disconnect();
  }
})
</script>

<style scoped>
.list-items {
  flex-grow: 1;
  overflow-y: auto;
  list-style-type: none;
}

.item {
  padding: 0px 5px 0px 5px;
  border-bottom: 1px solid var(--neutral-400);
  cursor: pointer;
  height: 2.75rem;
  align-content: center;
}

.select {
  background-color: var(--primary-400);
}
</style>