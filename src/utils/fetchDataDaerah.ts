import axios from 'axios'
import { District, Districts, Province, Provinces, Subdistrict, Subdistricts } from '../types/Utils'

const getProvinsi = async (): Promise<Array<Province>> => {
    try{
        const provinsiURI = 'https://dev.farizdotid.com/api/daerahindonesia/provinsi'
        const provincies = (await axios.get<Provinces>(provinsiURI)).data

        return provincies.provinsi
    } catch(err){
        if(err instanceof Error) {
            let errMsg: string = err.message.toString();
            throw new Error(errMsg)
        }
        throw new Error("Error fetching provincies")
    }
}

const getKabupaten = async (provinsi_id: number): Promise<Array<District>> => {
    try{
        const kabupatenURI = `https://dev.farizdotid.com/api/daerahindonesia/kota?id_provinsi=${provinsi_id}`
        const districts = (await axios.get<Districts>(kabupatenURI)).data

        return districts.kota_kabupaten
    } catch(err){
        if(err instanceof Error) {
            let errMsg: string = err.message.toString();
            throw new Error(errMsg)
        }
        throw new Error("Error fetching districts")
    }
}

const getKecamatan = async (kabupaten_id: number): Promise<Array<Subdistrict>> => {
    try{
        const kecamatanURI = `https://dev.farizdotid.com/api/daerahindonesia/kecamatan?id_kota=${kabupaten_id}`
        const subdistricts = (await axios.get<Subdistricts>(kecamatanURI)).data
        return subdistricts.kecamatan
    } catch(err){
        if(err instanceof Error) {
            let errMsg: string = err.message.toString();
            throw new Error(errMsg)
        }
        throw new Error("Error fetching districts")
    }   
}

export { getProvinsi, getKabupaten, getKecamatan }
