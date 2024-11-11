<template>
  <div class="list-items">
    <div v-for="project in filterableProjectList"
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
import {Store, useStore} from "vuex";
import router from "../../../../../../router/router.ts";
import {onBeforeUnmount, onMounted, ref, watchEffect} from "vue";
import {IProjectList, IProjectModuleState} from "../../../../../../models/projectModels.ts";
import SocketEmit from "../../../../../../api/socketEmit.ts";
import {key, State} from "../../../../../../store/store.ts";

const store: Store<State> = useStore(key);
const projectStore: IProjectModuleState = store.state.projectModule;
const filterableProjectList = ref<IProjectList[]>([]);
const observer = ref<null>(null);
let observe: IntersectionObserver | null = null;

const props = defineProps<{ path: string, searchString: string }>();
const handleClick = (projectId: number): void => {
  router.push(`/${props.path}/${projectId}`);
  store.dispatch('projectModule/getProjectAC', projectId)
}
const filter = (string: string): IProjectList[] => {
  return projectStore.projectList.filter((el) => el.name.includes(string))
}

const handleGetProjectMore = async (): Promise<void> => {
  if (projectStore.pageInfo.totalPages > projectStore.pageInfo.page) {
    const newPage: number = projectStore.pageInfo.page + 1;
    store.commit('projectModule/setCurrentPage', newPage);
    await SocketEmit.getProjectListEmit(newPage);
  }
}

watchEffect((): void => {
  filterableProjectList.value = filter(props.searchString)
})

onMounted((): void => {
  if (observer.value) {
    observe = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        handleGetProjectMore();
      }
    }, {rootMargin: '0px 0px 100px 0px', threshold: 0.1})
    observe.observe(observer.value)
  }
})

onBeforeUnmount((): void => {
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
  padding: 0 5px 0 5px;
  border-bottom: 1px solid var(--neutral-400);
  cursor: pointer;
  height: 2.75rem;
  align-content: center;
}

.select {
  background-color: var(--primary-400);
}
</style>