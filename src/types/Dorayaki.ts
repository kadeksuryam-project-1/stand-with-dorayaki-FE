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

export interface DorayakiPageAddDialogProp extends NotificationProp {
    syncDataDorayakis: () => Promise<void>
}


export interface DorayakiPageAddDialogField {
    flavor: string,
    description: string,
    imageBlob: File | null
}

export interface DorayakiPageProp extends NotificationProp {
    dataDorayakis: Array<Dorayaki>
    syncDataDorayakis: () => Promise<void>
}
