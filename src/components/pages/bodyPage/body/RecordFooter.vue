<template>
  <div class="footer">
    <div class="viewers" v-if="viewersComp.length > 0">
      <InfoSVGFill/>
      <div v-for="(user, index) in viewersComp" :key="user.userId" class="users">
        {{ user.name }}{{ viewersComp.length - 1 === index ? "&nbsp;" : ", &nbsp;" }}
      </div>
      {{ viewersComp.length > 1 ? 'просматривают запись' : 'просматривает запись' }}
    </div>
    <div class="editor" v-if="editor && editor.userId && editor.userId !== myId">
      <WarningSVGFill/>
      <div class="users">
        {{ editor.name }}{{ "&nbsp;" }}
      </div>
      редактирует запись
    </div>
  </div>
</template>

<script setup lang="ts">
import {IUser} from "../../../../models/userModels.ts";
import InfoSVGFill from "../../../ui/svg/InfoSVGFill.vue";
import WarningSVGFill from "../../../ui/svg/WarningSVGFill.vue";
import {ref, watchEffect} from "vue";
import {useStore} from "vuex";
import {key} from "../../../../store/store.ts";

const viewersComp = ref<Pick<IUser, 'userId' | 'name'>[]>([]);

const props = defineProps<{
  viewers: Pick<IUser, 'userId' | 'name'>[],
  editor: Pick<IUser, 'userId' | 'name'> | null
}>();

const myId: number = useStore(key).state.userModule.user.userId

watchEffect((): void => {
  if (props.viewers) {
    const viewersWithoutMe: Pick<IUser, 'userId' | 'name'>[] = props.viewers.filter(viewer => viewer.userId !== myId);
    if (props.editor && props.editor.userId) {
      viewersComp.value = viewersWithoutMe.filter((viewer) =>
          viewer.userId !== props.editor!.userId
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