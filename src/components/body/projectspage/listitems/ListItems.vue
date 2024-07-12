<template>
  <ul class="listItems">
    <li v-for="project in filtrableProjectList"
        :key="project.project_id"
        @click="handleClick(project.project_id)"
        :class="[project.project_id === Number($route.params.id) ? 'select' : '']"
    >
      {{ project.name }}
    </li>
  </ul>
</template>

<script setup lang="ts">
import {useStore} from "vuex";
import router from "../../../../router/router.ts";
import {ref, watchEffect} from "vue";
import {IProjectList} from "../../../../models/ProjectModels.ts";

const store = useStore();
const projectStore = store.state.projectModule;
const filtrableProjectList = ref([] as IProjectList[]);

// const {path, searchString} = defineProps<{ path: string, searchString: string }>();
const props = defineProps<{ path: string, searchString: string }>();
const handleClick = (projectId: number) => {
  router.push(`/${props.path}/${projectId}`);
  store.dispatch('projectModule/getProjectAC', projectId)
}
const filter = (string: string) => {
  return projectStore.projectList.filter((el) => el.name.includes(string))
}

watchEffect(() => {
  filtrableProjectList.value = filter(props.searchString)
})
</script>

<style scoped>
.listItems {
  flex-grow: 1;
  list-style-type: none;

  li {
    padding: 10px 5px 10px 5px;
    border-bottom: 1px solid var(--neutral-400);
    cursor: default;
  }
}

.select {
  background-color: var(--primary-400);
}
</style>