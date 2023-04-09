import { NotificationProp } from "./NotificationProp"

export interface Store {
    id: number,
    name: string,
    street: string,
    subdistrict: string,
    district: string,
    province: string,
    image: string,
    created_at: string,
    updated_at: string
}

export interface StoreProp extends NotificationProp {
    dataStore: Store
    syncDataDorayakis: () => Promise<void>
}

export interface StoreEditDialogField extends Store {
    imageBlob: File | null
}
