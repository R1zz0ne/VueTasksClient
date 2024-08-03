import {Module} from "vuex";
import {IAuthForm, IAuthResponse, IRegForm, IUserModuleState} from "../../models/UserModels.ts";
import {setError} from "../../services/setError.ts";
import SocketEmit from "../../api/socketEmit.ts";

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
    getters: {},
    mutations: {
        setAuthData(state, user: IAuthResponse) {
            localStorage.setItem('token', user.accessToken);
            localStorage.setItem('refresh', user.refreshToken);
            state.user = user.user;
            state.isAuth = true;
        },
        removeAuthDate(state) {
            localStorage.removeItem('token');
            localStorage.removeItem('refresh')
            state.user = {user_id: 0, name: '', email: ''};
            state.isAuth = false;
        }
    },
    actions: {
        async refreshAuth({commit}) {
            try {
                const response: IRegForm = await SocketEmit.refreshEmit({refreshToken: localStorage.getItem('refresh')})
                commit('setAuthData', response)
            } catch (e: any) {
                setError(e);
            }
        },
        async logout({commit}) {
            try {
                await SocketEmit.logoutEmit({refreshToken: localStorage.getItem('refresh')});
                commit('removeAuthDate');
            } catch (e: any) {
                setError(e);
            }
        },
        async login({commit}, data: IAuthForm) {
            try {
                const response: IAuthResponse = await SocketEmit.loginEmit(data);
                commit('setAuthData', response)
            } catch (e: any) {
                setError(e);
            }
        },
        async registration({commit}, data: IRegForm) {
            try {
                const response: IAuthResponse = await SocketEmit.registrationEmit(data)
                commit('setAuthData', response)
            } catch (e: any) {
                setError(e);
            }
        }
    }
}