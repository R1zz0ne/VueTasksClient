import {Module} from "vuex";
import {IActionNotification, INotificationsLog, INotificationsModuleState} from "../../models/NotificationModels.ts";
import SocketEmit from "../../api/socketEmit.ts";
import {setError} from "../../services/setError.ts";

export const NotificationModule: Module<INotificationsModuleState, any> = {
    namespaced: true,
    state: () => ({
        actionNotifications: [] as IActionNotification[],
        notification_log: [] as INotificationsLog[],
    }),
    mutations: {
        setActionNotification(state, data: IActionNotification) {
            state.actionNotifications.push({...data});
        },
        setNotificationLog(state, data: INotificationsLog[]) {
            state.notification_log = data;
        },
        setNewNotificationLog(state, data: INotificationsLog) {
            state.notification_log.push(data);
        },
        updateCheckStatus(state, data: Pick<INotificationsLog, 'notification_id' | 'is_checked'>) {
            const index = state.notification_log.findIndex((el) => el.notification_id === data.notification_id)
            if (index !== -1) {
                state.notification_log[index].is_checked = data.is_checked
            }
        }
    },
    actions: {
        async getNotificationLog({commit}, data: INotificationsLog[]) {
            commit('setNotificationLog', data);
        },
        async getNewNotificationLog({commit}, data: INotificationsLog) {
            commit('setNewNotificationLog', data);
        },
        async checkNotification({commit}, data: Pick<INotificationsLog, 'notification_id'>) {
            try {
                const response: Pick<INotificationsLog, 'notification_id' | 'is_checked'> =
                    await SocketEmit.checkNotificationEmit(data.notification_id);
                commit('updateCheckStatus', response)
            } catch (e) {
                setError(e)
            }
        }

    }
}