import {IConvTaskList, ITaskList} from "../models/taskModels.ts";
import {IError, ISocketEmitResponse} from "../models/otherModels.ts";

export const datePickerFormat = (date: Date): string => {
    const day: number = date.getDate();
    const month: number = date.getMonth() + 1;
    const year: number = date.getFullYear();
    const hour: number = date.getHours();
    const minutes: number = date.getMinutes();

    const dayOut: string | number = day.toString().length > 1 ? day : '0' + day;
    const monthOut: string | number = month.toString().length > 1 ? month : '0' + month;
    const hourOut: string | number = hour.toString().length > 1 ? hour : '0' + hour;
    const minOut: string | number = minutes.toString().length > 1 ? minutes : '0' + minutes;

    return `${dayOut}/${monthOut}/${year} ${hourOut}:${minOut}`
}

export enum taskPriorityMap {
    critical = '1 - Критический',
    high = '2 - Высокий',
    medium = '3 - Средний',
    low = '4 - Низкий'
}

export enum taskStatusMap {
    assigned = 'Назначено',
    inProgress = 'В работе',
    completed = 'Завершено'
}

//Функция для преобразования статуса и приоритета списка задач
export const convTaskList = (array: ITaskList[]): IConvTaskList[] => {
    return array.map((el: ITaskList): IConvTaskList => ({
        ...el,
        status: taskStatusMap[el.status],
        priority: taskPriorityMap[el.priority]
    }))
}

//Magic string
export const typeNumber: "number" = "number";
export const typeObject: "object" = "object";
export const modeEdit: "edit" = "edit";
export const isCloseAll: "all" = "all";

export enum pageName {
    tasks = 'tasks',
    projects = 'projects',
    board = 'board'
}

export enum listMode {
    active = 'active',
    completed = 'completed'
}

export const isErrorResponse = <T>(response: ISocketEmitResponse<T>): response is IError => {
    return (response as IError).type === 'error'
}