import { NotificationProp } from "./NotificationProp"

export interface Dorayaki {
    id: number,
    flavor: string,
    description: string,
    image: string,
    created_at: string
    updated_at: string
}

export interface DorayakiProp extends NotificationProp {
    dataDorayaki: Dorayaki
    syncDataDorayakis: () => Promise<void>
}

export interface DorayakiEditDialogField extends Dorayaki {
    imageBlob: File | null
}
