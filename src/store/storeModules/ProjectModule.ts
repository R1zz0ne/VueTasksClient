import {Module} from "vuex";
import ApiProjects from "../../api/apiProjects.ts";
import {AxiosResponse} from "axios";
import {setError} from "../../services/setError.ts";
import {IDataForUpdateProject, IProject, IProjectList, IProjectModuleState} from "../../models/ProjectModels.ts";
import {ITaskRequest, ITaskRequestUpdStatus, ITaskResponse} from "../../models/TaskModels.ts";
import ApiTasks from "../../api/apiTasks.ts";
import {setNotification} from "../../services/setNotification.ts";

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
        async createProjectAC({commit}, object: Omit<IDataForUpdateProject, 'id'>) {
            try {
                const response: AxiosResponse<Omit<IProject, 'tasks'>> = await ApiProjects.createProject(object.name,
                    object.description, object.ownerId);
                commit('setCurrentProject', {...response.data, tasks: []})
                return response.data
            } catch (e) {
                setError(e)
                // throw e
            }
        },
        async updateProjectAC({commit}, object: IDataForUpdateProject) {
            try {
                const response: AxiosResponse<Omit<IProject, 'tasks'>> = await ApiProjects.updateProject(object.project_id,
                    object.name, object.description, object.ownerId);
                commit('setCurrentProject', {...response.data})
                return response.data
            } catch (e) {
                setError(e)
            }
        },
        async getProjectListAC({commit}) {
            try {
                const response: AxiosResponse<IProjectList[]> = await ApiProjects.getProjectList();
                commit('setProjectList', response.data)
            } catch (e) {
                setError(e)
            }
        },
        async getProjectAC({commit}, projectId: number) {
            try {
                const response: AxiosResponse = await ApiProjects.getProject(projectId);
                commit('setCurrentProject', response.data);
            } catch (e) {
                setError(e)
            }
        },
        async createTaskAC({commit}, taskObj: ITaskRequest) {
            try {
                const response: AxiosResponse<ITaskResponse> = await ApiTasks.createTask(taskObj);
                commit('setTaskInCurrentProject', response.data)
            } catch (e) {
                setError(e);
            }
        },
        async updateStatusTaskAC({commit}, taskObj: ITaskRequestUpdStatus) {
            try {
                const response: AxiosResponse<ITaskRequestUpdStatus> = await ApiTasks.updateStatusTask(taskObj);
                commit('updateStatusTask', response.data)
            } catch (e) {
                setError(e)
            }
        }
    }
}