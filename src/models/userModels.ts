export interface IAuthForm {
    email: string,
    password: string
}

export interface IRegForm extends IAuthForm {
    name: string
}

export interface IUserModuleState {
    user: IUser,
    isAuth: boolean
}

export interface IUser {
    userId: number,
    name: string,
    email: string
}

export interface IAuthResponse {
    accessToken: string,
    refreshToken: string,
    user: IUser
}