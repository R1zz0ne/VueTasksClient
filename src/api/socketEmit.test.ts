import {IAuthResponse} from "../models/userModels.ts";
import {SocketEmit} from "./socketEmit.ts";
import {io} from "socket.io-client";
import {afterEach, beforeEach, describe, expect, it, vi} from "vitest";

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
            disconnect: vi.fn(() => ({connect: vi.fn()})),
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
    })

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
});
