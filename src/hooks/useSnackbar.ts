import {ref} from "vue";

export function useSnackbar(timer: number) {
    const show = ref(false);
    const timerId = ref();
    const showSnackbar = () => {
        show.value = true;
        timerId.value = setTimeout(() => {
            show.value = false;
        }, timer)
    }
    const closeSnackbar = () => {
        clearTimeout(timerId.value);
        show.value = false;
    }
    return {
        showSnackbar,
        closeSnackbar,
        show,
    }
}