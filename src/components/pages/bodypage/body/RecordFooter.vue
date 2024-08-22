<template>
  <div class="footer">
    <div class="viewers" v-if="viewersComp.length > 0">
      <info-s-v-g-fill/>
      <div v-for="(user, index) in viewersComp" :key="user.user_id" class="users">
        {{ user.name }}{{ viewersComp.length - 1 === index ? "&nbsp;" : ", &nbsp;" }}
      </div>
      {{ viewersComp.length > 1 ? 'просматривают запись' : 'просматривает запись' }}
    </div>
    <div class="editor" v-if="editor && editor.user_id && editor.user_id !== my_id">
      <warning-s-v-g-fill/>
      <div class="users">
        {{ editor.name }}{{ "&nbsp;" }}
      </div>
      редактирует запись
    </div>
  </div>
</template>

<script setup lang="ts">
import {IUser} from "../../../../models/UserModels.ts";
import InfoSVGFill from "../../../ui/svg/InfoSVGFill.vue";
import WarningSVGFill from "../../../ui/svg/WarningSVGFill.vue";
import {ref, watchEffect} from "vue";
import {useStore} from "vuex";

const viewersComp = ref<Pick<IUser, 'user_id' | 'name'>[]>([]);

const props = defineProps<{
  viewers: Pick<IUser, 'user_id' | 'name'>[],
  editor: Pick<IUser, 'user_id' | 'name'> | null
}>();

const my_id: number = useStore().state.userModule.user.user_id

watchEffect(() => {
  if (props.viewers) {
    const viewersWithoutMe = props.viewers.filter(viewer => viewer.user_id !== my_id);
    if (props.editor && props.editor.user_id) {
      viewersComp.value = viewersWithoutMe.filter((viewer) =>
          viewer.user_id !== props.editor!.user_id
      )
    } else {
      viewersComp.value = viewersWithoutMe;
    }
  }
})
</script>

<style scoped>
.footer {
  font-size: 14px;
  color: var(--neutral-800);
  display: flex;
  flex-direction: column;
  margin-top: auto;
}

.viewers {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.editor {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.users {
  font-style: italic;
}
</style>