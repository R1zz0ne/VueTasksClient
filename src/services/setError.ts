import {setNotification} from "./setNotification.ts";

export function setError(data: any) {
    if (data.response) {
        setNotification({
            message: data.response.data.message,
            type: 'error'
        })
    } else {
        setNotification({
            message: data.message,
            type: 'error'
        })
    }
}