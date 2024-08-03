import {Store} from "vuex";
import SocketEmit from "./socketEmit.ts";
import {setError} from "../services/setError.ts";

const socket = SocketEmit.socket;


const setupSocketListeners = (store: Store<any>) => {
    socket.on('error', (data) => {
        setError(data)
    })
}

export default setupSocketListeners;