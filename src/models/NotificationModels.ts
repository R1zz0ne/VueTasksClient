export interface INotificationsModuleState {
    actionNotifications: IActionNotification[],
    notification_log: INotificationsLog[]
}

export interface IActionNotification {
    message: string,
    type: 'error' | 'info' | 'success' | 'warning'
}

export interface INotificationsLog {
    notification_id: number,
    task_id: number,
    name: string,
    message: string,
    is_checked: boolean,
    created_at: Object,
}