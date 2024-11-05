import {createStore} from "vuex";
import {UserModule} from "./storeModules/userModule.ts";
import {NotificationModule} from "./storeModules/notificationModule.ts";
import {ProjectModule} from "./storeModules/projectModule.ts";
import {TaskModule} from "./storeModules/taskModule.ts"
import {IUserModuleState} from "../models/userModels.ts";
import {INotificationsModuleState} from "../models/notificationModels.ts";
import {IProjectModuleState} from "../models/projectModels.ts";
import {ITaskModuleState} from "../models/taskModels.ts";
// import {InjectionKey} from "vue";

export interface State {
    userModule: IUserModuleState,
    notificationModule: INotificationsModuleState,
    projectModule: IProjectModuleState,
    taskModule: ITaskModuleState
}

// export const key: InjectionKey<Store<State>> = Symbol()

export const store = createStore({
    modules: {
        userModule: UserModule,
        notificationModule: NotificationModule,
        projectModule: ProjectModule,
        taskModule: TaskModule
    },
})