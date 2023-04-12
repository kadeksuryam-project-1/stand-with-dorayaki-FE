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
    syncDataStores: () => Promise<void>
    changeRoute?: (route: string) => void
}

export interface StoreEditDialogField extends Store {
    imageBlob: File | null
    editProvince: {id: number, name: string}
    editDistrict: {id: number, name: string}
    editSubdistrict: {id: number, name: string}
}

export interface DataDaerahState {
    provinces: Array<{id: number, name: string}>
    districts: Array<{id: number, name: string}>
    subdistricts: Array<{id: number, name: string}>
}

export interface StorePageAddDialogProp extends NotificationProp {
    syncDataStores: () => Promise<void>
}

export interface StoreAddDialogField {
    name: string ,
    province: string,
    district: string,
    subdistrict: string,
    street: string,
    imageBlob: File | null
    addProvince: {id: number, name: string}
    addDistrict: {id: number, name: string}
    addSubdistrict: {id: number, name: string}
}

export interface StorePageProp extends NotificationProp {
    dataStores: Array<Store>
    syncDataStores: () => Promise<void>
}