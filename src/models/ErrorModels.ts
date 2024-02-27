export interface IErrorModuleState {
    errors: IError[]
}
export interface IError {
    message: string,
    errors: string[],
    isChecked: boolean
}