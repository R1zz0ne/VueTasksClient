import {IAuthResponse} from "../models/userModels.ts";
import {SocketEmit} from "./socketEmit.ts";
import {io} from "socket.io-client";
import {afterEach, beforeEach, describe, expect, it, vi} from "vitest";
import {ITaskRequestUpdStatus, ITaskUpdateRequest} from "../models/taskModels.ts";

vi.hoisted(() => {
    Object.defineProperty(global, "localStorage", {
        value: {
            getItem: vi.fn((key: string) => {
                if (key === 'refresh') {
                    return 'refresh-token'
                }
                if (key === 'token') {
                    return 'access-token'
                }
                return null;
            }),
            setItem: vi.fn(),
            removeItem: vi.fn()
        },
        writable: true,
    })
})
vi.mock('socket.io-client', () => {
    const emitMock = vi.fn();
    return {
        io: vi.fn(() => ({
            emit: emitMock,
            auth: {},
            disconnect: vi.fn().mockReturnThis(),
            connect: vi.fn()
        })),
    };
});

describe('SocketEmit', () => {
    let socketEmit: SocketEmit;
    let mockSocket: any;

    beforeEach(() => {
        socketEmit = new SocketEmit();
        mockSocket = io();
    });
    afterEach(() => {
        mockSocket.emit.mockClear();
    });

    it('#createPromiseEmit. Успешный ответ сразу', async () => {
        const testData = {email: 'test@test.com', password: 'password'};
        const testResponse = {success: true};
        // @ts-ignore
        mockSocket.emit.mockImplementation((event: string, data: any, callback: Function) => {
            callback(testResponse);
        });
        await expect(socketEmit.loginEmit(testData)).resolves.toEqual(testResponse);
    });
    it('#createPromiseEmit. Возврат ошибки сразу если не ошибка авторизации', async () => {
        const testData = {email: 'test@test.com', password: 'password'};
        const errorResponse = {statusCode: 500, type: "error", message: 'Server error'};
        // @ts-ignore
        mockSocket.emit.mockImplementation((event, data, callback) => {
            callback(errorResponse);
        });
        await expect(socketEmit.loginEmit(testData)).rejects.toEqual(errorResponse);
    });
    it('#createPromiseEmit. Успешный ответ после ошибки авторизации', async () => {
        const testData = {email: 'test@test.com', password: 'password'};
        const error401 = {statusCode: 401, type: "error"};
        const successResponse: IAuthResponse = {
            accessToken: 'accessToken',
            refreshToken: 'refreshToken',
            user: {userId: 1, name: 'тест', email: 'test@test.com'}
        };
        // @ts-ignore
        mockSocket.emit.mockImplementationOnce((event, data, callback) => {
            if (event === 'login') {
                callback(error401);
            }
        });
        // @ts-ignore
        mockSocket.emit.mockImplementationOnce((event, data, callback) => {
            if (event === 'refresh') {
                callback(successResponse);
            }
        });
        // @ts-ignore
        mockSocket.emit.mockImplementationOnce((event, data, callback) => {
            if (event === 'login') {
                callback(successResponse);
            }
        });

        await expect(socketEmit.loginEmit(testData)).resolves.toEqual(successResponse);
        expect(mockSocket.emit).toHaveBeenCalledTimes(3);
        expect(mockSocket.emit).toHaveBeenNthCalledWith(1, 'login', testData, expect.any(Function));
        expect(mockSocket.emit).toHaveBeenNthCalledWith(2, 'refresh', {refreshToken: 'refresh-token'}, expect.any(Function));
        expect(mockSocket.emit).toHaveBeenNthCalledWith(3, 'login', testData, expect.any(Function));
    });
    it('#createPromiseEmit. Возврат ошибки после refresh при повторной попытке', async () => {
        const testData = {email: 'test@test.com', password: 'password'};
        const error401 = {statusCode: 401, type: "error"};
        const refreshError = new Error('Refresh failed');
        // @ts-ignore
        mockSocket.emit.mockImplementation((event, data, callback) => {
            callback(error401);
        });
        socketEmit.refreshEmit = vi.fn().mockRejectedValueOnce(refreshError);
        await expect(socketEmit.loginEmit(testData)).rejects.toEqual(refreshError);
    });
    it('loginEmit. Успешный ответ', async () => {
        const testData = {email: 'test@test.com', password: 'password'};
        const testResponse = {
            accessToken: 'response-accessToken', refreshToken: 'response-refreshToken', user: {
                userId: 1, name: 'test', email: 'test@test.com'
            }
        };
        // @ts-ignore
        mockSocket.emit.mockImplementation((event, data, callback) => {
            callback(testResponse);
        });
        const response = await socketEmit.loginEmit(testData);
        expect(mockSocket.emit).toHaveBeenCalledTimes(1);
        expect(mockSocket.emit).toHaveBeenCalledWith('login', testData, expect.any(Function));
        expect(response).toEqual(testResponse);
        expect(socketEmit.socket.auth).toEqual({accessToken: 'response-accessToken'});
        expect(socketEmit.socket.disconnect).toHaveBeenCalledTimes(1);
        expect(socketEmit.socket.disconnect().connect).toHaveBeenCalledTimes(1);
    });
    it('loginEmit. Ошибка', async () => {
        const testData = {email: 'test@test.com', password: 'password'};
        const errorResponse = {statusCode: 500, type: "error"};
        // @ts-ignore
        mockSocket.emit.mockImplementation((event, data, callback) => {
            callback(errorResponse);
        });
        await expect(socketEmit.loginEmit(testData)).rejects.toEqual(errorResponse);
        expect(mockSocket.emit).toHaveBeenCalledTimes(1);
        expect(mockSocket.emit).toHaveBeenCalledWith('login', testData, expect.any(Function));
        expect(socketEmit.socket.auth).toEqual({});
        expect(socketEmit.socket.disconnect).toHaveBeenCalledTimes(0);
        expect(socketEmit.socket.disconnect().connect).toHaveBeenCalledTimes(0);
    });
    it('registrationEmit. Успешный ответ', async () => {
        const testData = {email: 'test@test.com', name: 'test', password: 'password'};
        const testResponse = {
            accessToken: 'response-accessToken', refreshToken: 'response-refreshToken', user: {
                userId: 1, name: 'test', email: 'test@test.com'
            }
        };
        // @ts-ignore
        mockSocket.emit.mockImplementation((event, data, callback) => {
            callback(testResponse);
        })
        const response = await socketEmit.registrationEmit(testData);
        expect(mockSocket.emit).toHaveBeenCalledTimes(1);
        expect(mockSocket.emit).toHaveBeenCalledWith('registration', testData, expect.any(Function));
        expect(response).toEqual(testResponse);
        expect(socketEmit.socket.auth).toEqual({accessToken: 'response-accessToken'});
        expect(socketEmit.socket.disconnect).toHaveBeenCalledTimes(1);
        expect(socketEmit.socket.disconnect().connect).toHaveBeenCalledTimes(1);
    });
    it('registrationEmit. Ошибка', async () => {
        const testData = {email: 'test@test.com', name: 'test', password: 'password'};
        const errorResponse = {statusCode: 500, type: "error"};
        // @ts-ignore
        mockSocket.emit.mockImplementation((event, data, callback) => {
            callback(errorResponse);
        });
        await expect(socketEmit.registrationEmit(testData)).rejects.toEqual(errorResponse);
        expect(mockSocket.emit).toHaveBeenCalledTimes(1);
        expect(mockSocket.emit).toHaveBeenCalledWith('registration', testData, expect.any(Function));
        expect(socketEmit.socket.auth).toEqual({});
        expect(socketEmit.socket.disconnect).toHaveBeenCalledTimes(0);
        expect(socketEmit.socket.disconnect().connect).toHaveBeenCalledTimes(0);
    });
    it('logoutEmit. Успешный ответ', async () => {
        const testData = {refreshToken: 'response-refreshToken'};
        const testResponse = 'success';
        // @ts-ignore
        mockSocket.emit.mockImplementation((event, data, callback) => {
            callback(testResponse);
        })
        const response = await socketEmit.logoutEmit(testData);
        expect(mockSocket.emit).toHaveBeenCalledTimes(1);
        expect(mockSocket.emit).toHaveBeenCalledWith('logout', testData, expect.any(Function));
        expect(response).toEqual(testResponse);
    });
    it('logoutEmit. Ошибка', async () => {
        const testData = {refreshToken: 'response-refreshToken'};
        const errorResponse = {statusCode: 500, type: "error"};
        // @ts-ignore
        mockSocket.emit.mockImplementation((event, data, callback) => {
            callback(errorResponse);
        });
        await expect(socketEmit.logoutEmit(testData)).rejects.toEqual(errorResponse);
        expect(mockSocket.emit).toHaveBeenCalledTimes(1);
        expect(mockSocket.emit).toHaveBeenCalledWith('logout', testData, expect.any(Function));
    });
    it('refreshEmit. Успешный ответ', async () => {
        const testData = {refreshToken: 'data-refreshToken'};
        const testResponse = {
            accessToken: 'response-accessToken', refreshToken: 'response-refreshToken', user: {
                userId: 1, name: 'test', email: 'test@test.com'
            }
        };
        // @ts-ignore
        mockSocket.emit.mockImplementation((event, data, callback) => {
            callback(testResponse);
        });
        const response = await socketEmit.refreshEmit(testData);
        expect(mockSocket.emit).toHaveBeenCalledTimes(1);
        expect(mockSocket.emit).toHaveBeenCalledWith('refresh', testData, expect.any(Function));
        expect(response).toEqual(testResponse);
        expect(socketEmit.socket.auth).toEqual({accessToken: 'response-accessToken'});
        expect(socketEmit.socket.disconnect).toHaveBeenCalledTimes(1);
        expect(socketEmit.socket.disconnect().connect).toHaveBeenCalledTimes(1);
    });
    it('refreshEmit. Ошибка', async () => {
        const testData = {refreshToken: 'data-refreshToken'};
        const errorResponse = {statusCode: 500, type: "error"};
        // @ts-ignore
        mockSocket.emit.mockImplementation((event, data, callback) => {
            callback(errorResponse);
        });
        await expect(socketEmit.refreshEmit(testData)).rejects.toEqual(errorResponse);
        expect(mockSocket.emit).toHaveBeenCalledTimes(1);
        expect(mockSocket.emit).toHaveBeenCalledWith('refresh', testData, expect.any(Function));
        expect(socketEmit.socket.auth).toEqual({});
        expect(socketEmit.socket.disconnect).toHaveBeenCalledTimes(0);
        expect(socketEmit.socket.disconnect().connect).toHaveBeenCalledTimes(0);
    });
    it('getUsersEmit. Успешный ответ', async () => {
        const testData = {query: 'test'};
        const testResponse = [{userId: 1, name: 'test', email: 'test@test.com'}];
        // @ts-ignore
        mockSocket.emit.mockImplementation((event, data, callback) => {
            callback(testResponse);
        });
        const response = await socketEmit.getUsersEmit(testData);
        expect(mockSocket.emit).toHaveBeenCalledTimes(1);
        expect(mockSocket.emit).toHaveBeenCalledWith('getUsers', testData, expect.any(Function));
        expect(response).toEqual(testResponse);
    });
    it('getUsersEmit. Ошибка', async () => {
        const testData = {query: 'test'};
        const errorResponse = {statusCode: 500, type: "error"};
        // @ts-ignore
        mockSocket.emit.mockImplementation((event, data, callback) => {
            callback(errorResponse);
        });
        await expect(socketEmit.getUsersEmit(testData)).rejects.toEqual(errorResponse);
        expect(mockSocket.emit).toHaveBeenCalledWith('getUsers', testData, expect.any(Function));
    });
    it('createProjectEmit', () => {
        const testData = {name: 'test 1', description: 'test2', owner: 2};
        // @ts-ignore
        mockSocket.emit.mockImplementation();
        socketEmit.createProjectEmit(testData);
        expect(mockSocket.emit).toHaveBeenCalledTimes(1);
        expect(mockSocket.emit).toHaveBeenCalledWith('createProject', testData);
    });
    it('updateProjectEmit', () => {
        const testData = {
            projectId: 1,
            name: 'test 1',
            description: 'test2',
            owner: 2
        };
        // @ts-ignore
        mockSocket.emit.mockImplementation();
        socketEmit.updateProjectEmit(testData);
        expect(mockSocket.emit).toHaveBeenCalledTimes(1);
        expect(mockSocket.emit).toHaveBeenCalledWith('updateProject', testData);
    });
    it('getProjectListEmit', () => {
        const testData = 1;
        // @ts-ignore
        mockSocket.emit.mockImplementation();
        socketEmit.getProjectListEmit(testData);
        expect(mockSocket.emit).toHaveBeenCalledTimes(1);
        expect(mockSocket.emit).toHaveBeenCalledWith('getProjectList', {page: testData});
    });
    it('getProjectEmit. Успешный ответ', async () => {
        const testData = {projectId: 1};
        const testResponse = {
            projectId: 2, name: 'test2', description: 'test2 description',
            owner: {userId: 1, name: 'test1', email: 'test1@test.com'},
            tasks: [],
            editor: null
        };
        // @ts-ignore
        mockSocket.emit.mockImplementation((event, data, callback) => {
            callback(testResponse);
        });
        const response = await socketEmit.getProjectEmit(testData);
        expect(mockSocket.emit).toHaveBeenCalledTimes(1);
        expect(mockSocket.emit).toHaveBeenCalledWith('getProject', testData, expect.any(Function));
        expect(response).toEqual(testResponse);
    });
    it('getProjectEmit. Ошибка', async () => {
        const testData = {projectId: 1};
        const errorResponse = {statusCode: 500, type: "error"};
        // @ts-ignore
        mockSocket.emit.mockImplementation((event, data, callback) => {
            callback(errorResponse);
        });
        await expect(socketEmit.getProjectEmit(testData)).rejects.toEqual(errorResponse);
        expect(mockSocket.emit).toHaveBeenCalledWith('getProject', testData, expect.any(Function));
    });
    it('createTaskEmit', () => {
        const testData = {
            name: 'task 1',
            description: 'description 1',
            priority: 'medium',
            completionDate: '22-01-2025',
            projectId: 1,
            member: 2
        };
        mockSocket.emit.mockImplementation();
        socketEmit.createTaskEmit(testData);
        expect(mockSocket.emit).toHaveBeenCalledTimes(1);
        expect(mockSocket.emit).toHaveBeenCalledWith('createTask', testData);
    });
    it('updateStatusTaskEmit', () => {
        const testData: ITaskRequestUpdStatus = {
            taskId: 1,
            status: 'inProgress'
        };
        mockSocket.emit.mockImplementation();
        socketEmit.updateStatusTaskEmit(testData);
        expect(mockSocket.emit).toHaveBeenCalledTimes(1);
        expect(mockSocket.emit).toHaveBeenCalledWith('updateStatusTask', testData);
    });
    it('updateProjectEditor', () => {
        const testData = {
            projectId: 1,
            editor: 2
        };
        mockSocket.emit.mockImplementation();
        socketEmit.updateProjectEditor(testData);
        expect(mockSocket.emit).toHaveBeenCalledTimes(1);
        expect(mockSocket.emit).toHaveBeenCalledWith('updateProjectEditor', testData);
    });
    it('getTaskEmit. Успешный ответ', async () => {
        const testData = {taskId: 1};
        const testResponse = {
            taskId: 1,
            name: 'testTask',
            description: 'description 1',
            priority: 'medium',
            complaintDate: '22-01-2025',
            project: {
                projectId: 1,
                name: 'testProject1',
            },
            member: {userId: 1, name: 'testUser1', email: 'test@test.com'},
            status: 'assigned',
            editor: null
        };
        // @ts-ignore
        mockSocket.emit.mockImplementation((event, data, callback) => {
            callback(testResponse);
        });
        const response = await socketEmit.getTaskEmit(testData);
        expect(mockSocket.emit).toHaveBeenCalledTimes(1);
        expect(mockSocket.emit).toHaveBeenCalledWith('getTask', testData, expect.any(Function));
        expect(response).toEqual(testResponse);
    });
    it('getTaskEmit. Ошибка', async () => {
        const testData = {taskId: 1};
        const errorResponse = {statusCode: 500, type: "error"};
        // @ts-ignore
        mockSocket.emit.mockImplementation((event, data, callback) => {
            callback(errorResponse);
        });
        await expect(socketEmit.getTaskEmit(testData)).rejects.toEqual(errorResponse);
        expect(mockSocket.emit).toHaveBeenCalledWith('getTask', testData, expect.any(Function));
    });
    it('updateTaskEmit', () => {
        const testData: ITaskUpdateRequest = {
            taskId: 1,
            name: 'task 1',
            description: 'description 1',
            priority: 'medium',
            projectId: 1,
            member: 1,
            status: 'assigned',
            completionDate: new Date('22-01-2025')
        };
        mockSocket.emit.mockImplementation();
        socketEmit.updateTaskEmit(testData);
        expect(mockSocket.emit).toHaveBeenCalledTimes(1);
        expect(mockSocket.emit).toHaveBeenCalledWith('updateTask', testData);
    });
    it('updateTaskEditor', () => {
        const testData = {taskId: 1, editor: null};
        mockSocket.emit.mockImplementation();
        socketEmit.updateTaskEditor(testData);
        expect(mockSocket.emit).toHaveBeenCalledTimes(1);
        expect(mockSocket.emit).toHaveBeenCalledWith('updateTaskEditor', testData);
    });
    it('getTaskListEmit', () => {
        const testData = 1;
        mockSocket.emit.mockImplementation();
        socketEmit.getTaskListEmit(testData);
        expect(mockSocket.emit).toHaveBeenCalledTimes(1);
        expect(mockSocket.emit).toHaveBeenCalledWith('getTaskList', {page: testData});
    });
    it('getCloseTaskListEmit', () => {
        const testData = 1;
        mockSocket.emit.mockImplementation();
        socketEmit.getCloseTaskListEmit(testData);
        expect(mockSocket.emit).toHaveBeenCalledTimes(1);
        expect(mockSocket.emit).toHaveBeenCalledWith('getCloseTaskList', {page: testData});
    });
    it('getNotificationLogEmit', () => {
        mockSocket.emit.mockImplementation();
        socketEmit.getNotificationLogEmit();
        expect(mockSocket.emit).toHaveBeenCalledTimes(1);
        expect(mockSocket.emit).toHaveBeenCalledWith('getNotification', null);
    });
    it('checkNotificationEmit. Успешный ответ', async () => {
        const testData = 1;
        const testResponse = {notificationId: 1, isChecked: false};
        // @ts-ignore
        mockSocket.emit.mockImplementation((event, data, callback) => {
            callback(testResponse);
        });
        const response = await socketEmit.checkNotificationEmit(testData);
        expect(mockSocket.emit).toHaveBeenCalledTimes(1);
        expect(mockSocket.emit).toHaveBeenCalledWith('checkNotification', {notificationId: testData}, expect.any(Function));
        expect(response).toEqual(testResponse);
    });
    it('checkNotificationEmit. Ошибка', async () => {
        const testData = 1;
        const errorResponse = {statusCode: 500, type: "error"};
        // @ts-ignore
        mockSocket.emit.mockImplementation((event, data, callback) => {
            callback(errorResponse);
        });
        await expect(socketEmit.checkNotificationEmit(testData)).rejects.toEqual(errorResponse);
        expect(mockSocket.emit).toHaveBeenCalledWith('checkNotification', {notificationId: testData}, expect.any(Function));
    });
    it('joinRoom', () => {
        const testData = {type: 'test', id: 1};
        mockSocket.emit.mockImplementation();
        socketEmit.joinRoom(testData);
        expect(mockSocket.emit).toHaveBeenCalledTimes(1);
        expect(mockSocket.emit).toHaveBeenCalledWith('joinRoom', testData);
    });
    it('leaveRoom', () => {
        const testData = {type: 'test', id: 1};
        mockSocket.emit.mockImplementation();
        socketEmit.leaveRoom(testData);
        expect(mockSocket.emit).toHaveBeenCalledTimes(1);
        expect(mockSocket.emit).toHaveBeenCalledWith('leaveRoom', testData);
    });
});