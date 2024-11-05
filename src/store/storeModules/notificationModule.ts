import {Module} from "vuex";
import {IActionNotification, INotificationsLog, INotificationsModuleState} from "../../models/notificationModels.ts";
import SocketEmit from "../../api/socketEmit.ts";
import {setError} from "../../services/setError.ts";

export const NotificationModule: Module<INotificationsModuleState, any> = {
    namespaced: true,
    state: () => ({
        actionNotifications: [] as IActionNotification[],
        notificationLog: [] as INotificationsLog[],
    }),
    mutations: {
        setActionNotification(state, data: IActionNotification) {
            state.actionNotifications.push({...data});
        },
        setNotificationLog(state, data: INotificationsLog[]) {
            state.notificationLog = data;
        },
        setNewNotificationLog(state, data: INotificationsLog) {
            state.notificationLog.push(data);
        },
        updateCheckStatus(state, data: Pick<INotificationsLog, 'notificationId' | 'isChecked'>) {
            const index = state.notificationLog.findIndex((el) => el.notificationId === data.notificationId)
            if (index !== -1) {
                state.notificationLog[index].isChecked = data.isChecked
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
        async checkNotification({commit}, data: Pick<INotificationsLog, 'notificationId'>) {
            try {
                const response: Pick<INotificationsLog, 'notificationId' | 'isChecked'> =
                    await SocketEmit.checkNotificationEmit(data.notificationId);
                commit('updateCheckStatus', response)
            } catch (e) {
                setError(e)
            }
        }

    }
}