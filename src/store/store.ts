import {createStore} from "vuex";
import {UserModule} from "./UserModule.ts";
import {ErrorModule} from "./ErrorModule.ts";

export const store = createStore({
    modules: {
        userModule: UserModule,
        errorModule: ErrorModule
    },
})