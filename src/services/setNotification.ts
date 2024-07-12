import {store} from "../store/store.ts"
import {INotification} from "../models/NotificationModels.ts";

export function setNotification(notificationObj: Pick<INotification, 'message' | 'type'>) {
    store.commit('notificationModule/setNotification', {
        ...notificationObj
    })
}