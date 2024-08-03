import {io} from "socket.io-client";
import {IAuthForm, IRegForm} from "../models/UserModels.ts";
import {ICreateProjectEmit, IDataForUpdateProject} from "../models/ProjectModels.ts";
import {ITaskRequest, ITaskRequestUpdStatus, ITaskUpdateRequest} from "../models/TaskModels.ts";

class SocketEmit {
    socket = io('ws://localhost:5000', {
        extraHeaders: {
            accessToken: localStorage.getItem('token') as string
        }
    })

    async #createPromiseEmit(event: string, data: any): Promise<any> {
        return new Promise((resolve, reject) => {
            this.socket.emit(event, data, (response: any) => {
                if (response.type === 'error') {
                    reject(response);
                } else {
                    resolve(response);
                }
            })
        })
    }

    async loginEmit(data: IAuthForm): Promise<any> {
        return await this.#createPromiseEmit('login', data);
    }

    async registrationEmit(data: IRegForm): Promise<any> {
        return await this.#createPromiseEmit('registration', data);
    }

    async logoutEmit(data: { refreshToken: string | null }): Promise<any> {
        return await this.#createPromiseEmit('logout', data);
    }

    async refreshEmit(data: { refreshToken: string | null }): Promise<any> {
        return await this.#createPromiseEmit('refresh', data);
    }

    async getUsersEmit(data: { query: string }): Promise<any> {
        return await this.#createPromiseEmit('getUsers', data);
    }

    //projects
    async createProjectEmit(data: ICreateProjectEmit): Promise<any> {
        return await this.#createPromiseEmit('createProject', data);
    }

    async updateProjectEmit(data: IDataForUpdateProject): Promise<any> {
        return await this.#createPromiseEmit('updateProject', data);
    }

    async getProjectListEmit(): Promise<any> {
        return await this.#createPromiseEmit('getProjectList', null)
    }

    async getProjectEmit(data: { projectId: number }): Promise<any> {
        return await this.#createPromiseEmit('getProject', data);
    }

    async createTaskEmit(data: ITaskRequest): Promise<any> {
        return await this.#createPromiseEmit('createTask', data);
    }

    async updateStatusTaskEmit(data: ITaskRequestUpdStatus): Promise<any> {
        return await this.#createPromiseEmit('updateStatusTask', data);
    }

    //tasks
    async getTaskEmit(data: { taskId: number }): Promise<any> {
        return await this.#createPromiseEmit('getTask', data);
    }

    async updateTaskEmit(data: ITaskUpdateRequest): Promise<any> {
        return await this.#createPromiseEmit('updateTask', data);
    }

    async getTaskListEmit(): Promise<any> {
        return await this.#createPromiseEmit('getTaskList', null);
    }

    async getCloseTaskListEmit(): Promise<any> {
        return await this.#createPromiseEmit('getCloseTaskList', null);
    }
}

export default new SocketEmit();