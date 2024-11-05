import {Module} from "vuex";
import {
    ITaskInfoInList,
    ITaskList,
    ITaskModuleState, ITaskRequestUpdStatus,
    ITaskResponse
} from "../../models/taskModels.ts";
import {setError} from "../../services/setError.ts";
import SocketEmit from "../../api/socketEmit.ts";
import {IUser} from "../../models/userModels.ts";

export const TaskModule: Module<ITaskModuleState, any> = {
    namespaced: true,
    state: () => ({
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
        setCurrentTask(state, task: ITaskResponse) {
            state.currentTask = task;
            console.log(task)
        },
        updateTask(state, task: ITaskResponse) {
            if (state.currentTask.taskId === task.taskId) {
                state.currentTask = task;
            }
        },
        setTaskList(state, taskList: ITaskList[]) {
            if (state.taskList.length < state.pageInfo.totalRecords) {
                state.taskList = [...state.taskList, ...taskList];
            }
        },
        cleanTaskList(state) {
            state.taskList = []
        },
        updateTaskInfoInList(state, task: ITaskInfoInList) {
            const index = state.taskList.findIndex((taskInArr) => taskInArr.taskId === task.taskId)
            if (index !== -1) {
                task.status ? state.taskList[index].status = task.status : null
                task.name ? state.taskList[index].name = task.name : null
                task.priority ? state.taskList[index].priority = task.priority : null
            }
        },
        setTaskRoom(state, userList: Pick<IUser, 'userId' | 'name'>[]) {
            state.taskRoom = userList
        },
        updateTaskEditor(state, data: Pick<ITaskResponse, 'taskId' | 'editor'>) {
            if (state.currentTask.taskId === data.taskId) {
                state.currentTask.editor = data.editor;
            }
        },
        updateStatusTask(state, task: ITaskRequestUpdStatus) {
            if (task.taskId === state.currentTask.taskId) {
                state.currentTask.status = task.status;
            }
        },
        setCurrentPage(state, page: number) {
            state.pageInfo.page = page;
        },
        setTotalRecords(state, totalRecords: number) {
            const totalPages = Math.ceil(totalRecords / 20);
            state.pageInfo.totalRecords = totalRecords;
            state.pageInfo.totalPages = totalPages;
        },
        setTaskListMode(state, taskListMode: 'active' | 'completed') {
            state.taskListMode = taskListMode;
        },
        addNewTaskInList(state, task: ITaskList) {
            console.log(state.pageInfo.totalPages)
            const isLastPage: boolean = state.pageInfo.totalPages === state.pageInfo.page;
            const countInLastPage: number = (state.pageInfo.page * 20) - state.pageInfo.totalRecords;
            const totalRecords: number = state.pageInfo.totalRecords + 1;
            const totalPages = Math.ceil(totalRecords / 20);
            state.pageInfo.totalRecords = totalRecords;
            state.pageInfo.totalPages = totalPages;
            if (isLastPage && countInLastPage > 0) {
                state.taskList = [...state.taskList, task]
            } else if (state.pageInfo.totalPages === 0) {
                console.log(state.pageInfo.totalPages)
                state.taskList = [...state.taskList, task]
            }
        }
    },
    actions: {
        async getTaskAC({commit}, taskId: number) {
            try {
                const response: ITaskResponse = await SocketEmit.getTaskEmit({taskId})
                commit('setCurrentTask', response);
            } catch (e) {
                setError(e)
            }
        },
        async updateTaskAC({commit}, data: ITaskResponse) {
            try {
                commit('updateTask', data)
                commit('updateTaskInfoInList', data)
            } catch (e) {
                setError(e)
            }
        },
        async getTaskListAC({commit}, data: ITaskList[]) {
            try {
                commit('setTaskList', data)
            } catch (e) {
                setError(e)
            }
        },
        async getCloseTaskListAC({commit}, data: ITaskList[]) {
            try {
                commit('setTaskList', data)
            } catch (e) {
                setError(e)
            }
        },
        async setTaskRoom({commit}, users: Pick<IUser, 'userId' | 'name'>[]) {
            try {
                commit('setTaskRoom', users)
            } catch (e) {
                setError(e)
            }
        },
        async updateTaskEditor({commit}, data: Pick<ITaskResponse, 'taskId' | 'editor'>) {
            try {
                commit('updateTaskEditor', data)
            } catch (e) {
                setError(e)
            }
        },
        async updateStatusTask({commit, state}, data: ITaskRequestUpdStatus) {
            try {
                if (state.currentTask.taskId) {
                    commit('updateStatusTask', data)
                }
                commit('updateTaskInfoInList', data)
            } catch (e) {
                setError(e)
            }
        },
        async setTotalRecords({commit}, data: { totalCount: number }) {
            try {
                commit('setTotalRecords', data.totalCount)
            } catch (e) {
                setError(e)
            }
        },
        async resetAction({commit}) {
            try {
                commit('setCurrentTask', {})
                commit('setTaskRoom', [])
                commit('cleanTaskList')
                commit('setCurrentPage', 1)
                commit('setTotalRecords', 0)
            } catch (e) {
                setError(e)
            }
        },
        async addNewTaskInList({commit, state}, data: ITaskList) {
            if (data.status === 'completed' && state.taskListMode === 'completed') {
                commit('addNewTaskInList', data)
            } else if (data.status !== 'completed' && state.taskListMode === 'active') {
                commit('addNewTaskInList', data)
            }
        }
    }
}