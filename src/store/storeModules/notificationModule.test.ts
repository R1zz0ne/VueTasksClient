import {describe, it, expect, vi,} from "vitest";
import {store} from "../store.ts";
import {NotificationModule} from "./notificationModule.ts";
import {INotificationsModuleState} from "../../models/notificationModels.ts";
import SocketEmit from "../../api/socketEmit.ts";
import {setError} from "../../services/setError.ts";

vi.mock('../../api/socketEmit.ts', () => ({
    default: {
        checkNotificationEmit: vi.fn()  // Мокаем только метод checkNotificationEmit
    }
}));
vi.mock("../../services/setError.ts", () => ({
    setError: vi.fn()
}));

describe('Store.NotificationModule', () => {
    it('Инициализация', () => {
        expect(store.state.notificationModule.notificationLog).toEqual([]);
        expect(store.state.notificationModule.actionNotifications).toEqual([])
    })

    it('Mutation.setActionNotification', () => {
        const state: INotificationsModuleState = {
            actionNotifications: [],
            notificationLog: []
        }
        const message_1 = {message: 'Собщение 1', type: 'error'};
        const message_2 = {message: 'Сообщение 2', type: 'info'};
        const message_3 = {message: 'Сообщение 3', type: 'success'};
        const message_4 = {message: 'Сообщение 4', type: 'warning'};
        expect(state.actionNotifications).toEqual([]);
        (NotificationModule.mutations as NonNullable<typeof NotificationModule.mutations>)
            .setActionNotification(state, message_1);
        expect(state.actionNotifications[0]).not.toBe(message_1); //Проверяем что это не ссылка
        expect(state.actionNotifications).toEqual([message_1]);
        (NotificationModule.mutations as NonNullable<typeof NotificationModule.mutations>)
            .setActionNotification(state, message_2);
        expect(state.actionNotifications[1]).not.toBe(message_2);
        (NotificationModule.mutations as NonNullable<typeof NotificationModule.mutations>)
            .setActionNotification(state, message_3);
        expect(state.actionNotifications[2]).not.toBe(message_3);
        (NotificationModule.mutations as NonNullable<typeof NotificationModule.mutations>)
            .setActionNotification(state, message_4);
        expect(state.actionNotifications[3]).not.toBe(message_4);
        expect(state.actionNotifications).toEqual([message_1, message_2, message_3, message_4])
    })

    it('Mutation.setNotificationLog', () => {
        const state: INotificationsModuleState = {
            actionNotifications: [],
            notificationLog: []
        }
        expect(state.notificationLog).toEqual([]);
        const logArrayOneEl = [{
            notificationId: 1, taskId: 331, name: 'Задача 1',
            message: 'Задача назначена вам', isChecked: false, createdAt: '2025-01-20'
        }];
        (NotificationModule.mutations as NonNullable<typeof NotificationModule.mutations>)
            .setNotificationLog(state, logArrayOneEl);
        expect(state.notificationLog).not.toBe(logArrayOneEl);
        expect(state.notificationLog).toEqual(logArrayOneEl);
        const logArrayTwoEl = [{
            notificationId: 1, taskId: 331, name: 'Задача 1',
            message: 'Задача назначена вам', isChecked: true, createdAt: '2025-01-20'
        }, {
            notificationId: 2, taskId: 331, name: 'Задача 1',
            message: 'Задача больше не назначена вам', isChecked: false, createdAt: '2025-01-21'
        }];
        (NotificationModule.mutations as NonNullable<typeof NotificationModule.mutations>)
            .setNotificationLog(state, logArrayTwoEl);
        expect(state.notificationLog).not.toBe(logArrayTwoEl);
        expect(state.notificationLog).toEqual(logArrayTwoEl);
    })

    it('Mutation.setNewNotificationLog', () => {
        const initNotificationLog = [{
            notificationId: 1, taskId: 331, name: 'Задача 1',
            message: 'Задача назначена вам', isChecked: true, createdAt: '2025-01-20'
        }, {
            notificationId: 2, taskId: 331, name: 'Задача 1',
            message: 'Задача больше не назначена вам', isChecked: false, createdAt: '2025-01-21'
        }]
        const newNotificationLog = {
            notificationId: 3, taskId: 331, name: 'Задача 1',
            message: 'Задача назначена вам', isChecked: false, createdAt: '2025-01-22'
        }
        const state: INotificationsModuleState = {
            actionNotifications: [],
            notificationLog: [...initNotificationLog]
        }
        expect(state.notificationLog).toEqual(initNotificationLog);
        (NotificationModule.mutations as NonNullable<typeof NotificationModule.mutations>)
            .setNewNotificationLog(state, newNotificationLog)
        expect(state.notificationLog[2]).not.toBe(newNotificationLog);
        expect(state.notificationLog).toEqual([...initNotificationLog, newNotificationLog]);
    })

    it('Mutation.updateCheckStatus.positive', () => {
        const initNotificationLog = [
            {notificationId: 1, taskId: 331, name: '1', message: '1', isChecked: true, createdAt: '2025-01-20'},
            {notificationId: 2, taskId: 331, name: '1', message: '2', isChecked: false, createdAt: '2025-01-21'},
            {notificationId: 3, taskId: 331, name: '1', message: '3', isChecked: false, createdAt: '2025-01-22'}
        ];
        const expectNotificationLog_1 = [
            {notificationId: 1, taskId: 331, name: '1', message: '1', isChecked: false, createdAt: '2025-01-20'},
            {notificationId: 2, taskId: 331, name: '1', message: '2', isChecked: false, createdAt: '2025-01-21'},
            {notificationId: 3, taskId: 331, name: '1', message: '3', isChecked: false, createdAt: '2025-01-22'}
        ];
        const expectNotificationLog_2 = [
            {notificationId: 1, taskId: 331, name: '1', message: '1', isChecked: false, createdAt: '2025-01-20'},
            {notificationId: 2, taskId: 331, name: '1', message: '2', isChecked: false, createdAt: '2025-01-21'},
            {notificationId: 3, taskId: 331, name: '1', message: '3', isChecked: true, createdAt: '2025-01-22'}
        ];
        const state: INotificationsModuleState = {
            actionNotifications: [],
            notificationLog: [...initNotificationLog]
        };
        const dataTrue = {notificationId: 1, isChecked: false};
        const dataFalse = {notificationId: 3, isChecked: true};
        (NotificationModule.mutations as NonNullable<typeof NotificationModule.mutations>)
            .updateCheckStatus(state, dataTrue);
        expect(state.notificationLog).not.toBe(expectNotificationLog_1);
        expect(state.notificationLog).toEqual(expectNotificationLog_1);
        (NotificationModule.mutations as NonNullable<typeof NotificationModule.mutations>)
            .updateCheckStatus(state, dataFalse);
        expect(state.notificationLog).not.toBe(expectNotificationLog_2);
        expect(state.notificationLog).toEqual(expectNotificationLog_2);
    })

    it('Mutation.updateCheckStatus.negative', () => {
        const initNotificationLog = [
            {notificationId: 1, taskId: 331, name: '1', message: '1', isChecked: false, createdAt: '2025-01-20'},
            {notificationId: 2, taskId: 331, name: '1', message: '2', isChecked: false, createdAt: '2025-01-21'},
            {notificationId: 3, taskId: 331, name: '1', message: '3', isChecked: false, createdAt: '2025-01-22'}
        ];
        const state: INotificationsModuleState = {
            actionNotifications: [],
            notificationLog: [...initNotificationLog]
        };
        const dataTrue = {notificationId: 5, isChecked: true};
        (NotificationModule.mutations as NonNullable<typeof NotificationModule.mutations>)
            .updateCheckStatus(state, dataTrue);
        expect(state.notificationLog).toEqual(initNotificationLog);
    })

    it('Action.getNotificationLog', async () => {
        const notificationLogData = [
            {notificationId: 1, taskId: 331, name: '1', message: '1', isChecked: true, createdAt: '2025-01-20'},
            {notificationId: 2, taskId: 331, name: '1', message: '2', isChecked: false, createdAt: '2025-01-21'},
            {notificationId: 3, taskId: 331, name: '1', message: '3', isChecked: false, createdAt: '2025-01-22'}
        ];
        const commit = vi.fn();
        const actions = NotificationModule.actions as Record<string, Function>
        await actions.getNotificationLog({commit}, notificationLogData);
        expect(commit).toHaveBeenCalledWith('setNotificationLog', notificationLogData);
    })

    it('Action.getNewNotificationLog', async () => {
        const notificationLogData = {
            notificationId: 1, taskId: 331, name: 'Задача 1',
            message: 'Задача назначена вам', isChecked: false, createdAt: '2025-01-22'
        }
        const commit = vi.fn();
        const actions = NotificationModule.actions as Record<string, Function>
        await actions.getNewNotificationLog({commit}, notificationLogData);
        expect(commit).toHaveBeenCalledWith('setNewNotificationLog', notificationLogData);
    })

    it('Action.checkNotification.resolve', async () => {
        const commit = vi.fn();
        const requestData = {notificationId: 1};
        const responseData = {notificationId: 1, isChecked: true};
        //Мокаем успешный ответ
        vi.spyOn(SocketEmit, 'checkNotificationEmit').mockResolvedValue(responseData);
        const actions = NotificationModule.actions as Record<string, Function>
        await actions.checkNotification({commit}, requestData);
        expect(commit).toHaveBeenCalledWith('updateCheckStatus', responseData);
        vi.restoreAllMocks();
    })

    it('Action.checkNotification.reject', async () => {
        const commit = vi.fn();
        const requestData = {notificationId: 1};
        const mockError = new Error('Network error');
        //Мокаем ошибочный ответ
        vi.spyOn(SocketEmit, 'checkNotificationEmit').mockRejectedValue(mockError);
        const actions = NotificationModule.actions as Record<string, Function>
        await actions.checkNotification({commit}, requestData);
        expect(setError).toHaveBeenCalledWith(mockError)
        vi.restoreAllMocks();
    })
})