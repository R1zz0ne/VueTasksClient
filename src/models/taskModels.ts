import {taskPriorityMap, taskStatusMap} from "../utils/constants.ts";
import {IUser} from "./userModels.ts";
import {IPageInfo} from "./otherModels.ts";

export interface ITaskModuleState {
    currentTask: ITaskResponse,
    taskList: ITaskList[],
    taskListMode: 'active' | 'completed',
    taskRoom: Pick<IUser, 'userId' | 'name'>[],
    pageInfo: IPageInfo
}

export interface ITaskResponse {
    taskId: number,
    name: string,
    description: string,
    priority: ITaskPriorityMap,
    completionDate: string,
    project: {
        projectId: number,
        name: string
    },
    member: IUser,
    status: ITaskStatusMap,
    editor: Pick<IUser, 'userId' | 'name'> | null
}

export type ITaskStatusMap = keyof typeof taskStatusMap
export type ITaskPriorityMap = keyof typeof taskPriorityMap

export interface ITaskRequest {
    name: string,
    description: string,
    priority: string,
    completionDate: string,
    projectId: number,
    member: number
}

export interface ITaskShort extends Omit<ITaskResponse, 'description' | 'project'> {

}

export interface ITaskRequestUpdStatus extends Pick<ITaskResponse, 'taskId' | 'status'> {

}

export interface ITaskUpdateRequest extends Omit<ITaskRequest, 'completionDate'> {
    completionDate: Date,
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

export interface ITaskInfoInBoard {
    assigned: ITaskShort[],
    inProgress: ITaskShort[],
    completed: ITaskShort[]
}

export type ITaskVisibleMode = 'view' | 'edit'

export interface ICreateTaskForm extends Pick<ITaskRequest, 'name' | 'description' | 'priority'> {
    completionDate: string,
    member: Pick<IUser, 'userId' | 'name'>
}

export interface IUpdateTaskForm extends Pick<ITaskResponse, 'taskId' | 'name' | 'description' | 'priority' | 'project' | 'status'> {
    completionDate: Date,
    member: Pick<IUser, 'userId' | 'name'>
}

export type ITaskListMode = 'active' | 'completed'