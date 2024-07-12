import $api from "./API.ts";
import {ITaskRequest, ITaskRequestUpdStatus, ITaskUpdateRequest} from "../models/TaskModels.ts";

export default class ApiTasks {
    static async createTask(taskObj: ITaskRequest) {
        return $api.post('/task', taskObj)
    }

    static async getTaskInfo(taskId: number) {
        return $api.get(`/taskInfo?id=${taskId}`)
    }

    static async updateTask(task: ITaskUpdateRequest) {
        return $api.post('/taskUpdate', task)
    }

    static async updateStatusTask(taskObj: ITaskRequestUpdStatus) {
        return $api.post('/taskStatusUpdate', taskObj)
    }

    static async getMyTaskList() {
        return $api.get('taskMyList')
    }

    static async getClosemyTaskList() {
        return $api.get('taskCloseMyList')
    }
}