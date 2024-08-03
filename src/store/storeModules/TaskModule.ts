import {Module} from "vuex";
import {ITaskList, ITaskModuleState, ITaskResponse, ITaskUpdateRequest} from "../../models/TaskModels.ts";
import {setError} from "../../services/setError.ts";
import SocketEmit from "../../api/socketEmit.ts";

export const TaskModule: Module<ITaskModuleState, any> = {
    namespaced: true,
    state: () => ({
        currentTask: {} as ITaskResponse,
        taskList: [] as ITaskList[]
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
        updateTaskInfoInList(state, task: ITaskResponse) {
            const index = state.taskList.findIndex((taskInArr) => taskInArr.task_id === task.task_id)
            if (index !== -1) {
                state.taskList[index].status = task.status
                state.taskList[index].name = task.name
                state.taskList[index].priority = task.priority
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
        async updateTaskAC({commit}, data: ITaskUpdateRequest) {
            try {
                const response: ITaskResponse = await SocketEmit.updateTaskEmit(data);
                commit('updateTask', response)
                commit('updateTaskInfoInList', response)
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
        }
    }
}