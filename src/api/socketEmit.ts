import {io} from "socket.io-client";
import {IAuthForm, IAuthResponse, IRegForm} from "../models/UserModels.ts";
import {ICreateProjectEmit, IDataForUpdateProject} from "../models/ProjectModels.ts";
import {ITaskRequest, ITaskRequestUpdStatus, ITaskUpdateRequest} from "../models/TaskModels.ts";
import {useStore} from "vuex";


/*TODO: сейчас есть проблема с тем, что когда токен истекает и выполняется refresh, то в текущем экземпляре socket
   нельза переопределить заголовки. При выполнении refresh и получении нового токена необходимо создавать новый
   экземпляр класса
   //Возможно есть какое-то другое решение, я пока что его не нашел
 */
class SocketEmit {
    socket = io('ws://localhost:5000', {
        extraHeaders: {
            accessToken: localStorage.getItem('token') as string
        }
    })

    async #createPromiseEmit(event: string, data: any, isRetry = false): Promise<any> {
        return new Promise((resolve, reject) => {
            this.socket.emit(event, data, async (response: any) => {
                if (response.type === 'error' && response.message === 'Пользователь не авторизован' && !isRetry) {
                    try {
                        const response: IAuthResponse = await this.refreshEmit({refreshToken: localStorage.getItem('refresh')});
                        useStore().commit('userModule/setAuthData', response)
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

    //notification
    getNotificationLogEmit() {
        this.socket.emit('getNotification', null);
    }

    async checkNotificationEmit(notification_id: number): Promise<any> {
        return await this.#createPromiseEmit('checkNotification', {notification_id});
    }
}

export default new SocketEmit();