<template>
  <div class="mSelInput" ref="selInputRef">
    <div class="selInput">
      <m-input v-model="inputValue"
               @focusin="isFocus.wasFocus = isFocus.focus; isFocus.focus = true"
               @focusout="isFocus.wasFocus = isFocus.focus; isFocus.focus = false"
               :class="[resArray.length>0 ? 'ifSelectedInput': '']"
      >
      </m-input>
      <search-s-v-g></search-s-v-g>
    </div>
    <div v-if="resArray.length > 0" class="selected">
      <div v-for="element in resArray" class="selectedElement" @click="onSelectUser(element)" :key="element.user_id">
        <span>{{ element.name }}</span>
        <info-s-v-g class="info">
          <title>{{element.email}}</title>
        </info-s-v-g>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import MInput from "./MInput.vue";
import {ref, watchEffect} from "vue";
import {IUser} from "../../models/UserModels.ts";
import {AxiosResponse} from "axios";
import ApiUsers from "../../api/apiUsers.ts";
import SearchSVG from "./svg/SearchSVG.vue";
import InfoSVG from "./svg/InfoSVG.vue";
import {onClickOutside} from "@vueuse/core"

interface IProps {
  selectUser: {
    user_id: number,
    name: string
  },
  setSelectUser: Function
}

const {selectUser, setSelectUser} = defineProps<IProps>()

const resArray = ref([] as IUser[])
const isFocus = ref({
  wasFocus: false,
  focus: false
});
const inputValue = ref('');
const resetValue = () => {
  resArray.value = [];
  inputValue.value = selectUser.name;
}
resetValue();
const onSelectUser = (user: IUser) => {
  setSelectUser({user_id: user.user_id, name: user.name});
  inputValue.value = user.name;
  resArray.value = []
  isFocus.value.wasFocus = false;
}
const handleClickOutside = () => {
  if (isFocus.value.wasFocus) {
    inputValue.value = selectUser.name;
    resetValue();
    isFocus.value.wasFocus = false;
  }
}
const selInputRef = ref(null);
onClickOutside(selInputRef, handleClickOutside)

watchEffect(async () => {
  if (!inputValue.value.trim()) {
    setSelectUser({user_id: 0, name: ''})
  } else if (selectUser.name != inputValue.value) {
    const response: AxiosResponse<IUser[]> = await ApiUsers.getUsers(inputValue.value);
    resArray.value = response.data;
  } else {
    resetValue();
  }
})
</script>

<style scoped>
.mSelInput {
  width: calc(100% - 145px);
}

.ifSelectedInput {
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0
}

.selInput {
  input {
    width: 100%;
  }

  svg {
    position: absolute;
    right: 0
  }
}

.selected {
  position: absolute;
  margin-top: 1px;
  border: 1px solid var(--neutral-700);
  top: 100%;
  left: 145px;
  width: calc(100% - 145px);
  background-color: var(--neutral-200);
}

.selectedElement {
  cursor: pointer;
  height: 20px;
  display: flex;
  align-items: center;
  gap: 5px;
  margin-left: 5px;
}
</style>