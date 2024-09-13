import {taskPriorityMap, taskStatusMap} from "../utils/constants.ts";
import {IUser} from "./UserModels.ts";
import {IPageInfo} from "./otherModels.ts";

export interface ITaskResponse {
    task_id: number,
    name: string,
    description: string,
    priority: ITaskPriorityMap,
    complation_date: object, //Date имеет тип object
    project: {
        project_id: number,
        name: string
    },
    member: {
        user_id: number,
        name: string,
        email: string
    },
    status: ITaskStatusMap,
    editor: {
        user_id: number,
        name: string
    } | null
}

export type ITaskStatusMap = keyof typeof taskStatusMap
export type ITaskPriorityMap = keyof typeof taskPriorityMap

export interface ITaskRequest {
    name: string,
    description: string,
    priority: string,
    complation_date: any,
    project_id: number,
    member: number
}

export interface ITaskShort extends Omit<ITaskResponse, 'description' | 'project'> {

}

export interface ITaskRequestUpdStatus extends Pick<ITaskResponse, 'task_id' | 'status'> {

}

export interface ITaskModuleState {
    currentTask: ITaskResponse,
    taskList: ITaskList[],
    taskListMode: 'active' | 'completed',
    taskRoom: Pick<IUser, 'user_id' | 'name'>[],
    pageInfo: IPageInfo
}

export interface ITaskUpdateRequest extends ITaskRequest {
    task_id: number,
    status: ITaskStatusMap
}

export interface ITaskList extends Pick<ITaskResponse, 'task_id' | 'name' | 'priority' | 'status'> {
}

export interface IConvTaskList {
    task_id: number,
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
    task_id: number,
    editor: number | null
}

export interface ITaskInfoInList {
    task_id: number,
    name?: string,
    priority?: ITaskPriorityMap
    status?: ITaskStatusMap
}