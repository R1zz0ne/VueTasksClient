import {io} from "socket.io-client";
import {IAuthForm, IAuthResponse, IRegForm} from "../models/UserModels.ts";
import {ICreateProjectEmit, IDataForUpdateProject, IProjectUpdateEditor} from "../models/ProjectModels.ts";
import {ITaskRequest, ITaskRequestUpdStatus, ITaskUpdateEditor, ITaskUpdateRequest} from "../models/TaskModels.ts";


class SocketEmit {
    socket = io('ws://localhost:5000', {
        auth: {
            accessToken: localStorage.getItem('token') as string
        },
    })

    async #createPromiseEmit(event: string, data: any, isRetry = false): Promise<any> {
        return new Promise((resolve, reject) => {
            this.socket.emit(event, data, async (response: any) => {
                if (response.type === 'error' && response.message === 'Пользователь не авторизован' && !isRetry) {
                    try {
                        await this.refreshEmit({refreshToken: localStorage.getItem('refresh')});
                        const retryResponse = await this.#createPromiseEmit(event, data, true)
                        resolve(retryResponse);
                    } catch (e) {
                        reject(e);
                    }
                } else if (response.type === 'error' && response.message !== 'Пользователь не авторизован') {
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
        const response = await this.#createPromiseEmit('refresh', data);
        (this.socket.auth as Pick<IAuthResponse, 'accessToken'>).accessToken = response.accessToken;
        this.socket.disconnect().connect();
        return response
    }

    async getUsersEmit(data: { query: string }): Promise<any> {
        return await this.#createPromiseEmit('getUsers', data);
    }

    //projects
    createProjectEmit(data: ICreateProjectEmit): void {
        // return await this.#createPromiseEmit('createProject', data);
        this.socket.emit('createProject', data)
    }

    updateProjectEmit(data: IDataForUpdateProject): void {
        this.socket.emit('updateProject', data);
    }

    async getProjectListEmit(page: number): Promise<any> {
        this.socket.emit('getProjectList', {page})
    }

    async getProjectEmit(data: { projectId: number }): Promise<any> {
        return await this.#createPromiseEmit('getProject', data);
    }

    createTaskEmit(data: ITaskRequest): void {
        this.socket.emit('createTask', data)
    }

    updateStatusTaskEmit(data: ITaskRequestUpdStatus): void {
        this.socket.emit('updateStatusTask', data);
    }

    updateProjectEditor(data: IProjectUpdateEditor): void {
        this.socket.emit('updateProjectEditor', data);
    }

    //tasks
    async getTaskEmit(data: { taskId: number }): Promise<any> {
        return await this.#createPromiseEmit('getTask', data);
    }

    updateTaskEmit(data: ITaskUpdateRequest): void {
        this.socket.emit('updateTask', data)
    }

    updateTaskEditor(data: ITaskUpdateEditor): void {
        this.socket.emit('updateTaskEditor', data);
    }

    async getTaskListEmit(page: number): Promise<any> {
        this.socket.emit('getTaskList', {page})
    }

    async getCloseTaskListEmit(page: number): Promise<any> {
        this.socket.emit('getCloseTaskList', {page})
    }

    //notification
    getNotificationLogEmit() {
        this.socket.emit('getNotification', null);
    }

    async checkNotificationEmit(notification_id: number): Promise<any> {
        return await this.#createPromiseEmit('checkNotification', {notification_id});
    }

    //Room
    joinRoom(data: { type: string, id?: number }): void {
        this.socket.emit('joinRoom', data);
    }

    leaveRoom(data: { type: string, id?: number }): void {
        this.socket.emit('leaveRoom', data);
    }
}

export default new SocketEmit();