import {taskPriorityMap, taskStatusMap} from "../utils/constants.ts";

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
    status: ITaskStatusMap
}

export type ITaskStatusMap = keyof typeof taskStatusMap
export type ITaskPriorityMap = keyof typeof taskPriorityMap

export interface ITaskRequest {
    name: string,
    description: string,
    priority: number,
    complation_date: object,
    project_id: number,
    member: number
}

export interface ITaskShort extends Omit<ITaskResponse, 'description' | 'project'> {

}

export interface ITaskRequestUpdStatus extends Pick<ITaskResponse, 'task_id' | 'status'> {

}

export interface ITaskModuleState {
    currentTask: ITaskResponse,
    taskList: ITaskList[]
}

export interface ITaskUpdateRequest extends ITaskRequest {
    task_id: number
}

export interface ITaskList extends Pick<ITaskResponse, 'task_id' | 'name' | 'priority' | 'status'> {}