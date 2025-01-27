import {describe, it, expect} from "vitest";
import {convTaskList, datePickerFormat, isErrorResponse} from "./constants.ts";
import {ITaskList} from "../models/taskModels.ts";


describe('datePickerFormat', () => {
    it.each([['без элементов с одной цифрой', '2025-10-16T13:49:26', '16/10/2025 13:49'],
        ['день с одной цифрой', '2025-10-03T13:59:59', '03/10/2025 13:59'],
        ['месяц с одной цифрой', '2025-01-16T14:00:00', '16/01/2025 14:00'],
        ['минуты с одной цифрой', '2025-10-16T14:02:00', '16/10/2025 14:02'],
        ['часы с одной цифрой', '2025-10-16T04:10:00', '16/10/2025 04:10']
    ])
    ('Проверка правильной конвертации даты, когда: %s',
        (name, inDate, result) => {
            const date = new Date(inDate);
            const convertDate = datePickerFormat(date);
            expect(convertDate).toBe(result);
        }
    )
})

describe('convTaskList', () => {
    it('Проверка конвертации приоритета и статуса в массиве списка задач', () => {
        const mockTaskList: ITaskList[] = [
            {taskId: 1, name: 'Тест 1', priority: 'critical', status: 'assigned'},
            {taskId: 2, name: 'Тест 2', priority: 'high', status: 'inProgress'},
            {taskId: 3, name: 'Тест 3', priority: 'medium', status: 'completed'},
            {taskId: 4, name: 'Тест 4', priority: 'low', status: 'inProgress'}
        ]
        const expectedResult = [
            {taskId: 1, name: 'Тест 1', priority: '1 - Критический', status: 'Назначено'},
            {taskId: 2, name: 'Тест 2', priority: '2 - Высокий', status: 'В работе'},
            {taskId: 3, name: 'Тест 3', priority: '3 - Средний', status: 'Завершено'},
            {taskId: 4, name: 'Тест 4', priority: '4 - Низкий', status: 'В работе'}
        ]
        const result = convTaskList(mockTaskList);
        expect(result).toEqual(expectedResult);
    })
})

describe('isErrorResponse', () => {
    it.each([
        ['error', {type: "error", message: "test"}, true],
        ['warning', {type: "warning", message: "test"}, false],
        [undefined, {message: "test"}, false],
        [null, {type: null, message: "test"}, false]
    ])('Проверка является ли ответ ошибкой с type = %s', (type, data, result) => {
        const isError = isErrorResponse(data);
        expect(isError).toBe(result);
    })
})