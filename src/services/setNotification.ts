import {store} from "../store/store.ts"
import {IActionNotification} from "../models/NotificationModels.ts";

export function setNotification(notificationObj: Pick<IActionNotification, 'message' | 'type'>) {
    store.commit('notificationModule/setActionNotification', {
        ...notificationObj
    })
}