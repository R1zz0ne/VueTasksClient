import {ref} from "vue";
import {IUseSnackbarReturn} from "../models/otherModels.ts";

export function useSnackbar(timer: number): IUseSnackbarReturn {
    const show = ref<boolean>(false);
    const timerId = ref<number | undefined>();
    const showSnackbar = (): void => {
        show.value = true;
        timerId.value = setTimeout(() => {
            show.value = false;
        }, timer)
    }
    const closeSnackbar = (): void => {
        clearTimeout(timerId.value);
        show.value = false;
    }
    return {
        showSnackbar,
        closeSnackbar,
        show,
    }
}