import {Store} from "vuex";
import SocketEmit from "./socketEmit.ts";
import {setError} from "../services/setError.ts";
import {INotificationsLog} from "../models/NotificationModels.ts";

const socket = SocketEmit.socket;


const setupSocketListeners = (store: Store<any>) => {
    socket.on('error', (data) => {
        setError(data)
    })

    socket.on('getNotification', async (data: INotificationsLog[]) => {
        await store.dispatch('notificationModule/getNotificationLog', data)
    })

    socket.on('getNewNotification', async (data: INotificationsLog) => {
        await store.dispatch('notificationModule/getNewNotificationLog', data)
    })
}

export default setupSocketListeners;