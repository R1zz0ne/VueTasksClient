import {Module} from "vuex";
import {ITaskList, ITaskModuleState, ITaskResponse, ITaskUpdateRequest} from "../../models/TaskModels.ts";
import {AxiosResponse} from "axios";
import ApiTasks from "../../api/apiTasks.ts";
import {setError} from "../../services/setError.ts";

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
                const response: AxiosResponse<ITaskResponse> = await ApiTasks.getTaskInfo(taskId);
                commit('setCurrentTask', response.data);
            } catch (e) {
                setError(e)
            }
        },
        async updateTaskAC({commit}, task: ITaskUpdateRequest) {
            try {
                const response: AxiosResponse<ITaskResponse> = await ApiTasks.updateTask(task);
                commit('updateTask', response.data)
                commit('updateTaskInfoInList', response.data)
            } catch (e) {
                setError(e)
            }
        },
        async getTaskListAC({commit}) {
            try {
                const response: AxiosResponse<ITaskList[]> = await ApiTasks.getMyTaskList();
                commit('setTaskList', response.data)
            } catch (e) {
                setError(e)
            }
        },
        async getCloseTaskListAC({commit}) {
            try {
                const response: AxiosResponse<ITaskList[]> = await ApiTasks.getClosemyTaskList();
                commit('setTaskList', response.data)
            } catch (e) {
                setError(e)
            }
        }
    }
}