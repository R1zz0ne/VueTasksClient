import {Commit, Module} from "vuex";
import {setError} from "../../services/setError.ts";
import {
    IDataForUpdateProject,
    IProject,
    IProjectList,
    IProjectModuleState, IProjectResponse
} from "../../models/projectModels.ts";
import {ITaskResponse, ITaskShort} from "../../models/taskModels.ts";
import SocketEmit from "../../api/socketEmit.ts";
import {IUser} from "../../models/userModels.ts";
import {State} from "../store.ts";

export const ProjectModule: Module<IProjectModuleState, State> = {
    namespaced: true,
    state: (): IProjectModuleState => ({
        currentProject: {} as IProject,
        projectList: [] as IProjectList[],
        projectRoom: [] as Pick<IUser, 'userId' | 'name'>[],
        boardRoom: [] as Pick<IUser, 'userId' | 'name'>[],
        pageInfo: {
            page: 1,
            totalPages: 0,
            totalRecords: 0
        }
    }),
    mutations: {
        setProjectList(state: IProjectModuleState, projectList: IProjectList[]): void {
            state.projectList = [...state.projectList, ...projectList];
        },
        cleanProjectList(state: IProjectModuleState): void {
            state.projectList = []
        },
        updateProjectInfoInList(state: IProjectModuleState, project: IDataForUpdateProject): void {
            const index: number = state.projectList.findIndex((projectInArr: IProjectList): boolean =>
                projectInArr.projectId === project.projectId)
            if (index !== -1) {
                project.name ? state.projectList[index].name = project.name : null
            }
        },
        setCurrentProject(state: IProjectModuleState, project: IProject): void {
            state.currentProject = project;
        },
        updateCurrentProject(state: IProjectModuleState, project: Omit<IProject, 'tasks'>): void {
            if (state.currentProject.projectId === project.projectId) {
                state.currentProject.name = project.name;
                state.currentProject.description = project.description;
                state.currentProject.owner = project.owner;
            }
        },
        setTaskInCurrentProject(state: IProjectModuleState, task: ITaskResponse): void {
            state.currentProject.tasks.push(task)
        },
        updateTask(state: IProjectModuleState, task: Partial<ITaskShort>): void {
            const index: number = state.currentProject.tasks.findIndex((taskInArr: ITaskShort): boolean => taskInArr.taskId === task.taskId);
            if (index !== -1) {
                task.name ? state.currentProject.tasks[index].name = task.name : null;
                task.priority ? state.currentProject.tasks[index].priority = task.priority : null;
                task.completionDate ? state.currentProject.tasks[index].completionDate = task.completionDate : null;
                task.member ? state.currentProject.tasks[index].member = task.member : null;
                task.status ? state.currentProject.tasks[index].status = task.status : null;
                task.editor ? state.currentProject.tasks[index].editor = task.editor : null;
            }
        },
        setProjectRoom(state: IProjectModuleState, userList: Pick<IUser, 'userId' | 'name'>[]): void {
            state.projectRoom = userList;
        },
        setBoardRoom(state: IProjectModuleState, userList: Pick<IUser, 'userId' | 'name'>[]): void {
            state.boardRoom = userList;
        },
        updateProjectEditor(state: IProjectModuleState, data: Pick<IProject, 'projectId' | 'editor'>): void {
            if (state.currentProject.projectId === data.projectId) {
                state.currentProject.editor = data.editor;
            }
        },
        setCurrentPage(state: IProjectModuleState, page: number): void {
            state.pageInfo.page = page;
        },
        setTotalRecords(state: IProjectModuleState, totalRecords: number): void {
            const totalPages: number = Math.ceil(totalRecords / 20);
            state.pageInfo.totalRecords = totalRecords;
            state.pageInfo.totalPages = totalPages;
        },
        addNewProjectInList(state: IProjectModuleState, project: IProjectList): void {
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
        async createProjectAC({commit}: { commit: Commit }, data: IProject): Promise<void> {
            try {
                commit('setCurrentProject', {...data})
            } catch (e: unknown) {
                setError(e)
            }
        },
        async updateProjectAC({commit}: { commit: Commit }, data: IDataForUpdateProject): Promise<void> {
            try {
                commit('updateCurrentProject', data)
                commit('updateProjectInfoInList', data)
            } catch (e: unknown) {
                setError(e)
            }
        },
        async getProjectListAC({commit}: { commit: Commit }, data: IProjectList[]): Promise<void> {
            try {
                commit('setProjectList', data)
            } catch (e: unknown) {
                setError(e)
            }
        },
        async getProjectAC({commit}: { commit: Commit }, projectId: number): Promise<void> {
            try {
                const response: IProjectResponse = await SocketEmit.getProjectEmit({projectId});
                commit('setCurrentProject', response);
            } catch (e: unknown) {
                setError(e)
            }
        },
        async createTaskAC({commit}: { commit: Commit }, data: ITaskResponse): Promise<void> {
            try {
                commit('setTaskInCurrentProject', data)
            } catch (e: unknown) {
                setError(e);
            }
        },
        async updateTaskAC({commit}: { commit: Commit }, data: Partial<ITaskShort>): Promise<void> {
            try {
                commit('updateTask', data)
            } catch (e: unknown) {
                setError(e)
            }
        },
        async setProjectRoom({commit}: { commit: Commit }, users: Pick<IUser, 'userId' | 'name'>[]): Promise<void> {
            commit('setProjectRoom', users)
        },
        async setBoardRoom({commit}: { commit: Commit }, users: Pick<IUser, 'userId' | 'name'>[]): Promise<void> {
            commit('setBoardRoom', users)
        },
        async updateProjectEditor({commit}: {
            commit: Commit
        }, data: Pick<IProject, 'projectId' | 'editor'>): Promise<void> {
            try {
                commit('updateProjectEditor', data)
            } catch (e: unknown) {
                setError(e)
            }
        },
        async setTotalRecords({commit}: { commit: Commit }, data: { totalCount: number }): Promise<void> {
            try {
                commit('setTotalRecords', data.totalCount)
            } catch (e: unknown) {
                setError(e)
            }
        },
        async resetProjectAction({commit}: { commit: Commit }): Promise<void> {
            commit('setProjectRoom', [])
            commit('cleanProjectList')
            commit('setCurrentPage', 1)
            commit('setTotalRecords', 0)
        },
        async addNewProjectInList({commit}: { commit: Commit }, data: IProjectList): Promise<void> {
            commit('addNewProjectInList', data)
        }
    }
}