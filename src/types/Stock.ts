import { Dispatch, SetStateAction } from "react"
import { Dorayaki } from "./Dorayaki"
import { NotificationProp } from "./NotificationProp"
import { Store } from "./Store"

export interface Stock {
    id: number,
    store_id: number,
    stock: number,
    created_at: string,
    updated_at: string,
    Dorayaki: Dorayaki
    Store: Store
}

export interface StockProp extends NotificationProp {
    dataStock: Stock
    syncDataStocks: () => Promise<void>
    setStockFieldVal?: Dispatch<SetStateAction<string>>
}

export interface StockPageProp extends NotificationProp {
}
