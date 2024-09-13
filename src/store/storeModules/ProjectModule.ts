import {Module} from "vuex";
import {setError} from "../../services/setError.ts";
import {
    IDataForUpdateProject,
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
        boardRoom: [] as Pick<IUser, 'user_id' | 'name'>[],
        pageInfo: {
            page: 1,
            totalPages: 0,
            totalRecords: 0
        }
    }),
    getters: {},
    mutations: {
        setProjectList(state, projectList: IProjectList[]) {
            state.projectList = [...state.projectList, ...projectList];
        },
        cleanProjectList(state) {
            state.projectList = []
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
        },
        setCurrentPage(state, page: number) {
            state.pageInfo.page = page;
        },
        setTotalRecords(state, totalRecords: number) {
            const totalPages = Math.ceil(totalRecords / 20);
            state.pageInfo.totalRecords = totalRecords;
            state.pageInfo.totalPages = totalPages;
        },
        addNewProjectInList(state, project: IProjectList) {
            const isLastPage: boolean = state.pageInfo.totalPages === state.pageInfo.page;
            const countInLastPage: number = (state.pageInfo.page * 20) - state.pageInfo.totalRecords;
            const totalRecords: number = state.pageInfo.totalRecords + 1
            const totalPages: number = Math.ceil(totalRecords / 20);
            state.pageInfo.totalRecords = totalRecords;
            state.pageInfo.totalPages = totalPages;
            if (isLastPage && countInLastPage > 0) {
                state.projectList = [...state.projectList, project];
            }
        }
    },
    actions: {
        async createProjectAC({commit}, data: IProject) {
            try {
                commit('setCurrentProject', {...data})
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
        async getProjectListAC({commit}, data: IProjectList[]) {
            try {
                commit('setProjectList', data)
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
        },
        async setTotalRecords({commit}, data: { totalCount: number }) {
            try {
                commit('setTotalRecords', data.totalCount)
            } catch (e) {
                setError(e)
            }
        },
        async resetProjectAction({commit}) {
            commit('setProjectRoom', [])
            commit('cleanProjectList')
            commit('setCurrentPage', 1)
            commit('setTotalRecords', 0)
        },
        async addNewProjectInList({commit}, data: IProjectList) {
            commit('addNewProjectInList', data)
        }
    }
}