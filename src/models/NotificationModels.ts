export interface INotificationsModuleState {
    actionNotifications: IActionNotification[],
    notification_log: INotificationsLog[]
}

export interface IActionNotification {
    message: string,
    isChecked: boolean,
    type: 'error' | 'info' | 'success' | 'warning'
}

export interface INotificationsLog {
    notification_id: number,
    task_id: number,
    name: string,
    message: string,
    isChecked: boolean,
    created_at: Object,
}