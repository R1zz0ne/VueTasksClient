import {taskPriorityMap, taskStatusMap} from "../utils/constants.ts";
import {IUser} from "./userModels.ts";
import {IPageInfo} from "./otherModels.ts";

export interface ITaskResponse {
    taskId: number,
    name: string,
    description: string,
    priority: ITaskPriorityMap,
    completionDate: object, //Date имеет тип object
    project: {
        projectId: number,
        name: string
    },
    member: {
        userId: number,
        name: string,
        email: string
    },
    status: ITaskStatusMap,
    editor: {
        userId: number,
        name: string
    } | null
}

export type ITaskStatusMap = keyof typeof taskStatusMap
export type ITaskPriorityMap = keyof typeof taskPriorityMap

export interface ITaskRequest {
    name: string,
    description: string,
    priority: string,
    completionDate: any,
    projectId: number,
    member: number
}

export interface ITaskShort extends Omit<ITaskResponse, 'description' | 'project'> {

}

export interface ITaskRequestUpdStatus extends Pick<ITaskResponse, 'taskId' | 'status'> {

}

export interface ITaskModuleState {
    currentTask: ITaskResponse,
    taskList: ITaskList[],
    taskListMode: 'active' | 'completed',
    taskRoom: Pick<IUser, 'userId' | 'name'>[],
    pageInfo: IPageInfo
}

export interface ITaskUpdateRequest extends ITaskRequest {
    taskId: number,
    status: ITaskStatusMap
}

export interface ITaskList extends Pick<ITaskResponse, 'taskId' | 'name' | 'priority' | 'status'> {
}

export interface IConvTaskList {
    taskId: number,
    name: string,
    priority: string,
    status: string
}

export type ITaskListKey = keyof IConvTaskList

export interface ITaskListFilter {
    status: ITaskStatusMap | null,
    priority: ITaskPriorityMap | null
}

export interface ITaskUpdateEditor {
    taskId: number,
    editor: number | null
}

export interface ITaskInfoInList {
    taskId: number,
    name?: string,
    priority?: ITaskPriorityMap
    status?: ITaskStatusMap
}