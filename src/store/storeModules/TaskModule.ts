import {Module} from "vuex";
import {
    ITaskInfoInList,
    ITaskList,
    ITaskModuleState, ITaskRequestUpdStatus,
    ITaskResponse
} from "../../models/TaskModels.ts";
import {setError} from "../../services/setError.ts";
import SocketEmit from "../../api/socketEmit.ts";
import {IUser} from "../../models/UserModels.ts";

export const TaskModule: Module<ITaskModuleState, any> = {
    namespaced: true,
    state: () => ({
        currentTask: {} as ITaskResponse,
        taskList: [] as ITaskList[],
        taskRoom: [] as Pick<IUser, 'user_id' | 'name'>[]
    }),
    getters: {},
    mutations: {
        setCurrentTask(state, task: ITaskResponse) {
            state.currentTask = task;
        },
        updateTask(state, task: ITaskResponse) {
            if (state.currentTask.task_id === task.task_id) {
                state.currentTask = task;
            }
        },
        setTaskList(state, taskList: ITaskList[]) {
            state.taskList = taskList;
        },
        updateTaskInfoInList(state, task: ITaskInfoInList) {
            const index = state.taskList.findIndex((taskInArr) => taskInArr.task_id === task.task_id)
            if (index !== -1) {
                task.status ? state.taskList[index].status = task.status : null
                task.name ? state.taskList[index].name = task.name : null
                task.priority ? state.taskList[index].priority = task.priority : null
            }
        },
        setTaskRoom(state, userList: Pick<IUser, 'user_id' | 'name'>[]) {
            state.taskRoom = userList
        },
        updateTaskEditor(state, data: Pick<ITaskResponse, 'task_id' | 'editor'>) {
            if (state.currentTask.task_id === data.task_id) {
                state.currentTask.editor = data.editor;
            }
        },
        updateStatusTask(state, task: ITaskRequestUpdStatus) {
            if (task.task_id === state.currentTask.task_id) {
                state.currentTask.status = task.status;
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
        async getTaskListAC({commit}) {
            try {
                const response: ITaskList[] = await SocketEmit.getTaskListEmit();
                commit('setTaskList', response)
            } catch (e) {
                setError(e)
            }
        },
        async getCloseTaskListAC({commit}) {
            try {
                const response: ITaskList[] = await SocketEmit.getCloseTaskListEmit();
                commit('setTaskList', response)
            } catch (e) {
                setError(e)
            }
        },
        async setTaskRoom({commit}, users: Pick<IUser, 'user_id' | 'name'>[]) {
            try {
                commit('setTaskRoom', users)
            } catch (e) {
                setError(e)
            }
        },
        async updateTaskEditor({commit}, data: Pick<ITaskResponse, 'task_id' | 'editor'>) {
            try {
                commit('updateTaskEditor', data)
            } catch (e) {
                setError(e)
            }
        },
        async updateStatusTask({commit, state}, data: ITaskRequestUpdStatus) {
            try {
                if (state.currentTask.task_id) {
                    commit('updateStatusTask', data)
                }
                commit('updateTaskInfoInList', data)
            } catch (e) {
                setError(e)
            }
        }
    }
}