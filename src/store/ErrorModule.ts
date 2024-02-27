import {Module} from "vuex";
import {IError, IErrorModuleState} from "../models/ErrorModels.ts";

export const ErrorModule: Module<IErrorModuleState, any> = {
    namespaced: true,
    state: () => ({
        errors: []
    }),
    mutations: {
        setError(state, error: Omit<IError, 'isChecked'>) {
            state.errors.push({...error, isChecked: false});
        }
    }
}