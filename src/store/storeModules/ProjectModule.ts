import {Module} from "vuex";
import {setError} from "../../services/setError.ts";
import {
    ICreateProjectEmit, IDataForUpdateProject,
    IProject,
    IProjectList,
    IProjectModuleState
} from "../../models/ProjectModels.ts";
import {ITaskResponse, ITaskShort} from "../../models/TaskModels.ts";
import SocketEmit from "../../api/socketEmit.ts";
import {IUser} from "../../models/UserModels.ts";

export const ProjectModule: Module<IProjectModuleState, any> = {
    namespaced: true,
    state: () => ({
        currentProject: {} as IProject,
        projectList: [] as IProjectList[],
        projectRoom: [] as Pick<IUser, 'user_id' | 'name'>[],
        boardRoom: [] as Pick<IUser, 'user_id' | 'name'>[]
    }),
    getters: {},
    mutations: {
        setProjectList(state, projectList: IProjectList[]) {
            state.projectList = projectList;
        },
        updateProjectInfoInList(state, project: IDataForUpdateProject) {
            const index = state.projectList.findIndex((projectInArr) =>
                projectInArr.project_id === project.project_id)
            if (index !== -1) {
                project.name ? state.projectList[index].name = project.name : null
            }
        },
        setCurrentProject(state, project: IProject) {
            state.currentProject = project;
        },
        updateCurrentProject(state, project: Omit<IProject, 'tasks'>) {
            if (state.currentProject.project_id === project.project_id) {
                state.currentProject.name = project.name;
                state.currentProject.description = project.description;
                state.currentProject.owner = project.owner;
            }
        },
        setTaskInCurrentProject(state, task: ITaskResponse) {
            state.currentProject.tasks.push(task)
        },
        updateTask(state, task: Partial<ITaskShort>) {
            const index = state.currentProject.tasks.findIndex((taskInArr) => taskInArr.task_id === task.task_id);
            if (index !== -1) {
                task.name ? state.currentProject.tasks[index].name = task.name : null;
                task.priority ? state.currentProject.tasks[index].priority = task.priority : null;
                task.complation_date ? state.currentProject.tasks[index].complation_date = task.complation_date : null;
                task.member ? state.currentProject.tasks[index].member = task.member : null;
                task.status ? state.currentProject.tasks[index].status = task.status : null;
                task.editor ? state.currentProject.tasks[index].editor = task.editor : null;
            }
        },
        setProjectRoom(state, userList: Pick<IUser, 'user_id' | 'name'>[]) {
            state.projectRoom = userList;
        },
        setBoardRoom(state, userList: Pick<IUser, 'user_id' | 'name'>[]) {
            state.boardRoom = userList;
        },
        updateProjectEditor(state, data: Pick<IProject, 'project_id' | 'editor'>) {
            if (state.currentProject.project_id === data.project_id) {
                state.currentProject.editor = data.editor;
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
                commit('updateCurrentProject', data)
                commit('updateProjectInfoInList', data)
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
        async createTaskAC({commit}, data: ITaskResponse) {
            try {
                commit('setTaskInCurrentProject', data)
            } catch (e) {
                setError(e);
            }
        },
        async updateTaskAC({commit}, data: Partial<ITaskShort>) {
            try {
                commit('updateTask', data)
            } catch (e) {
                setError(e)
            }
        },
        async setProjectRoom({commit}, users: Pick<IUser, 'user_id' | 'name'>[]) {
            commit('setProjectRoom', users)
        },
        async setBoardRoom({commit}, users: Pick<IUser, 'user_id' | 'name'>[]) {
            commit('setBoardRoom', users)
        },
        async updateProjectEditor({commit}, data: Pick<IProject, 'project_id' | 'editor'>) {
            try {
                commit('updateProjectEditor', data)
            } catch (e) {
                setError(e)
            }
        }
    }
}