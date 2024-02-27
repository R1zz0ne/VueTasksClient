import {AxiosResponse} from "axios";
import {IAuthResponse} from "../models/UserModels.ts";
import {store} from "../store/store.ts";

export function setAuthData(response: AxiosResponse<IAuthResponse>, isAuth: boolean) {
    if (isAuth) {
        localStorage.setItem('token', response.data.accessToken);
        store.commit('userModule/setUser', response.data.user);
        store.commit('userModule/setIsAuth', isAuth);
    } else {
        localStorage.removeItem('token');
        store.commit('userModule/setUser', {user_id: 0, name: '', email: ''});
        store.commit('userModule/setIsAuth', isAuth);
    }
}