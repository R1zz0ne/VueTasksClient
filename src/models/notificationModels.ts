export interface INotificationsModuleState {
    actionNotifications: IActionNotification[],
    notificationLog: INotificationsLog[]
}

export interface IActionNotification {
    message: string,
    type: 'error' | 'info' | 'success' | 'warning'
}

export interface INotificationsLog {
    notificationId: number,
    taskId: number,
    name: string,
    message: string,
    isChecked: boolean,
    createdAt: Object,
}