import {describe, expect, it, vi} from "vitest";
import {store} from "../store.ts";
import {ProjectModule} from "./projectModule.ts";
import {IProject, IProjectList, IProjectResponse} from "../../models/projectModels.ts";
import {IUser} from "../../models/userModels.ts";
import SocketEmit from "../../api/socketEmit.ts";
import {setError} from "../../services/setError.ts";

vi.mock('../../api/socketEmit.ts', () => ({
    default: {
        getProjectEmit: vi.fn()
    }
}));
vi.mock("../../services/setError.ts", () => ({
    setError: vi.fn()
}));

const initState = {
    currentProject: {} as IProject,
    projectList: [] as IProjectList[],
    projectRoom: [] as Pick<IUser, 'userId' | 'name'>[],
    boardRoom: [] as Pick<IUser, 'userId' | 'name'>[],
    pageInfo: {
        page: 1,
        totalPages: 0,
        totalRecords: 0
    }
}
const currentProject: IProject = {
    projectId: 1,
    name: 'project 1',
    description: 'sdasdg',
    owner: {userId: 1, name: 'owner', email: 'sdasdg@example.com'},
    tasks: [{
        taskId: 1,
        name: 'task1',
        priority: 'low',
        completionDate: '23-01-2025',
        member: {userId: 1, name: 'owner', email: 'sdasdg@example.com'},
        status: 'completed',
        editor: null
    }],
    editor: null
}

