import {Module} from "vuex";
import {IUser, IUserModuleState} from "../models/UserModels.ts";

export const UserModule: Module<IUserModuleState, any> = {
    namespaced: true,
    state: () => ({
        user: {
            user_id: 0,
            name: '',
            email: ''
        },
        isAuth: false,
    }),
    getters: {}, //computed свойства (кэшируемые, вычисляемые значения)
    mutations: {
        setUser(state, user: IUser) {
            state.user = user;
        },
        setIsAuth(state, bool) {
            state.isAuth = bool;
        }
    }, //изменение состояния
    actions: {} //для сайд эффектов (запросы на сервер)
}