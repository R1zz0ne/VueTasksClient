import {Module} from "vuex";
import {IAuthResponse, IUserModuleState} from "../../models/UserModels.ts";
import {AxiosResponse} from "axios";
import ApiAuth from "../../api/apiAuth.ts";
import {setError} from "../../services/setError.ts";

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
            state.user = user.user;
            state.isAuth = true;
        },
        removeAuthDate(state) {
            localStorage.removeItem('token');
            state.user = {user_id: 0, name: '', email: ''};
            state.isAuth = false;
        }
    },
    actions: {
        async refreshAuth({commit}) {
            try {
                const response: AxiosResponse<IAuthResponse> = await ApiAuth.refresh();
                commit('setAuthData', response.data)
            } catch (e: any) {
                setError(e.response.data);
            }
        },
        async logout({commit}) {
            try {
                await ApiAuth.logout();
                commit('removeAuthDate');
            } catch (e: any) {
                setError(e.response.data);
            }
        },
        async login({commit}, {email, password}) {
            try {
                const response: AxiosResponse<IAuthResponse> = await ApiAuth.login(email, password);
                commit('setAuthData', response.data)
            } catch (e: any) {
                setError(e.response.data);
            }
        },
        async registration({commit}, {name, email, password}) {
            try {
                const response: AxiosResponse<IAuthResponse> = await ApiAuth.registration(name, email, password);
                commit('setAuthData', response.data)
            } catch (e: any) {
                setError(e.response.data);
            }
        }
    }
}