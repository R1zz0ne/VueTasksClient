import {Store} from "vuex";
import SocketEmit from "./socketEmit.ts";
import {setError} from "../services/setError.ts";
import {INotificationsLog} from "../models/NotificationModels.ts";
import {ITaskList, ITaskRequestUpdStatus, ITaskResponse} from "../models/TaskModels.ts";
import {IUser} from "../models/UserModels.ts";
import {IProject, IProjectList} from "../models/ProjectModels.ts";
import {Router} from "vue-router";

const socket = SocketEmit.socket;

const setupSocketListeners = (store: Store<any>, router: Router) => {
    socket.on('error', (data) => {
        setError(data)
    })

    //notification_log
    socket.on('getNotification', async (data: INotificationsLog[]) => {
        await store.dispatch('notificationModule/getNotificationLog', data)
    })

    socket.on('getNewNotification', async (data: INotificationsLog) => {
        await store.dispatch('notificationModule/getNewNotificationLog', data)
    })

    //tasks
    socket.on('task_room', async (data: Pick<IUser, 'user_id' | 'name'>[]) => {
        await store.dispatch('taskModule/setTaskRoom', data)
    })

    socket.on('createTask', async (data: ITaskResponse) => {
        await store.dispatch('projectModule/createTaskAC', data)
    })

    socket.on('updateTask', async (data: ITaskResponse) => {
        await store.dispatch('taskModule/updateTaskAC', data)
        if (store.state.projectModule.currentProject.project_id) {
            await store.dispatch('projectModule/updateTaskAC', data)
        }
    })

    socket.on('updateTaskEditor', async (data: Pick<ITaskResponse, 'task_id' | 'editor'>) => {
        await store.dispatch('taskModule/updateTaskEditor', data)
    })

    socket.on('updateStatusTask', async (data: ITaskRequestUpdStatus) => {
        if (store.state.projectModule.currentProject.project_id) {
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
        await router.push(`/projects/${data.project_id}`)
    })

    socket.on('project_room', async (data: Pick<IUser, 'user_id' | 'name'>[]) => {
        await store.dispatch('projectModule/setProjectRoom', data)
    })

    socket.on('updateProject', async (data: Omit<IProject, 'tasks'>) => {
        await store.dispatch('projectModule/updateProjectAC', data)
    })

    socket.on('board_room', async (data: Pick<IUser, 'user_id' | 'name'>) => {
        await store.dispatch('projectModule/setBoardRoom', data)
    })

    socket.on('updateProjectEditor', async (data: Pick<IProject, 'project_id' | 'editor'>) => {
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