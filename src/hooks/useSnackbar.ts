import {ref} from "vue";
import {IUseSnackbarReturn} from "../models/otherModels.ts";

export function useSnackbar(timer: number): IUseSnackbarReturn {
    const show = ref<boolean>(false);
    const timerId = ref<number | undefined>();
    const showSnackBar = (): void => {
        clearTimeout(timerId.value);
        show.value = true;
        timerId.value = setTimeout(() => {
            show.value = false;
        }, timer)
    }
    const closeSnackBar = (): void => {
        clearTimeout(timerId.value);
        show.value = false;
    }
    return {
        showSnackBar,
        closeSnackBar,
        show,
    }
}