import {createStore} from "vuex";
import {UserModule} from "./storeModules/UserModule.ts";
import {NotificationModule} from "./storeModules/NotificationModule.ts";
import {ProjectModule} from "./storeModules/ProjectModule.ts";
import {TaskModule} from "./storeModules/TaskModule.ts"

export const store = createStore({
    modules: {
        userModule: UserModule,
        notificationModule: NotificationModule,
        projectModule: ProjectModule,
        taskModule: TaskModule
    },
})