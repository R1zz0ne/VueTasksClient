import {store} from "../store/store.ts";
import {IError} from "../models/ErrorModels.ts";

export function setError(data: Omit<IError, 'isChecked'>) {
    store.commit('errorModule/setError', data)
}