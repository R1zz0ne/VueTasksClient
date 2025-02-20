import {describe, it, expect, vi, beforeEach} from 'vitest'
import SocketEmit from './socketEmit.ts' // 👈 Импортируем, чтобы проверить мок
import {createRouter, createMemoryHistory} from 'vue-router'
import setupSocketListeners from "./socketON.ts";
import {setError} from "../services/setError.ts";
import {flushPromises} from "@vue/test-utils";

vi.mock('./socketEmit.ts', () => ({
    default: {
        socket: {
            handlers: {} as Record<string, Function>,
            on(event: string, callback: Function) {
                this.handlers[event] = callback
            },
            emit(event: string, data?: any) {
                if (this.handlers[event]) {
                    this.handlers[event](data)
                }
            },
        },
    },
}))
vi.mock('../services/setError.ts', () => ({
    setError: vi.fn()
}))

describe('setupSocketListeners', () => {
    let store: any;
    let router: any;
    const createMockStore = () => {
        return {
            dispatch: vi.fn(),
        }
    };
    beforeEach(() => {
        store = createMockStore();
        router = createRouter({
            history: createMemoryHistory(),
            routes: [],
        })
        vi.clearAllMocks()
    })

    it('Регистрация обработчиков событий сокета', () => {
        setupSocketListeners(store, router);
        // @ts-ignore
        expect(SocketEmit.socket.handlers).toHaveProperty('error');
        // @ts-ignore
        expect(SocketEmit.socket.handlers).toHaveProperty('getNotification');
        // @ts-ignore
        expect(SocketEmit.socket.handlers).toHaveProperty('getNewNotification');
        // @ts-ignore
        expect(SocketEmit.socket.handlers).toHaveProperty('taskRoom');
        // @ts-ignore
        expect(SocketEmit.socket.handlers).toHaveProperty('createTask');
        // @ts-ignore
        expect(SocketEmit.socket.handlers).toHaveProperty('updateTask');
        // @ts-ignore
        expect(SocketEmit.socket.handlers).toHaveProperty('updateTaskEditor');
        // @ts-ignore
        expect(SocketEmit.socket.handlers).toHaveProperty('updateStatusTask');
        // @ts-ignore
        expect(SocketEmit.socket.handlers).toHaveProperty('taskTotalCount');
        // @ts-ignore
        expect(SocketEmit.socket.handlers).toHaveProperty('getTaskList');
        // @ts-ignore
        expect(SocketEmit.socket.handlers).toHaveProperty('getCloseTaskList');
        // @ts-ignore
        expect(SocketEmit.socket.handlers).toHaveProperty('addNewTaskInList');
        // @ts-ignore
        expect(SocketEmit.socket.handlers).toHaveProperty('createProject');
        // @ts-ignore
        expect(SocketEmit.socket.handlers).toHaveProperty('projectRoom');
        // @ts-ignore
        expect(SocketEmit.socket.handlers).toHaveProperty('updateProject');
        // @ts-ignore
        expect(SocketEmit.socket.handlers).toHaveProperty('boardRoom');
        // @ts-ignore
        expect(SocketEmit.socket.handlers).toHaveProperty('updateProjectEditor');
        // @ts-ignore
        expect(SocketEmit.socket.handlers).toHaveProperty('projectTotalCount');
        // @ts-ignore
        expect(SocketEmit.socket.handlers).toHaveProperty('getProjectList');
        // @ts-ignore
        expect(SocketEmit.socket.handlers).toHaveProperty('addNewProjectInList');
    });
    it('error', () => {
        setupSocketListeners(store, router);
        const errorData = {type: "error", message: 'Ошибка!'};
        SocketEmit.socket.emit('error', errorData);
        expect(setError).toHaveBeenCalledTimes(1);
        expect(setError).toHaveBeenCalledWith(errorData);
    });
    it('getNotification', () => {
        setupSocketListeners(store, router);
        const testData = [{
            notificationId: 1,
            taskId: 1,
            name: 'test',
            message: 'test message',
            isChecked: false,
            createdAt: '2025-01-20'
        }];
        expect(store.dispatch).not.toHaveBeenCalled();
        SocketEmit.socket.emit('getNotification', testData);
        expect(store.dispatch).toHaveBeenCalledTimes(1);
        expect(store.dispatch).toHaveBeenCalledWith('notificationModule/getNotificationLog', testData);
    });
    it('getNewNotification', () => {
        setupSocketListeners(store, router);
        const testData = {
            notificationId: 1,
            taskId: 1,
            name: 'test',
            message: 'test message',
            isChecked: false,
            createdAt: '2025-01-20'
        };
        expect(store.dispatch).not.toHaveBeenCalled();
        SocketEmit.socket.emit('getNewNotification', testData);
        expect(store.dispatch).toHaveBeenCalledTimes(1);
        expect(store.dispatch).toHaveBeenCalledWith('notificationModule/getNewNotificationLog', testData);
    });
    it('taskRoom', () => {
        setupSocketListeners(store, router);
        const testData = [{userId: 1, name: 'test'}];
        expect(store.dispatch).not.toHaveBeenCalled();
        SocketEmit.socket.emit('taskRoom', testData);
        expect(store.dispatch).toHaveBeenCalledTimes(1);
        expect(store.dispatch).toHaveBeenCalledWith('taskModule/setTaskRoom', testData);
    });
    it('createTask', () => {
        setupSocketListeners(store, router);
        const testData = {
            taskId: 1,
            name: 'test',
            description: 'test description',
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
        expect(store.dispatch).not.toHaveBeenCalled();
        SocketEmit.socket.emit('createTask', testData);
        expect(store.dispatch).toHaveBeenCalledTimes(1);
        expect(store.dispatch).toHaveBeenCalledWith('projectModule/createTaskAC', testData);
    });
    it('updateTask', async () => {
        const notCurrentProjectState = {...store, state: {projectModule: {currentProject: {}}}};
        setupSocketListeners(notCurrentProjectState, router);
        const testData = {
            taskId: 1,
            name: 'test',
            description: 'test description',
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
        expect(notCurrentProjectState.dispatch).not.toHaveBeenCalled();
        SocketEmit.socket.emit('updateTask', testData);
        await flushPromises();
        expect(notCurrentProjectState.dispatch).toHaveBeenCalledTimes(1);
        expect(notCurrentProjectState.dispatch).toHaveBeenCalledWith('taskModule/updateTaskAC', testData);
        vi.clearAllMocks();
        const currentProjectState = {...store, state: {projectModule: {currentProject: {projectId:1}}}};
        setupSocketListeners(currentProjectState, router);
        expect(currentProjectState.dispatch).not.toHaveBeenCalled();
        SocketEmit.socket.emit('updateTask', testData);
        await flushPromises();
        expect(currentProjectState.dispatch).toHaveBeenCalledTimes(2);
        expect(currentProjectState.dispatch).toHaveBeenCalledWith('taskModule/updateTaskAC', testData);
        expect(currentProjectState.dispatch).toHaveBeenCalledWith('projectModule/updateTaskAC', testData);
    });
    //TODO
})
