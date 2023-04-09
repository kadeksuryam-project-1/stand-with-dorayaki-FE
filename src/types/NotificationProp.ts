import { NotificationState } from "./NotificationState";

export interface NotificationProp {
    notif: NotificationState,
    setNotif: React.Dispatch<React.SetStateAction<NotificationState>>
}
