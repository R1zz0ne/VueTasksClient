import {taskPriorityMap, taskStatusMap} from "../utils/constants.ts";
import {Ref} from "vue";

export interface IPageInfo {
    page: number,
    totalPages: number,
    totalRecords: number
}

export type IInputType = "password" | "text"

export interface IMInputProps {
    placeholder?: string,
    modelValue?: string,
    readonly?: boolean
}

export type ISelectPropsElements = typeof taskStatusMap | typeof taskPriorityMap

export interface ISelectProps {
    modelValue: string | null,
    elements: ISelectPropsElements,
    type: 'number' | 'string'
}

export interface ISelectedInputUserProps {
    selectUser: {
        userId: number,
        name: string
    },
    setSelectUser: Function
}

export interface IIsFocus {
    wasFocus: boolean,
    focus: boolean
}

export interface IMTextareaProps {
    modelValue?: string
    rows?: string
    disabled?: boolean
}

export interface IUseSnackbarReturn {
    showSnackBar: () => void,
    closeSnackBar: () => void,
    show: Ref<boolean>
}

export interface IError {
    type: "error",
    message: string,
    errors?: string[],
    statusCode?: number
}

export type ISocketEmitResponse<T> = IError | T