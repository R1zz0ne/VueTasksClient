import {Module} from "vuex";
import {setError} from "../../services/setError.ts";
import {
    ICreateProjectEmit, IDataForUpdateProject,
    IProject,
    IProjectList,
    IProjectModuleState
} from "../../models/ProjectModels.ts";
import {ITaskRequest, ITaskRequestUpdStatus, ITaskResponse} from "../../models/TaskModels.ts";
import {setNotification} from "../../services/setNotification.ts";
import SocketEmit from "../../api/socketEmit.ts";

export const ProjectModule: Module<IProjectModuleState, any> = {
    namespaced: true,
    state: () => ({
        currentProject: {} as IProject,
        projectList: [] as IProjectList[],
    }),
    getters: {},
    mutations: {
        setProjectList(state, projectList: IProjectList[]) {
            state.projectList = projectList;
        },
        setCurrentProject(state, project: IProject) {
            state.currentProject = project;
        },
        updateCurrentProject(state, project: Omit<IProject, 'tasks'>) {
            if (state.currentProject.project_id === project.project_id) {
                state.currentProject.name = project.name;
                state.currentProject.description = project.description;
                state.currentProject.owner = project.owner;
            } else {
                setNotification({
                    message: 'currentProject в state не была обновлена из-за того что был открыт другой проект',
                    type: 'warning'
                })
            }
        },
        setTaskInCurrentProject(state, task: ITaskResponse) {
            state.currentProject.tasks.push(task)
        },
        updateStatusTask(state, task: ITaskRequestUpdStatus) {
            const index = state.currentProject.tasks.findIndex((taskInArr) => taskInArr.task_id === task.task_id);
            if (index !== -1) {
                state.currentProject.tasks[index].status = task.status;
            }
        }
    },
    actions: {
        async createProjectAC({commit, dispatch}, data: ICreateProjectEmit) {
            try {
                const response: IProject = await SocketEmit.createProjectEmit(data)
                commit('setCurrentProject', {...response})
                dispatch('getProjectListAC')
                return response
            } catch (e) {
                setError(e)
            }
        },
        async updateProjectAC({commit}, data: IDataForUpdateProject) {
            try {
                console.log(data)
                const response: Omit<IProject, 'tasks'> = await SocketEmit.updateProjectEmit(data)
                commit('setCurrentProject', {...response})
                return response
            } catch (e) {
                setError(e)
            }
        },
        async getProjectListAC({commit}) {
            try {
                const response: IProjectList[] = await SocketEmit.getProjectListEmit();
                commit('setProjectList', response)
            } catch (e) {
                setError(e)
            }
        },
        async getProjectAC({commit}, projectId: number) {
            try {
                const response: IProject = await SocketEmit.getProjectEmit({projectId});
                commit('setCurrentProject', response);
            } catch (e) {
                setError(e)
            }
        },
        async createTaskAC({commit}, data: ITaskRequest) {
            try {
                const response: ITaskResponse = await SocketEmit.createTaskEmit(data);
                commit('setTaskInCurrentProject', response)
            } catch (e) {
                setError(e);
            }
        },
        async updateStatusTaskAC({commit}, data: ITaskRequestUpdStatus) {
            try {
                const response: ITaskRequestUpdStatus = await SocketEmit.updateStatusTaskEmit(data);
                commit('updateStatusTask', response)
            } catch (e) {
                setError(e)
            }
        }
    }
}