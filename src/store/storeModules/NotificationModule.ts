import {Module} from "vuex";
import {IActionNotification, INotificationsLog, INotificationsModuleState} from "../../models/NotificationModels.ts";

export const NotificationModule: Module<INotificationsModuleState, any> = {
    namespaced: true,
    state: () => ({
        actionNotifications: [] as IActionNotification[],
        notification_log: [] as INotificationsLog[],
    }),
    mutations: {
        setActionNotification(state, data: Omit<IActionNotification, 'isChecked'>) {
            state.actionNotifications.push({...data, isChecked: false});
        },
        setNotificationLog(state, data: INotificationsLog[]) {
            state.notification_log = data;
        },
        setNewNotificationLog(state, data: INotificationsLog) {
            state.notification_log.push(data);
        }
    },
    actions: {
        async getNotificationLog({commit}, data: INotificationsLog[]) {
            commit('setNotificationLog', data);
        },
        async getNewNotificationLog({commit}, data: INotificationsLog) {
            commit('setNewNotificationLog', data);
        }
    }
}