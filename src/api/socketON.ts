import {Store} from "vuex";
import SocketEmit from "./socketEmit.ts";
import {setError} from "../services/setError.ts";
import {INotificationsLog} from "../models/notificationModels.ts";
import {ITaskList, ITaskRequestUpdStatus, ITaskResponse} from "../models/taskModels.ts";
import {IUser} from "../models/userModels.ts";
import {IProject, IProjectList} from "../models/projectModels.ts";
import {Router} from "vue-router";
import {State} from "../store/store.ts";
import {Socket} from "socket.io-client";
import {IError} from "../models/otherModels.ts";

const socket: Socket = SocketEmit.socket;

const setupSocketListeners = (store: Store<State>, router: Router): void => {
    socket.on('error', (data: IError): void => {
        setError(data)
    })

    //notificationLog
    socket.on('getNotification', async (data: INotificationsLog[]): Promise<void> => {
        await store.dispatch('notificationModule/getNotificationLog', data)
    })

    socket.on('getNewNotification', async (data: INotificationsLog): Promise<void> => {
        await store.dispatch('notificationModule/getNewNotificationLog', data)
    })

    //tasks
    socket.on('taskRoom', async (data: Pick<IUser, 'userId' | 'name'>[]): Promise<void> => {
        await store.dispatch('taskModule/setTaskRoom', data)
    })

    socket.on('createTask', async (data: ITaskResponse): Promise<void> => {
        await store.dispatch('projectModule/createTaskAC', data)
    })

    socket.on('updateTask', async (data: ITaskResponse): Promise<void> => {
        await store.dispatch('taskModule/updateTaskAC', data)
        if (store.state.projectModule.currentProject.projectId) {
            await store.dispatch('projectModule/updateTaskAC', data)
        }
    })

    socket.on('updateTaskEditor', async (data: Pick<ITaskResponse, 'taskId' | 'editor'>): Promise<void> => {
        await store.dispatch('taskModule/updateTaskEditor', data)
    })

    socket.on('updateStatusTask', async (data: ITaskRequestUpdStatus): Promise<void> => {
        if (store.state.projectModule.currentProject.projectId) {
            await store.dispatch('projectModule/updateTaskAC', data)
        }
        await store.dispatch('taskModule/updateStatusTask', data)
    })

    socket.on('taskTotalCount', async (data: { totalCount: number }): Promise<void> => {
        await store.dispatch('taskModule/setTotalRecords', data)
    })

    socket.on('getTaskList', async (data: ITaskList[]): Promise<void> => {
        await store.dispatch('taskModule/getTaskListAC', data)
    })

    socket.on('getCloseTaskList', async (data: ITaskList[]): Promise<void> => {
        await store.dispatch('taskModule/getCloseTaskListAC', data)
    })

    socket.on('addNewTaskInList', async (data: ITaskList): Promise<void> => {
        await store.dispatch('taskModule/addNewTaskInList', data)
    })

    //projects
    socket.on('createProject', async (data: IProject): Promise<void> => {
        await store.dispatch('projectModule/createProjectAC', data)
        await router.push(`/projects/${data.projectId}`)
    })

    socket.on('projectRoom', async (data: Pick<IUser, 'userId' | 'name'>[]): Promise<void> => {
        await store.dispatch('projectModule/setProjectRoom', data)
    })

    socket.on('updateProject', async (data: Omit<IProject, 'tasks'>): Promise<void> => {
        await store.dispatch('projectModule/updateProjectAC', data)
    })

    socket.on('boardRoom', async (data: Pick<IUser, 'userId' | 'name'>): Promise<void> => {
        await store.dispatch('projectModule/setBoardRoom', data)
    })

    socket.on('updateProjectEditor', async (data: Pick<IProject, 'projectId' | 'editor'>): Promise<void> => {
        await store.dispatch('projectModule/updateProjectEditor', data)
    })

    socket.on('projectTotalCount', async (data: { totalCount: number }): Promise<void> => {
        await store.dispatch('projectModule/setTotalRecords', data)
    })

    socket.on('getProjectList', async (data: IProjectList[]): Promise<void> => {
        await store.dispatch('projectModule/getProjectListAC', data)
    })

    socket.on('addNewProjectInList', async (data: IProjectList): Promise<void> => {
        await store.dispatch('projectModule/addNewProjectInList', data)
    })
}

export default setupSocketListeners;