<template>
  <div class="m-sel-input" ref="selInputRef">
    <div class="sel-input">
      <MInput v-model="inputValue"
              @focusin="isFocus.wasFocus = isFocus.focus; isFocus.focus = true"
              @focusout="isFocus.wasFocus = isFocus.focus; isFocus.focus = false"
              :class="[resArray.length>0 ? 'if-selected-input': '']"
      >
      </MInput>
      <SearchSVG></SearchSVG>
    </div>
    <div v-if="resArray.length > 0" class="selected">
      <div v-for="element in resArray" class="selected-element" @click="onSelectUser(element)" :key="element.userId">
        <span>{{ element.name }}</span>
        <InfoSVG class="info">
          <title>{{element.email}}</title>
        </InfoSVG>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import MInput from "./MInput.vue";
import {ref, watchEffect} from "vue";
import {IUser} from "../../models/userModels.ts";
import SearchSVG from "./svg/SearchSVG.vue";
import InfoSVG from "./svg/InfoSVG.vue";
import {onClickOutside} from "@vueuse/core"
import SocketEmit from "../../api/socketEmit.ts";
import {setError} from "../../services/setError.ts";
import {IIsFocus, ISelectedInputUserProps} from "../../models/otherModels.ts";

const {selectUser, setSelectUser} = defineProps<ISelectedInputUserProps>()

const resArray = ref<IUser[]>([])
const isFocus = ref<IIsFocus>({
  wasFocus: false,
  focus: false
});
const inputValue = ref<string>('');
const resetValue = (): void => {
  resArray.value = [];
  inputValue.value = selectUser.name;
}
resetValue();
const onSelectUser = (user: IUser): void => {
  setSelectUser({userId: user.userId, name: user.name});
  inputValue.value = user.name;
  resArray.value = []
  isFocus.value.wasFocus = false;
}
const handleClickOutside = (): void => {
  if (isFocus.value.wasFocus) {
    inputValue.value = selectUser.name;
    resetValue();
    isFocus.value.wasFocus = false;
  }
}
const selInputRef = ref<null>(null);
onClickOutside(selInputRef, handleClickOutside)

watchEffect(async (): Promise<void> => {
      if (!inputValue.value.trim()) {
        setSelectUser({userId: 0, name: ''})
      } else if (selectUser.name !== inputValue.value) {
        try {
          resArray.value = await SocketEmit.getUsersEmit({query: inputValue.value})
        } catch (e: unknown) {
          setError(e)
        }
      } else {
        resetValue();
      }
    }
)
</script>

<style scoped>
.m-sel-input {
  width: calc(100% - 145px);
}

.if-selected-input {
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0
}

.sel-input {
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

.selected-element {
  cursor: pointer;
  height: 20px;
  display: flex;
  align-items: center;
  gap: 5px;
  margin-left: 5px;
}
</style>