import {io} from "socket.io-client";
import {IAuthForm, IAuthResponse, IRegForm, IUser} from "../models/userModels.ts";
import {
    ICreateProjectEmit,
    IDataForUpdateProject,
    IProjectResponse,
    IProjectUpdateEditor
} from "../models/projectModels.ts";
import {
    ITaskRequest,
    ITaskRequestUpdStatus,
    ITaskResponse,
    ITaskUpdateEditor,
    ITaskUpdateRequest
} from "../models/taskModels.ts";
import {INotificationsLog} from "../models/notificationModels.ts";


class SocketEmit {
    socket = io('ws://localhost:5000', {
        auth: {
            accessToken: localStorage.getItem('token') as string
        },
    })

    async #createPromiseEmit(event: string, data: any, isRetry: boolean = false): Promise<any> {
        return new Promise((resolve, reject) => {
            this.socket.emit(event, data, async (response: any) => {
                if (response.type === 'error' && response.message === 'Пользователь не авторизован' && !isRetry) { //TODO: Делать сравнение по коду
                    try {
                        await this.refreshEmit({refreshToken: localStorage.getItem('refresh')});
                        const retryResponse = await this.#createPromiseEmit(event, data, true)
                        resolve(retryResponse);
                    } catch (e) {
                        reject(e);
                    }
                } else if (response.type === 'error' && response.message !== 'Пользователь не авторизован') { //TODO: Делать сравнение по коду
                    reject(response);
                } else {
                    resolve(response);
                }
            })
        })
    }

    async loginEmit(data: IAuthForm): Promise<IAuthResponse> {
        const response: IAuthResponse = await this.#createPromiseEmit('login', data);
        (this.socket.auth as Pick<IAuthResponse, 'accessToken'>).accessToken = response.accessToken;
        this.socket.disconnect().connect();
        return response
    }

    async registrationEmit(data: IRegForm): Promise<IAuthResponse> {
        const response: IAuthResponse = await this.#createPromiseEmit('registration', data);
        (this.socket.auth as Pick<IAuthResponse, 'accessToken'>).accessToken = response.accessToken;
        this.socket.disconnect().connect();
        return response
    }

    async logoutEmit(data: { refreshToken: string | null }): Promise<[]> {
        return await this.#createPromiseEmit('logout', data);
    }

    async refreshEmit(data: { refreshToken: string | null }): Promise<IAuthResponse> {
        const response: IAuthResponse = await this.#createPromiseEmit('refresh', data);
        (this.socket.auth as Pick<IAuthResponse, 'accessToken'>).accessToken = response.accessToken;
        this.socket.disconnect().connect();
        return response
    }

    async getUsersEmit(data: { query: string }): Promise<IUser[]> {
        return await this.#createPromiseEmit('getUsers', data);
    }

    //projects
    createProjectEmit(data: ICreateProjectEmit): void {
        this.socket.emit('createProject', data)
    }

    updateProjectEmit(data: IDataForUpdateProject): void {
        this.socket.emit('updateProject', data);
    }

    async getProjectListEmit(page: number): Promise<void> {
        this.socket.emit('getProjectList', {page})
    }

    async getProjectEmit(data: { projectId: number }): Promise<IProjectResponse> {
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
    async getTaskEmit(data: { taskId: number }): Promise<ITaskResponse> {
        return await this.#createPromiseEmit('getTask', data);
    }

    updateTaskEmit(data: ITaskUpdateRequest): void {
        this.socket.emit('updateTask', data)
    }

    updateTaskEditor(data: ITaskUpdateEditor): void {
        this.socket.emit('updateTaskEditor', data);
    }

    async getTaskListEmit(page: number): Promise<void> {
        this.socket.emit('getTaskList', {page})
    }

    async getCloseTaskListEmit(page: number): Promise<void> {
        this.socket.emit('getCloseTaskList', {page})
    }

    //notification
    getNotificationLogEmit(): void {
        this.socket.emit('getNotification', null);
    }

    async checkNotificationEmit(notificationId: number): Promise<Pick<INotificationsLog, 'notificationId' | 'isChecked'>> {
        return await this.#createPromiseEmit('checkNotification', {notificationId});
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