describe('Store.ProjectModule', () => {
    const actions = ProjectModule.actions as Record<string, Function>;
    const mutations = ProjectModule.mutations as NonNullable<typeof ProjectModule.mutations>;
    it('Инициализация', () => {
        expect(store.state.projectModule).toEqual(initState)
    })
    it('Mutation.setProjectList', () => {
        const state = structuredClone(initState);
        const projectList1 = [{projectId: 1, name: 'project 1'}];
        const projectList2 = [{projectId: 2, name: 'project 2'}];
        mutations.setProjectList(state, projectList1);
        expect(state.projectList).not.toBe(projectList1);
        expect(state.projectList).toEqual(projectList1);
        mutations.setProjectList(state, projectList2);
        expect(state.projectList).toEqual([...projectList1, ...projectList2]);
    })
    it('Mutation.cleanProjectList', () => {
        const state = structuredClone(initState);
        state.projectList = [{projectId: 1, name: 'project 1'}];
        expect(state.projectList).toEqual([{projectId: 1, name: 'project 1'}]);
        mutations.cleanProjectList(state);
        expect(state.projectList).toEqual([]);
    })
    it('Mutation.updateProjectInfoInList', () => {
        const initProjectList = [{projectId: 1, name: 'project 1'}, {projectId: 2, name: 'project 2'}];
        const projectListUpd1 = [{projectId: 1, name: 'project 1'}, {projectId: 2, name: 'project 2 upd'}];
        const projectListUpd2 = [{projectId: 1, name: 'project 1 upd'}, {projectId: 2, name: 'project 2 upd'}];
        const state = structuredClone(initState);
        state.projectList = [...initProjectList];
        expect(state.projectList).toEqual(initProjectList);
        mutations.updateProjectInfoInList(state, {projectId: 3, name: 'project 3', description: 'sdasdg'});
        expect(state.projectList).toEqual(initProjectList);
        mutations.updateProjectInfoInList(state, {projectId: 2, name: 'project 2 upd', description: 'sdasdg'});
        expect(state.projectList).toEqual(projectListUpd1);
        mutations.updateProjectInfoInList(state, {projectId: 1, name: 'project 1 upd', description: 'sdasdg'});
        expect(state.projectList).toEqual(projectListUpd2);
    })
    it('Mutation.setCurrentProject', () => {
        const state = structuredClone(initState);
        const projectObj = structuredClone(currentProject);
        expect(state.currentProject).toEqual({});
        mutations.setCurrentProject(state, projectObj);
        expect(state.currentProject).not.toBe(projectObj);
        expect(state.currentProject).toEqual(projectObj);
    })
    it('Mutation.updateCurrentProject', () => {
        const state = structuredClone(initState);
        state.currentProject = structuredClone(currentProject);
        const dataNotId = {
            projectId: 2,
            name: 'project 1 upd',
            description: 'description 1 update',
            owner: {userId: 2, name: 'test', email: 'test@test.ru'},
            editor: {userId: 3, name: 'third'}
        };
        const data = {
            projectId: 1,
            name: 'project 1 upd',
            description: 'description 1 update',
            owner: {userId: 2, name: 'test', email: 'test@test.ru'},
            editor: {userId: 3, name: 'third'}
        };
        const updatedCurrentProject = {
            projectId: 1,
            name: 'project 1 upd',
            description: 'description 1 update',
            owner: {userId: 2, name: 'test', email: 'test@test.ru'},
            tasks: [{
                taskId: 1,
                name: 'task1',
                priority: 'low',
                completionDate: '23-01-2025',
                member: {userId: 1, name: 'owner', email: 'sdasdg@example.com'},
                status: 'completed',
                editor: null
            }],
            editor: null
        };
        mutations.updateCurrentProject(state, dataNotId);
        expect(state.currentProject).toEqual(currentProject);
        mutations.updateCurrentProject(state, data);
        expect(state.currentProject).toEqual(updatedCurrentProject);
    })
    it('Mutation.setTaskInCurrentProject', () => {
        const state = structuredClone(initState);
        state.currentProject = structuredClone(currentProject);
        state.currentProject.tasks = [];
        const task1 = {
            taskId: 1,
            name: 'task 1',
            description: 'description 1',
            priority: 'medium',
            completionDate: '22-01-2025',
            project: {
                projectId: 1,
                name: 'testProject1',
            },
            member: {userId: 1, name: 'testUser1', email: 'test@test.com'},
            status: 'assigned',
            editor: null
        };
        const task2 = {
            taskId: 2,
            name: 'task 2',
            description: 'description 2',
            priority: 'high',
            completionDate: '23-01-2025',
            project: {
                projectId: 1,
                name: 'testProject1',
            },
            member: {userId: 2, name: 'testUser2', email: 'test2@test.com'},
            status: 'completed',
            editor: null
        }
        expect(state.currentProject.tasks).toEqual([]);
        mutations.setTaskInCurrentProject(state, task1);
        expect(state.currentProject.tasks).toEqual([task1]);
        mutations.setTaskInCurrentProject(state, task2);
        expect(state.currentProject.tasks).toEqual([task1, task2]);
    })
    it('Mutation.updateTask', () => {
        const state = structuredClone(initState);
        state.currentProject = structuredClone(currentProject);
        const taskNotFound = {
            taskId: 2,
            name: 'task1',
            priority: 'low',
            completionDate: '23-01-2025',
            member: {userId: 1, name: 'owner', email: 'sdasdg@example.com'},
            status: 'completed',
            editor: null
        }
        const task1 = {
            taskId: 1,
            name: 'task1 update',
            priority: 'high',
            completionDate: '28-01-2025',
        }
        const task2 = {
            taskId: 1,
            member: {userId: 3, name: 'test3', email: 'test3@example.com'},
            status: 'inProgress',
            editor: {userId: 2, name: 'test2'}
        }
        expect(state.currentProject.tasks).toEqual(currentProject.tasks);
        mutations.updateTask(state, taskNotFound);
        expect(state.currentProject.tasks).toEqual(currentProject.tasks);
        mutations.updateTask(state, task1);
        expect(state.currentProject.tasks).toEqual([{
            taskId: 1,
            name: 'task1 update',
            priority: 'high',
            completionDate: '28-01-2025',
            member: {userId: 1, name: 'owner', email: 'sdasdg@example.com'},
            status: 'completed',
            editor: null
        }]);
        mutations.updateTask(state, task2);
        expect(state.currentProject.tasks).toEqual([{
            taskId: 1,
            name: 'task1 update',
            priority: 'high',
            completionDate: '28-01-2025',
            member: {userId: 3, name: 'test3', email: 'test3@example.com'},
            status: 'inProgress',
            editor: {userId: 2, name: 'test2'}
        }]);
    })
    it('Mutation.setProjectRoom', () => {
        const state = structuredClone(initState);
        const userList1 = [{userId: 1, name: 'testUser1'}, {userId: 2, name: 'testUser2'}];
        const userList2 = [{userId: 1, name: 'testUser1'}];
        expect(state.projectRoom).toEqual([]);
        mutations.setProjectRoom(state, userList1);
        expect(state.projectRoom).not.toBe(userList1);
        expect(state.projectRoom).toEqual(userList1);
        mutations.setProjectRoom(state, userList2);
        expect(state.projectRoom).toEqual(userList2);
        mutations.setProjectRoom(state, []);
        expect(state.projectRoom).toEqual([]);
    })
    it('Mutation.setBoardRoom', () => {
        const state = structuredClone(initState);
        const userList1 = [{userId: 1, name: 'testUser1'}, {userId: 2, name: 'testUser2'}];
        const userList2 = [{userId: 1, name: 'testUser1'}];
        expect(state.boardRoom).toEqual([]);
        mutations.setBoardRoom(state, userList1);
        expect(state.boardRoom).not.toBe(userList1);
        expect(state.boardRoom).toEqual(userList1);
        mutations.setBoardRoom(state, userList2);
        expect(state.boardRoom).toEqual(userList2);
        mutations.setBoardRoom(state, []);
        expect(state.boardRoom).toEqual([]);
    })
    it('Mutation.updateProjectEditor', () => {
        const state = structuredClone(initState);
        state.currentProject = structuredClone(currentProject);
        const dataNotUpdate = {projectId: 2, editor: {userId: 1, name: 'testUser1'}};
        const data = {projectId: 1, editor: {userId: 1, name: 'testUser1'}};
        const dataClean = {projectId: 1, editor: null};
        expect(state.currentProject.editor).null;
        mutations.updateProjectEditor(state, dataNotUpdate);
        expect(state.currentProject.editor).null;
        mutations.updateProjectEditor(state, data);
        expect(state.currentProject.editor).toEqual(data.editor);
        mutations.updateProjectEditor(state, dataClean);
        expect(state.currentProject.editor).null;
    })
    it('Mutation.setCurrentPage', () => {
        const state = structuredClone(initState);
        expect(state.pageInfo.page).toEqual(1);
        mutations.setCurrentPage(state, 2);
        expect(state.pageInfo.page).toEqual(2);
        mutations.setCurrentPage(state, 100);
        expect(state.pageInfo.page).toEqual(100);
    })
    it('Mutation.setTotalRecords', () => {
        const state = structuredClone(initState);
        expect(state.pageInfo.totalPages).toEqual(0);
        expect(state.pageInfo.totalRecords).toEqual(0);
        mutations.setTotalRecords(state, 1);
        expect(state.pageInfo.totalPages).toEqual(1);
        expect(state.pageInfo.totalRecords).toEqual(1);
        mutations.setTotalRecords(state, 20);
        expect(state.pageInfo.totalPages).toEqual(1);
        expect(state.pageInfo.totalRecords).toEqual(20);
        mutations.setTotalRecords(state, 21);
        expect(state.pageInfo.totalPages).toEqual(2);
        expect(state.pageInfo.totalRecords).toEqual(21);
    })
    it('Mutation.addNewProjectInList', () => {
        const state = structuredClone(initState);
        //1. Не последняя страница
        state.pageInfo = {page: 1, totalRecords: 21, totalPages: 2};
        const data1 = {projectId: 1, name: 'testProject1'};
        mutations.addNewProjectInList(state, data1);
        expect(state.projectList).toEqual([]);
        //2. Последняя страница и на странице 20 записей
        state.pageInfo = {page: 1, totalRecords: 20, totalPages: 1};
        mutations.addNewProjectInList(state, data1);
        expect(state.projectList).toEqual([]);
        state.pageInfo = {page: 2, totalRecords: 40, totalPages: 2};
        mutations.addNewProjectInList(state, data1);
        expect(state.projectList).toEqual([]);
        //3. Последняя страница и на странице < 20 записей
        state.pageInfo = {page: 1, totalRecords: 3, totalPages: 1};
        mutations.addNewProjectInList(state, data1);
        expect(state.projectList).toEqual([data1]);
    })
    it('Action.createProjectAC', () => {
        const data = structuredClone(currentProject);
        const commit = vi.fn();
        actions.createProjectAC({commit}, data);
        expect(commit).toHaveBeenCalledWith('setCurrentProject', data);
        vi.restoreAllMocks();
    })
    it('Action.updateProjectAC', () => {
        const data = {projectId: 1, name: 'project 1', description: 'description'};
        const commit = vi.fn();
        actions.updateProjectAC({commit}, data);
        expect(commit).toHaveBeenCalledWith('updateCurrentProject', data);
        expect(commit).toHaveBeenCalledWith('updateProjectInfoInList', data);
        vi.restoreAllMocks();
    })
    it('Action.getProjectListAC', () => {
        const data = [{projectId: 1, name: 'testProject1'}];
        const commit = vi.fn();
        actions.getProjectListAC({commit}, data);
        expect(commit).toHaveBeenCalledWith('setProjectList', data);
        vi.restoreAllMocks();
    })
    it('Action.getProjectAC.positive', async () => {
        const responseData: IProjectResponse = {
            projectId: 1,
            name: 'project 1',
            description: 'sdasdg',
            owner: {userId: 1, name: 'owner', email: 'sdasdg@example.com'},
            tasks: [{
                taskId: 1,
                name: 'task1',
                priority: 'low',
                completionDate: '23-01-2025',
                member: {userId: 1, name: 'owner', email: 'sdasdg@example.com'},
                status: 'completed'
            }],
            editor: null
        }
        const commit = vi.fn();
        vi.spyOn(SocketEmit, 'getProjectEmit').mockResolvedValue(responseData);
        await actions.getProjectAC({commit}, 1);
        expect(SocketEmit.getProjectEmit).toHaveBeenCalledWith({projectId: 1})
        expect(commit).toHaveBeenCalledWith('setCurrentProject', responseData);
        vi.restoreAllMocks();
    })
    it('Action.getProjectAC.negative', async () => {
        const mockError = new Error('Validation error');
        const commit = vi.fn();
        vi.spyOn(SocketEmit, 'getProjectEmit').mockRejectedValue(mockError);
        await actions.getProjectAC({commit}, 1);
        expect(setError).toHaveBeenCalledWith(mockError);
        vi.restoreAllMocks();
    })
    it('Action.createTaskAC', () => {
        const responseData = {
            taskId: 1,
            name: 'task 1',
            description: 'description 1',
            priority: 'medium',
            completionDate: '22-01-2025',
            project: {projectId: 1, name: 'testProject1'},
            member: {userId: 1, name: 'testUser1', email: 'test@test.com'},
            status: 'assigned',
            editor: null
        };
        const commit = vi.fn();
        actions.createTaskAC({commit}, responseData);
        expect(commit).toHaveBeenCalledWith('setTaskInCurrentProject', responseData);
        vi.restoreAllMocks();
    })
    it('Action.updateTaskAC', () => {
        const data = {
            taskId: 1,
            name: 'task 1',
            priority: 'medium',
            completionDate: '22-01-2025',
            member: {userId: 1, name: 'owner', email: 'sdasdg@example.com'},
            status: 'assigned',
            editor: null
        }
        const commit = vi.fn();
        actions.updateTaskAC({commit}, data);
        expect(commit).toHaveBeenCalledWith('updateTask', data);
        vi.restoreAllMocks();
    })
    it('Action.setProjectRoom', () => {
        const data = [{userId: 1, name: 'testProject1'}];
        const commit = vi.fn();
        actions.setProjectRoom({commit}, data);
        expect(commit).toHaveBeenCalledWith('setProjectRoom', data);
        vi.restoreAllMocks();
    })
    it('Action.setBoardRoom', () => {
        const data = [{userId: 1, name: 'testProject1'}];
        const commit = vi.fn();
        actions.setBoardRoom({commit}, data);
        expect(commit).toHaveBeenCalledWith('setBoardRoom', data);
        vi.restoreAllMocks();
    })
    it('Action.updateProjectEditor', () => {
        const data = {projectId: 1, editor: {userId: 1, name: 'testUser1'}};
        const commit = vi.fn();
        actions.updateProjectEditor({commit}, data);
        expect(commit).toHaveBeenCalledWith('updateProjectEditor', data);
        vi.restoreAllMocks();
    })
    it('Action.setTotalRecords', () => {
        const data = {totalCount: 0};
        const commit = vi.fn();
        actions.setTotalRecords({commit}, data);
        expect(commit).toHaveBeenCalledWith('setTotalRecords', data.totalCount);
        vi.restoreAllMocks();
    })
    it('Action.resetProjectAction', () => {
        const commit = vi.fn();
        actions.resetProjectAction({commit});
        expect(commit).toHaveBeenCalledWith('setProjectRoom', []);
        expect(commit).toHaveBeenCalledWith('cleanProjectList');
        expect(commit).toHaveBeenCalledWith('setCurrentPage', 1);
        expect(commit).toHaveBeenCalledWith('setTotalRecords', 0);
        vi.restoreAllMocks();
    })
    it('Action.addNewProjectInList', () => {
        const data = {projectId: 1, name: 'project1'};
        const commit = vi.fn();
        actions.addNewProjectInList({commit}, data);
        expect(commit).toHaveBeenCalledWith('addNewProjectInList', data);
        vi.restoreAllMocks();
    })
})