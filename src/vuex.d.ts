// declare module "vuex" {
//     export * from "vuex/types/index.d.ts"
//     export * from "vuex/types/helpers.d.ts"
//     export * from "vuex/types/logger.d.ts"
//     export * from "vuex/types/vue.d.ts"
// }

import {Store} from "vuex"
import {IUserModuleState} from "./models/userModels.ts";
import {IProjectModuleState} from "./models/projectModels.ts";
import {ITaskModuleState} from "./models/taskModels.ts";
import {INotificationsModuleState} from "./models/notificationModels.ts";

declare module 'vue' {
    interface State {
        userModule: IUserModuleState,
        notificationModule: INotificationsModuleState,
        projectModule: IProjectModuleState,
        taskModule: ITaskModuleState
    }

    interface ComponentCustomProperties {
        $store: Store<State>
    }
}