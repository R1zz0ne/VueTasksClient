import {Module} from "vuex";
import {INotification, INotificationsModuleState} from "../../models/NotificationModels.ts";

export const NotificationModule: Module<INotificationsModuleState, any> = {
    namespaced: true,
    state: () => ({
        notifications: []
    }),
    mutations: {
        setNotification(state, error: Omit<INotification, 'isChecked'>) {
            state.notifications.push({...error, isChecked: false});
        }
    }
}