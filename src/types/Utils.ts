export interface Province {
    id: number,
    nama: string
}
export interface Provinces {
    provinsi: Array<Province>
}

export interface District {
    id: number,
    id_provinsi: string,
    nama: string
}
export interface Districts {
    kota_kabupaten: Array<District>
}

export interface Subdistrict {
    id: number,
    id_kota: string,
    nama: string
}
export interface Subdistricts {
    kecamatan: Array<Subdistrict>
}
