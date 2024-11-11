import {Commit, Module} from "vuex";
import {
    IActionNotification,
    INotificationsLog,
    INotificationsModuleState
} from "../../models/notificationModels.ts";
import SocketEmit from "../../api/socketEmit.ts";
import {setError} from "../../services/setError.ts";
import {State} from "../store.ts";

export const NotificationModule: Module<INotificationsModuleState, State> = {
    namespaced: true,
    state: (): INotificationsModuleState => ({
        actionNotifications: [] as IActionNotification[],
        notificationLog: [] as INotificationsLog[],
    }),
    mutations: {
        setActionNotification(state: INotificationsModuleState, data: IActionNotification): void {
            state.actionNotifications.push({...data});
        },
        setNotificationLog(state: INotificationsModuleState, data: INotificationsLog[]): void {
            state.notificationLog = data;
        },
        setNewNotificationLog(state: INotificationsModuleState, data: INotificationsLog): void {
            state.notificationLog.push(data);
        },
        updateCheckStatus(state: INotificationsModuleState, data: Pick<INotificationsLog, 'notificationId' | 'isChecked'>): void {
            const index: number = state.notificationLog.findIndex((el: INotificationsLog): boolean => el.notificationId === data.notificationId)
            if (index !== -1) {
                state.notificationLog[index].isChecked = data.isChecked
            }
        }
    },
    actions: {
        async getNotificationLog({commit}: { commit: Commit }, data: INotificationsLog[]): Promise<void> {
            commit('setNotificationLog', data);
        },
        async getNewNotificationLog({commit}: { commit: Commit }, data: INotificationsLog): Promise<void> {
            commit('setNewNotificationLog', data);
        },
        async checkNotification({commit}: {
            commit: Commit
        }, data: Pick<INotificationsLog, 'notificationId'>): Promise<void> {
            try {
                const response: Pick<INotificationsLog, 'notificationId' | 'isChecked'> =
                    await SocketEmit.checkNotificationEmit(data.notificationId);
                commit('updateCheckStatus', response)
            } catch (e: unknown) {
                setError(e)
            }
        }

    }
}