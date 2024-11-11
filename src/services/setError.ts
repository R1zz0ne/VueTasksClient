import {setNotification} from "./setNotification.ts";
import {IError} from "../models/otherModels.ts";

const isIError = (error: any): error is IError => {
    return (
        typeof error === 'object' &&
        error !== null &&
        error.type === "error" &&
        typeof error.message === "string" &&
        (error.errors === undefined || (Array.isArray(error.errors) && error.errors.every((item: any): boolean => typeof item === "string"))) &&
        (error.statusCode === undefined || typeof error.statusCode === "number")
    )
}

export const setError = (error: unknown): void => {
    if (error instanceof Error) {
        setNotification({
            message: error.message,
            type: 'error'
        })
    } else if (isIError(error)) {
        setNotification({
            message: error.message,
            type: 'error'
        })
    } else {
        setNotification({
            message: `Непредвиденный тип ошибки в setError: ${JSON.stringify(error)}`,
            type: 'warning'
        })
    }
}