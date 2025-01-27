import {describe, it, expect, vi} from "vitest";
import {store} from "../store.ts";
import {TaskModule} from "./taskModule.ts";
import {ITaskList, ITaskModuleState, ITaskResponse} from "../../models/taskModels.ts";
import SocketEmit from "../../api/socketEmit.ts";
import {setError} from "../../services/setError.ts";

vi.mock('../../api/socketEmit.ts', () => ({
    default: {
        getTaskEmit: vi.fn(),
    }
}))
vi.mock("../../services/setError.ts", () => ({
    setError: vi.fn()
}));

const initState: ITaskModuleState = {
    currentTask: {} as ITaskResponse,
    taskList: [],
    taskListMode: 'active',
    taskRoom: [],
    pageInfo: {
        page: 1,
        totalPages: 0,
        totalRecords: 0
    },
}
const currentTask: ITaskResponse = {
    taskId: 1,
    name: 'test',
    description: 'testDesc',
    priority: 'medium',
    completionDate: '22-01-2025',
    project: {projectId: 1, name: 'testProject1'},
    member: {userId: 0, name: 'testUser1', email: 'test@test.com'},
    status: 'assigned',
    editor: null
}

describe('Store.TaskModule', () => {
    const actions = TaskModule.actions as Record<string, Function>;
    it('Инициализация', () => {
        const initData = structuredClone(initState);
        expect(store.state.taskModule).toEqual(initData);
    })
    it('Mutation.setCurrentTask', () => {
        const state = structuredClone(initState);
        const data = {...currentTask};
        (TaskModule.mutations as NonNullable<typeof TaskModule.mutations>)
            .setCurrentTask(state, data);
        expect(state.currentTask).not.toBe(data);
        expect(state.currentTask).toEqual(data);
    })
    it('Mutation.updateTask', () => {
        const state = structuredClone(initState);
        state.currentTask = structuredClone(currentTask);
        const dataNotUpdate = {
            taskId: 2,
            name: 'test2',
            description: 'testDesc2',
            priority: 'medium',
            completionDate: '22-01-2025',
            project: {projectId: 1, name: 'testProject1'},
            member: {userId: 0, name: 'testUser1', email: 'test@test.com'},
            status: 'assigned',
            editor: null
        };
        const data = {
            taskId: 1,
            name: 'test123',
            description: 'testDesc123',
            priority: 'low',
            completionDate: '23-01-2025',
            project: {projectId: 1, name: 'testProject1'},
            member: {userId: 0, name: 'testUser1', email: 'test@test.com'},
            status: 'completed',
            editor: null
        };
        (TaskModule.mutations as NonNullable<typeof TaskModule.mutations>)
            .updateTask(state, dataNotUpdate);
        expect(state.currentTask).not.toEqual(dataNotUpdate);
        (TaskModule.mutations as NonNullable<typeof TaskModule.mutations>)
            .updateTask(state, data);
        expect(state.currentTask).not.toBe(data);
        expect(state.currentTask).toEqual(data);
    })
    it('Mutation.setTaskList', () => {
        const state = structuredClone(initState);
        const firstTaskList = [{taskId: 1, name: 'testTask1', priority: 'medium', status: 'assigned'}];
        const secondTaskList = [{taskId: 2, name: 'testTask2', priority: 'medium', status: 'assigned'}];
        const thirdTaskList = [{taskId: 3, name: 'testTask3', priority: 'medium', status: 'assigned'}];
        (TaskModule.mutations as NonNullable<typeof TaskModule.mutations>)
            .setTaskList(state, firstTaskList);
        expect(state.taskList).toEqual([]);
        state.pageInfo.totalRecords = 2; //изменяем totalRecord чтобы проходить по условию и происходила запись задач
        (TaskModule.mutations as NonNullable<typeof TaskModule.mutations>)
            .setTaskList(state, firstTaskList);
        expect(state.taskList).not.toBe(firstTaskList);
        expect(state.taskList).toEqual(firstTaskList);
        (TaskModule.mutations as NonNullable<typeof TaskModule.mutations>)
            .setTaskList(state, secondTaskList);
        expect(state.taskList).toEqual([...firstTaskList, ...secondTaskList]);
        (TaskModule.mutations as NonNullable<typeof TaskModule.mutations>)
            .setTaskList(state, thirdTaskList);
        expect(state.taskList).toEqual([...firstTaskList, ...secondTaskList]);
    })
    it('Mutation.cleanTaskList', () => {
        const initTaskList: ITaskList[] = [{taskId: 1, name: 'testTask1', priority: 'medium', status: 'assigned'}]
        const state = structuredClone(initState);
        state.taskList = [...initTaskList];
        expect(state.taskList).toEqual(initTaskList);
        (TaskModule.mutations as NonNullable<typeof TaskModule.mutations>)
            .cleanTaskList(state);
        expect(state.taskList).toEqual([]);
    })
    it('Mutation.updateTaskInfoInList', () => {
        const initTaskList: ITaskList[] = [{taskId: 1, name: 'testTask1', priority: 'medium', status: 'assigned'},
            {taskId: 2, name: 'testTask2', priority: 'medium', status: 'assigned'}];
        const taskListUpd_1 = [{taskId: 1, name: 'testTask1', priority: 'medium', status: 'assigned'},
            {taskId: 2, name: 'testTask2upd', priority: 'low', status: 'inProgress'}];
        const taskListUpd_2 = [{taskId: 1, name: 'testTask1upd', priority: 'high', status: 'completed'},
            {taskId: 2, name: 'testTask2upd', priority: 'low', status: 'inProgress'}];
        const state = structuredClone(initState);
        state.taskList = [...initTaskList];
        expect(state.taskList).toEqual(initTaskList);
        (TaskModule.mutations as NonNullable<typeof TaskModule.mutations>)
            .updateTaskInfoInList(state, {taskId: 3, name: 'testTask1', priority: 'medium', status: 'assigned'});
        expect(state.taskList).toEqual(initTaskList); //Не нашли задачу => ничего не обновили
        (TaskModule.mutations as NonNullable<typeof TaskModule.mutations>)
            .updateTaskInfoInList(state, {taskId: 2, name: 'testTask2upd', priority: 'low', status: 'inProgress'});
        expect(state.taskList).toEqual(taskListUpd_1);
        (TaskModule.mutations as NonNullable<typeof TaskModule.mutations>)
            .updateTaskInfoInList(state, {taskId: 1, name: 'testTask1upd', priority: 'high', status: 'completed'});
        expect(state.taskList).toEqual(taskListUpd_2);
    })
    it('Mutation.setTaskRoom', () => {
        const state = structuredClone(initState);
        const userList_1 = [{userId: 1, name: 'фио1'}];
        const userList_2 = [{userId: 2, name: 'фио2'}];
        (TaskModule.mutations as NonNullable<typeof TaskModule.mutations>)
            .setTaskRoom(state, userList_1);
        expect(state.taskRoom).not.toBe(userList_1);
        expect(state.taskRoom).toEqual(userList_1);
        (TaskModule.mutations as NonNullable<typeof TaskModule.mutations>)
            .setTaskRoom(state, userList_2);
        expect(state.taskRoom).not.toBe(userList_2);
        expect(state.taskRoom).toEqual(userList_2);
    })
    it('Mutation.updateTaskEditor', () => {
        const state = structuredClone(initState);
        state.currentTask = {...currentTask};
        const taskNotFound = {taskId: 2, editor: {userId: 11, name: 'фио11'}};
        const taskEditor = {taskId: 1, editor: {userId: 11, name: 'фио11'}};
        const taskEditorNull = {taskId: 1, editor: null};
        (TaskModule.mutations as NonNullable<typeof TaskModule.mutations>)
            .updateTaskEditor(state, taskNotFound);
        expect(state.currentTask.editor).null;
        (TaskModule.mutations as NonNullable<typeof TaskModule.mutations>)
            .updateTaskEditor(state, taskEditor);
        expect(state.currentTask.editor).not.toBe(taskEditor.editor);
        expect(state.currentTask.editor).toEqual(taskEditor.editor);
        (TaskModule.mutations as NonNullable<typeof TaskModule.mutations>)
            .updateTaskEditor(state, taskEditorNull);
        expect(state.currentTask.editor).null;
    })
    it('Mutation.updateStatusTask', () => {
        const state = structuredClone(initState);
        state.currentTask = {...currentTask};
        const taskNotFound = {taskId: 2, status: 'inProgress'};
        const taskValid = {taskId: 1, status: 'completed'};
        (TaskModule.mutations as NonNullable<typeof TaskModule.mutations>)
            .updateStatusTask(state, taskNotFound);
        expect(state.currentTask.status).toEqual('assigned');
        (TaskModule.mutations as NonNullable<typeof TaskModule.mutations>)
            .updateStatusTask(state, taskValid);
        expect(state.currentTask).toEqual({...currentTask, status: 'completed'});
    })
    it('Mutation.setCurrentPage', () => {
        const state = structuredClone(initState);
        expect(state.pageInfo.page).toEqual(1);
        (TaskModule.mutations as NonNullable<typeof TaskModule.mutations>)
            .setCurrentPage(state, 2);
        expect(state.pageInfo.page).toEqual(2);
        (TaskModule.mutations as NonNullable<typeof TaskModule.mutations>)
            .setCurrentPage(state, 35);
        expect(state.pageInfo.page).toEqual(35);
    })
    it('Mutation.setTotalRecords', () => {
        const state = structuredClone(initState);
        expect(state.pageInfo.totalRecords).toEqual(0);
        expect(state.pageInfo.totalPages).toEqual(0);
        (TaskModule.mutations as NonNullable<typeof TaskModule.mutations>)
            .setTotalRecords(state, 1);
        expect(state.pageInfo.totalRecords).toEqual(1);
        expect(state.pageInfo.totalPages).toEqual(1);
        (TaskModule.mutations as NonNullable<typeof TaskModule.mutations>)
            .setTotalRecords(state, 21);
        expect(state.pageInfo.totalRecords).toEqual(21);
        expect(state.pageInfo.totalPages).toEqual(2);
        (TaskModule.mutations as NonNullable<typeof TaskModule.mutations>)
            .setTotalRecords(state, 0);
        expect(state.pageInfo.totalRecords).toEqual(0);
        expect(state.pageInfo.totalPages).toEqual(0);
    })
    it('Mutation.setTaskListMode', () => {
        const state = structuredClone(initState);
        expect(state.taskListMode).toEqual('active');
        (TaskModule.mutations as NonNullable<typeof TaskModule.mutations>)
            .setTaskListMode(state, 'completed');
        expect(state.taskListMode).toEqual('completed');
    })
    it('Mutation.addNewTaskInList', () => {
        //1. последняя страница и кол-во записей на последней странице меньше 20, тогда добавляем запись
        const state = structuredClone(initState);
        state.pageInfo = {page: 1, totalPages: 1, totalRecords: 1};
        const initTaskList: ITaskList[] = [{taskId: 1, name: 'testTask1', priority: 'medium', status: 'assigned'}]
        state.taskList = [...initTaskList];
        const newTask2 = {taskId: 2, name: 'testTask2', priority: 'low', status: 'inProgress'};
        expect(state.taskList).toEqual([{taskId: 1, name: 'testTask1', priority: 'medium', status: 'assigned'}]);
        (TaskModule.mutations as NonNullable<typeof TaskModule.mutations>)
            .addNewTaskInList(state, newTask2);
        expect(state.taskList).toEqual([...initTaskList, newTask2]);
        expect(state.pageInfo.totalRecords).toEqual(2);
        expect(state.pageInfo.totalPages).toEqual(1);
        //2.Последняя страница и кол-во записей на последней странице 20, тогда ничего не делаем
        state.pageInfo = {page: 1, totalPages: 1, totalRecords: 20};
        state.taskList = [];
        (TaskModule.mutations as NonNullable<typeof TaskModule.mutations>)
            .addNewTaskInList(state, newTask2);
        expect(state.taskList).toEqual([]);
        expect(state.pageInfo.totalRecords).toEqual(21);
        expect(state.pageInfo.totalPages).toEqual(2);
        //3. Не последняя страница, тогда ничего не делаем
        state.pageInfo = {page: 1, totalPages: 2, totalRecords: 21};
        (TaskModule.mutations as NonNullable<typeof TaskModule.mutations>)
            .addNewTaskInList(state, newTask2);
        expect(state.taskList).toEqual([]);
        expect(state.pageInfo.totalRecords).toEqual(22);
        expect(state.pageInfo.totalPages).toEqual(2);
        //4. Всего страниц 0, тогда добавляем запись
        state.pageInfo = {page: 1, totalPages: 0, totalRecords: 0};
        (TaskModule.mutations as NonNullable<typeof TaskModule.mutations>)
            .addNewTaskInList(state, newTask2);
        expect(state.taskList).toEqual([newTask2]);
        expect(state.pageInfo.totalRecords).toEqual(1);
        expect(state.pageInfo.totalPages).toEqual(1);
    })
    it('Action.getTaskAC.positive', async () => {
        const responseData = structuredClone(currentTask);
        const commit = vi.fn();
        vi.spyOn(SocketEmit, 'getTaskEmit').mockResolvedValue(responseData);
        await actions.getTaskAC({commit}, 1);
        expect(SocketEmit.getTaskEmit).toHaveBeenCalledWith({taskId: 1});
        expect(commit).toHaveBeenCalledWith('setCurrentTask', responseData);
        vi.restoreAllMocks();
    })
    it('Action.getTaskAC.negative', async () => {
        const commit = vi.fn();
        const mockError = new Error('Validation error');
        vi.spyOn(SocketEmit, 'getTaskEmit').mockRejectedValue(mockError);
        await actions.getTaskAC({commit}, 1);
        expect(setError).toHaveBeenCalledWith(mockError);
        vi.restoreAllMocks();
    })
    it('Action.updateTaskAC', () => {
        const data = structuredClone(currentTask);
        const commit = vi.fn();
        actions.updateTaskAC({commit}, data);
        expect(commit).toHaveBeenCalledWith('updateTask', data);
        expect(commit).toHaveBeenCalledWith('updateTaskInfoInList', data);
        vi.restoreAllMocks();
    })
    it('Action.getTaskListAC', () => {
        const data = [{taskId: 1, name: 'testTask1', priority: 'medium', status: 'assigned'}];
        const commit = vi.fn();
        actions.getTaskListAC({commit}, data);
        expect(commit).toHaveBeenCalledWith('setTaskList', data);
        vi.restoreAllMocks();
    })
    it('Action.getCloseTaskListAC', () => {
        const data = [{taskId: 2, name: 'testTask2', priority: 'medium', status: 'assigned'}];
        const commit = vi.fn();
        actions.getCloseTaskListAC({commit}, data);
        expect(commit).toHaveBeenCalledWith('setTaskList', data);
        vi.restoreAllMocks();
    })
    it('Action.setTaskRoom', () => {
        const data = [{userId: 1, name: 'фио1'}];
        const commit = vi.fn();
        actions.setTaskRoom({commit}, data);
        expect(commit).toHaveBeenCalledWith('setTaskRoom', data);
        vi.restoreAllMocks();
    })
    it('Action.updateTaskEditor', () => {
        const data = {taskId: 1, editor: {userId: 11, name: 'фио11'}};
        const commit = vi.fn();
        actions.updateTaskEditor({commit}, data);
        expect(commit).toHaveBeenCalledWith('updateTaskEditor', data);
        vi.restoreAllMocks();
    })
    it('Action.updateStatusTask', () => {
        const state = structuredClone(initState);
        const data_1 = {taskId: 1, status: 'assigned'};
        const data_2 = {taskId: 2, status: 'inProgress'};
        const commit = vi.fn();
        //Когда задача не открыта
        actions.updateStatusTask({commit, state}, data_1);
        expect(commit).not.toHaveBeenCalledWith('updateStatusTask', data_1);
        expect(commit).toHaveBeenCalledWith('updateTaskInfoInList', data_1);
        state.currentTask = structuredClone(currentTask);
        //Когда задача открыта
        actions.updateStatusTask({commit, state}, data_2);
        expect(commit).toHaveBeenCalledWith('updateStatusTask', data_2);
        expect(commit).toHaveBeenCalledWith('updateTaskInfoInList', data_2);
        vi.restoreAllMocks();
    })
    it('Action.setTotalRecords', () => {
        const data = {totalCount: 1};
        const commit = vi.fn();
        actions.setTotalRecords({commit}, data);
        expect(commit).toHaveBeenCalledWith('setTotalRecords', data.totalCount);
        vi.restoreAllMocks();
    })
    it('Action.resetAction', () => {
        const commit = vi.fn();
        actions.resetAction({commit});
        expect(commit).toHaveBeenCalledWith('setCurrentTask', {});
        expect(commit).toHaveBeenCalledWith('setTaskRoom', []);
        expect(commit).toHaveBeenCalledWith('cleanTaskList');
        expect(commit).toHaveBeenCalledWith('setCurrentPage', 1);
        expect(commit).toHaveBeenCalledWith('setTotalRecords', 0);
        vi.restoreAllMocks();
    })
    it('Action.addNewTaskInList', () => {
        const commit = vi.fn();
        const state = structuredClone(initState);
        //1. Статус не завершен и просматриваем активные
        const data_1 = {taskId: 1, name: 'testTask1', priority: 'medium', status: 'assigned'};
        actions.addNewTaskInList({commit, state}, data_1);
        expect(commit).toHaveBeenCalledWith('addNewTaskInList', data_1);
        commit.mockClear();
        //2. Статус завершен и просматриваем активные
        const data_2 = {taskId: 1, name: 'testTask1', priority: 'medium', status: 'completed'};
        actions.addNewTaskInList({commit, state}, data_2);
        expect(commit).not.toHaveBeenCalledWith('addNewTaskInList', data_2);
        commit.mockClear();
        //3. Статус завершен и просматриваем завершенные
        state.taskListMode = 'completed';
        const data_3 = {taskId: 1, name: 'testTask1', priority: 'medium', status: 'completed'};
        actions.addNewTaskInList({commit, state}, data_3);
        expect(commit).toHaveBeenCalledWith('addNewTaskInList', data_3);
        commit.mockClear();
        //4. Статус не завершен и просматриваем завершенные
        const data_4 = {taskId: 1, name: 'testTask1', priority: 'medium', status: 'assigned'};
        actions.addNewTaskInList({commit, state}, data_4);
        expect(commit).not.toHaveBeenCalledWith('addNewTaskInList', data_4);
        vi.restoreAllMocks();
    })
})