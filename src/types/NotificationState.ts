import { Color } from "@material-ui/lab";

export interface NotificationState {
    isOpen: boolean,
    type: Color,
    msg: string
}
