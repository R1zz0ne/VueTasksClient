import {Store} from "vuex";
import SocketEmit from "./socketEmit.ts";
import {setError} from "../services/setError.ts";
import {INotificationsLog} from "../models/notificationModels.ts";
import {ITaskList, ITaskRequestUpdStatus, ITaskResponse} from "../models/taskModels.ts";
import {IUser} from "../models/userModels.ts";
import {IProject, IProjectList} from "../models/projectModels.ts";
import {Router} from "vue-router";

const socket = SocketEmit.socket;

const setupSocketListeners = (store: Store<any>, router: Router) => {
    socket.on('error', (data) => {
        setError(data)
    })

    //notificationLog
    socket.on('getNotification', async (data: INotificationsLog[]) => {
        await store.dispatch('notificationModule/getNotificationLog', data)
    })

    socket.on('getNewNotification', async (data: INotificationsLog) => {
        await store.dispatch('notificationModule/getNewNotificationLog', data)
    })

    //tasks
    socket.on('taskRoom', async (data: Pick<IUser, 'userId' | 'name'>[]) => {
        await store.dispatch('taskModule/setTaskRoom', data)
    })

    socket.on('createTask', async (data: ITaskResponse) => {
        await store.dispatch('projectModule/createTaskAC', data)
    })

    socket.on('updateTask', async (data: ITaskResponse) => {
        await store.dispatch('taskModule/updateTaskAC', data)
        if (store.state.projectModule.currentProject.projectId) {
            await store.dispatch('projectModule/updateTaskAC', data)
        }
    })

    socket.on('updateTaskEditor', async (data: Pick<ITaskResponse, 'taskId' | 'editor'>) => {
        await store.dispatch('taskModule/updateTaskEditor', data)
    })

    socket.on('updateStatusTask', async (data: ITaskRequestUpdStatus) => {
        if (store.state.projectModule.currentProject.projectId) {
            await store.dispatch('projectModule/updateTaskAC', data)
        }
        await store.dispatch('taskModule/updateStatusTask', data)
    })

    socket.on('taskTotalCount', async (data: { totalCount: number }) => {
        await store.dispatch('taskModule/setTotalRecords', data)
    })

    socket.on('getTaskList', async (data: ITaskList[]) => {
        await store.dispatch('taskModule/getTaskListAC', data)
    })

    socket.on('getCloseTaskList', async (data: ITaskList[]) => {
        await store.dispatch('taskModule/getCloseTaskListAC', data)
    })

    socket.on('addNewTaskInList', async (data: ITaskList) => {
        await store.dispatch('taskModule/addNewTaskInList', data)
    })

    //projects
    socket.on('createProject', async (data: IProject) => {
        await store.dispatch('projectModule/createProjectAC', data)
        await router.push(`/projects/${data.projectId}`)
    })

    socket.on('projectRoom', async (data: Pick<IUser, 'userId' | 'name'>[]) => {
        await store.dispatch('projectModule/setProjectRoom', data)
    })

    socket.on('updateProject', async (data: Omit<IProject, 'tasks'>) => {
        await store.dispatch('projectModule/updateProjectAC', data)
    })

    socket.on('boardRoom', async (data: Pick<IUser, 'userId' | 'name'>) => {
        await store.dispatch('projectModule/setBoardRoom', data)
    })

    socket.on('updateProjectEditor', async (data: Pick<IProject, 'projectId' | 'editor'>) => {
        await store.dispatch('projectModule/updateProjectEditor', data)
    })

    socket.on('projectTotalCount', async (data: { totalCount: number }) => {
        await store.dispatch('projectModule/setTotalRecords', data)
    })

    socket.on('getProjectList', async (data: IProjectList[]) => {
        await store.dispatch('projectModule/getProjectListAC', data)
    })

    socket.on('addNewProjectInList', async (data: IProjectList) => {
        await store.dispatch('projectModule/addNewProjectInList', data)
    })
}

export default setupSocketListeners;