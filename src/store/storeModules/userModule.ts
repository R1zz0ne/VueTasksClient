import {Commit, Module} from "vuex";
import {IAuthForm, IAuthResponse, IRegForm, IUserModuleState} from "../../models/userModels.ts";
import {setError} from "../../services/setError.ts";
import SocketEmit from "../../api/socketEmit.ts";
import {State} from "../store.ts";

export const UserModule: Module<IUserModuleState, State> = {
    namespaced: true,
    state: (): IUserModuleState => ({
        user: {
            userId: 0,
            name: '',
            email: ''
        },
        isAuth: false,
    }),
    mutations: {
        setAuthData(state: IUserModuleState, user: IAuthResponse): void {
            localStorage.setItem('token', user.accessToken);
            localStorage.setItem('refresh', user.refreshToken);
            state.user = user.user;
            state.isAuth = true;
        },
        removeAuthDate(state: IUserModuleState): void {
            localStorage.removeItem('token');
            localStorage.removeItem('refresh')
            state.user = {userId: 0, name: '', email: ''};
            state.isAuth = false;
        }
    },
    actions: {
        async refreshAuth({commit}: { commit: Commit }): Promise<void> {
            try {
                const response: IAuthResponse = await SocketEmit.refreshEmit({refreshToken: localStorage.getItem('refresh')})
                commit('setAuthData', response)
            } catch (e: unknown) {
                setError(e);
            }
        },
        async logout({commit}: { commit: Commit }): Promise<void> {
            try {
                await SocketEmit.logoutEmit({refreshToken: localStorage.getItem('refresh')});
                commit('removeAuthDate');
            } catch (e: unknown) {
                setError(e);
            }
        },
        async login({commit}: { commit: Commit }, data: IAuthForm): Promise<void> {
            try {
                const response: IAuthResponse = await SocketEmit.loginEmit(data);
                commit('setAuthData', response)
            } catch (e: unknown) {
                console.log(e)
                setError(e);
            }
        },
        async registration({commit}: { commit: Commit }, data: IRegForm): Promise<void> {
            try {
                const response: IAuthResponse = await SocketEmit.registrationEmit(data)
                commit('setAuthData', response)
            } catch (e: unknown) {
                setError(e);
            }
        }
    }
}