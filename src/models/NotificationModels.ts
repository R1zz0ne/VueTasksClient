export interface INotificationsModuleState {
    notifications: INotification[]
}
export interface INotification {
    message: string,
    isChecked: boolean,
    type: 'error' | 'info' | 'success' | 'warning'
}