import {io, Socket} from "socket.io-client";
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
import {ICheckNotificationLog} from "../models/notificationModels.ts";
import {ISocketEmitResponse} from "../models/otherModels.ts";
import {isErrorResponse} from "../utils/constants.ts";

export class SocketEmit {
    socket: Socket = io('ws://localhost:5000', {
        auth: {
            accessToken: localStorage.getItem('token') as string
        },
    })

    async #createPromiseEmit<TRes, TData>(event: string, data: TData, isRetry: boolean = false): Promise<TRes> {
        return new Promise((resolve, reject): void => {
            this.socket.emit(event, data, async (response: ISocketEmitResponse<TRes>): Promise<void> => {
                if (isErrorResponse(response)) {
                    if (response.statusCode === 401 && !isRetry) {
                        try {
                            await this.refreshEmit({refreshToken: localStorage.getItem('refresh')});
                            const retryResponse: Awaited<TRes> = await this.#createPromiseEmit<TRes, TData>(event, data, true)
                            resolve(retryResponse);
                        } catch (e: unknown) {
                            reject(e);
                        }
                    } else if (response.statusCode === 401 && isRetry) {
                        reject(response);
                    } else if (response.statusCode !== 401) {
                        reject(response);
                    }
                } else {
                    resolve(response as TRes);
                }
            })
        })
    }

    async loginEmit(data: IAuthForm): Promise<IAuthResponse> {
        const response = await this.#createPromiseEmit<IAuthResponse, IAuthForm>('login', data);
        (this.socket.auth as Pick<IAuthResponse, 'accessToken'>).accessToken = response.accessToken;
        this.socket.disconnect().connect();
        return response
    }

    async registrationEmit(data: IRegForm): Promise<IAuthResponse> {
        const response = await this.#createPromiseEmit<IAuthResponse, IRegForm>('registration', data);
        (this.socket.auth as Pick<IAuthResponse, 'accessToken'>).accessToken = response.accessToken;
        this.socket.disconnect().connect();
        return response
    }

    async logoutEmit(data: { refreshToken: string | null }): Promise<Object> {
        return await this.#createPromiseEmit<Object, { refreshToken: string | null }>('logout', data);
    }

    async refreshEmit(data: { refreshToken: string | null }): Promise<IAuthResponse> {
        const response = await this.#createPromiseEmit<IAuthResponse, { refreshToken: string | null }>('refresh', data);
        (this.socket.auth as Pick<IAuthResponse, 'accessToken'>).accessToken = response.accessToken;
        this.socket.disconnect().connect();
        return response
    }

    async getUsersEmit(data: { query: string }): Promise<IUser[]> {
        return await this.#createPromiseEmit<IUser[], { query: string }>('getUsers', data);
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
        return await this.#createPromiseEmit<IProjectResponse, { projectId: number }>('getProject', data);
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
        return await this.#createPromiseEmit<ITaskResponse, { taskId: number }>('getTask', data);
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

    async checkNotificationEmit(notificationId: number): Promise<ICheckNotificationLog> {
        return await this.#createPromiseEmit<ICheckNotificationLog, {
            notificationId: number
        }>('checkNotification', {notificationId});
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