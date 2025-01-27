export interface INotificationsModuleState {
    actionNotifications: IActionNotification[],
    notificationLog: INotificationsLog[]
}

export interface IActionNotification {
    message: string,
    type: ITypeNotification
}

export type ITypeNotification = 'error' | 'info' | 'success' | 'warning'

export interface ISnackBarProps {
    show: boolean,
    text: string,
    type?: ITypeNotification,
    closeSnackBar: Function
}

export interface INotificationsLog {
    notificationId: number,
    taskId: number,
    name: string,
    message: string,
    isChecked: boolean,
    createdAt: string
}

export interface ICheckNotificationLog extends Pick<INotificationsLog, 'notificationId' | 'isChecked'> {
}