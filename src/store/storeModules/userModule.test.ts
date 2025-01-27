import {describe, it, expect, vi} from "vitest";
import {store} from "../store.ts";
import {UserModule} from "./userModule.ts";
import SocketEmit from "../../api/socketEmit.ts";
import {setError} from "../../services/setError.ts";

vi.mock('../../api/socketEmit.ts', () => ({
    default: {
        refreshEmit: vi.fn(),
        logoutEmit: vi.fn(),
        loginEmit: vi.fn(),
        registrationEmit: vi.fn()
    }
}));
vi.mock("../../services/setError.ts", () => ({
    setError: vi.fn()
}));
vi.stubGlobal('localStorage', {
    getItem: vi.fn((key: string) => {
        if (key === 'refresh') {
            return 'refresh-token'
        }
        return null;
    }),
    setItem: vi.fn(),
    removeItem: vi.fn()
})

describe('Store.UserModule', () => {
    const actions = UserModule.actions as Record<string, Function>;
    it('Инициализация', () => {
        expect(store.state.userModule).toEqual({
            user: {
                userId: 0,
                name: '',
                email: ''
            },
            isAuth: false
        })
    })
    it('Mutation.setAuthData', () => {
        const data = {
            accessToken: 'accessToken',
            refreshToken: 'refreshToken',
            user: {
                userId: 3,
                name: 'ФИО',
                email: 'test@test.com'
            }
        };
        const state = {
            user: {userId: 0, name: '', email: ''},
            isAuth: false
        };
        (UserModule.mutations as NonNullable<typeof UserModule.mutations>).setAuthData(state, data);
        expect(state.isAuth).toEqual(true);
        expect(state.user).toEqual({userId: 3, name: 'ФИО', email: 'test@test.com'});
        expect(localStorage.setItem).toHaveBeenCalledWith('token', data.accessToken);
        expect(localStorage.setItem).toHaveBeenCalledWith('refresh', data.refreshToken);
    })
    it('Mutation.removeAuthDate', () => {
        const data = {userId: 0, name: '', email: ''};
        const state = {
            user: {userId: 3, name: 'ФИО', email: 'test@test.com'},
            isAuth: true
        };
        (UserModule.mutations as NonNullable<typeof UserModule.mutations>).removeAuthDate(state);
        expect(state.isAuth).toEqual(false);
        expect(state.user).toEqual(data);
        expect(localStorage.removeItem).toHaveBeenCalledWith('token');
        expect(localStorage.removeItem).toHaveBeenCalledWith('refresh');
    })
    it('Action.refreshAuth.positive', async () => {
        const responseData = {
            accessToken: 'accessToken',
            refreshToken: 'refreshToken',
            user: {userId: 3, name: 'ФИО', email: 'test@test.com'}
        };
        const commit = vi.fn();
        vi.spyOn(SocketEmit, 'refreshEmit').mockResolvedValue(responseData);
        await actions.refreshAuth({commit});
        expect(localStorage.getItem).toHaveBeenCalledWith('refresh');
        expect(SocketEmit.refreshEmit).toHaveBeenCalledWith({refreshToken: 'refresh-token'});
        expect(commit).toHaveBeenCalledWith('setAuthData', responseData);
        vi.restoreAllMocks();
    })
    it('Action.refreshAuth.negative', async () => {
        const commit = vi.fn();
        const mockError = new Error('Network error');
        vi.spyOn(SocketEmit, 'refreshEmit').mockRejectedValue(mockError);
        await actions.refreshAuth({commit});
        expect(setError).toHaveBeenCalledWith(mockError);
        vi.restoreAllMocks();
    })
    it('Action.logout.positive', async () => {
        const commit = vi.fn();
        vi.spyOn(SocketEmit, 'logoutEmit').mockResolvedValue({});
        await actions.logout({commit});
        expect(SocketEmit.logoutEmit).toHaveBeenCalledWith({refreshToken: 'refresh-token'});
        expect(commit).toHaveBeenCalledWith('removeAuthDate');
        vi.restoreAllMocks();
    })
    it('Action.logout.negative', async () => {
        const commit = vi.fn();
        const mockError = new Error('Network error');
        vi.spyOn(SocketEmit, 'logoutEmit').mockRejectedValue(mockError);
        await actions.logout({commit});
        expect(setError).toHaveBeenCalledWith(mockError);
        vi.restoreAllMocks();
    })
    it('Action.login.positive', async () => {
        const requestData = {email: 'test@test.ru', password: '12345'};
        const responseData = {
            accessToken: 'accessToken',
            refreshToken: 'refreshToken',
            user: {userId: 3, name: 'ФИО', email: 'test@test.com'}
        };
        const commit = vi.fn();
        vi.spyOn(SocketEmit, 'loginEmit').mockResolvedValue(responseData);
        await actions.login({commit}, requestData);
        expect(SocketEmit.loginEmit).toHaveBeenCalledWith(requestData);
        expect(commit).toHaveBeenCalledWith('setAuthData', responseData);
        vi.restoreAllMocks();
    })
    it('Action.login.negative', async () => {
        const commit = vi.fn();
        const mockError = new Error('Network error');
        vi.spyOn(SocketEmit, 'loginEmit').mockRejectedValue(mockError);
        await actions.login({commit}, {});
        expect(setError).toHaveBeenCalledWith(mockError);
        vi.restoreAllMocks();
    })
    it('Action.registration.positive', async () => {
        const requestData = {email: 'test@test.ru', name: 'фио', password: '12345'};
        const responseData = {
            accessToken: 'accessToken',
            refreshToken: 'refreshToken',
            user: {userId: 3, name: 'ФИО', email: 'test@test.com'}
        }
        const commit = vi.fn();
        vi.spyOn(SocketEmit, 'registrationEmit').mockResolvedValue(responseData);
        await actions.registration({commit}, requestData);
        expect(SocketEmit.registrationEmit).toHaveBeenCalledWith(requestData);
        expect(commit).toHaveBeenCalledWith('setAuthData', responseData);
        vi.restoreAllMocks();
    })
    it('Action.registration.negative', async () => {
        const commit = vi.fn();
        const mockError = new Error('Network error');
        vi.spyOn(SocketEmit, 'registrationEmit').mockRejectedValue(mockError);
        await actions.registration({commit}, {});
        expect(setError).toHaveBeenCalledWith(mockError);
        vi.restoreAllMocks();
    })
})