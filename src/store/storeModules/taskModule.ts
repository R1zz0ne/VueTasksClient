import {Commit, Module} from "vuex";
import {
    ITaskInfoInList,
    ITaskList,
    ITaskModuleState, ITaskRequestUpdStatus,
    ITaskResponse
} from "../../models/taskModels.ts";
import {setError} from "../../services/setError.ts";
import SocketEmit from "../../api/socketEmit.ts";
import {IUser} from "../../models/userModels.ts";
import {State} from "../store.ts";

export const TaskModule: Module<ITaskModuleState, State> = {
    namespaced: true,
    state: (): ITaskModuleState => ({
        currentTask: {} as ITaskResponse,
        taskList: [] as ITaskList[],
        taskListMode: 'active',
        taskRoom: [] as Pick<IUser, 'userId' | 'name'>[],
        pageInfo: {
            page: 1,
            totalPages: 0,
            totalRecords: 0
        }
    }),
    getters: {},
    mutations: {
        setCurrentTask(state: ITaskModuleState, task: ITaskResponse): void {
            state.currentTask = {...task};
        },
        updateTask(state: ITaskModuleState, task: ITaskResponse): void {
            if (state.currentTask.taskId === task.taskId) {
                state.currentTask = {...task};
            }
        },
        setTaskList(state: ITaskModuleState, taskList: ITaskList[]): void {
            if (state.taskList.length < state.pageInfo.totalRecords) {
                state.taskList = [...state.taskList, ...taskList];
            }
        },
        cleanTaskList(state: ITaskModuleState): void {
            state.taskList = []
        },
        updateTaskInfoInList(state: ITaskModuleState, task: ITaskInfoInList): void {
            const index: number = state.taskList.findIndex((taskInArr: ITaskList): boolean => taskInArr.taskId === task.taskId)
            if (index !== -1) {
                task.status ? state.taskList[index].status = task.status : null
                task.name ? state.taskList[index].name = task.name : null
                task.priority ? state.taskList[index].priority = task.priority : null
            }
        },
        setTaskRoom(state: ITaskModuleState, userList: Pick<IUser, 'userId' | 'name'>[]): void {
            state.taskRoom = [...userList]
        },
        updateTaskEditor(state: ITaskModuleState, data: Pick<ITaskResponse, 'taskId' | 'editor'>): void {
            if (state.currentTask.taskId === data.taskId) {
                state.currentTask.editor = data.editor?.userId ? {...data.editor} : data.editor;
            }
        },
        updateStatusTask(state: ITaskModuleState, task: ITaskRequestUpdStatus): void {
            if (task.taskId === state.currentTask.taskId) {
                state.currentTask.status = task.status;
            }
        },
        setCurrentPage(state: ITaskModuleState, page: number): void {
            state.pageInfo.page = page;
        },
        setTotalRecords(state: ITaskModuleState, totalRecords: number): void {
            const totalPages: number = Math.ceil(totalRecords / 20);
            state.pageInfo.totalRecords = totalRecords;
            state.pageInfo.totalPages = totalPages;
        },
        setTaskListMode(state: ITaskModuleState, taskListMode: 'active' | 'completed'): void {
            state.taskListMode = taskListMode;
        },
        addNewTaskInList(state: ITaskModuleState, task: ITaskList): void {
            const isLastPage: boolean = state.pageInfo.totalPages === state.pageInfo.page;
            const countInLastPage: number = (state.pageInfo.page * 20) - state.pageInfo.totalRecords;
            const totalRecords: number = state.pageInfo.totalRecords + 1;
            const totalPages: number = Math.ceil(totalRecords / 20);
            if (isLastPage && countInLastPage > 0) {
                state.taskList = [...state.taskList, task]
            } else if (state.pageInfo.totalPages === 0) {
                state.taskList = [...state.taskList, task]
            }
            state.pageInfo.totalRecords = totalRecords;
            state.pageInfo.totalPages = totalPages;
        }
    },
    actions: {
        async getTaskAC({commit}: { commit: Commit }, taskId: number): Promise<void> {
            try {
                const response: ITaskResponse = await SocketEmit.getTaskEmit({taskId})
                commit('setCurrentTask', response);
            } catch (e: unknown) {
                setError(e)
            }
        },
        updateTaskAC({commit}: { commit: Commit }, data: ITaskResponse): void {
            commit('updateTask', data)
            commit('updateTaskInfoInList', data)
        },
        getTaskListAC({commit}: { commit: Commit }, data: ITaskList[]): void {
            commit('setTaskList', data)
        },
        getCloseTaskListAC({commit}: { commit: Commit }, data: ITaskList[]): void {
            commit('setTaskList', data)
        },
        setTaskRoom({commit}: { commit: Commit }, users: Pick<IUser, 'userId' | 'name'>[]): void {
            commit('setTaskRoom', users)
        },
        updateTaskEditor({commit}: { commit: Commit }, data: Pick<ITaskResponse, 'taskId' | 'editor'>): void {
            commit('updateTaskEditor', data)
        },
        updateStatusTask({commit, state}: { commit: Commit, state: ITaskModuleState },
                         data: ITaskRequestUpdStatus): void {
            if (state.currentTask.taskId) {
                commit('updateStatusTask', data)
            }
            commit('updateTaskInfoInList', data)
        },
        setTotalRecords({commit}: { commit: Commit }, data: { totalCount: number }): void {
            commit('setTotalRecords', data.totalCount)
        },
        resetAction({commit}: { commit: Commit }): void {
            commit('setCurrentTask', {})
            commit('setTaskRoom', [])
            commit('cleanTaskList')
            commit('setCurrentPage', 1)
            commit('setTotalRecords', 0)
        },
        addNewTaskInList({commit, state}: { commit: Commit, state: ITaskModuleState }, data: ITaskList): void {
            if (data.status === 'completed' && state.taskListMode === 'completed') {
                commit('addNewTaskInList', data)
            } else if (data.status !== 'completed' && state.taskListMode === 'active') {
                commit('addNewTaskInList', data)
            }
        }
    }
}