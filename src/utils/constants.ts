import {ITaskList} from "../models/taskModels.ts";

export const datePickerFormat = (date: Date) => {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const hour = date.getHours();
    const minutes = date.getMinutes();

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
export const convTaskList = (array: ITaskList[]) => {
    return array.map(el => ({
        ...el,
        status: taskStatusMap[el.status],
        priority: taskPriorityMap[el.priority]
    }))
}