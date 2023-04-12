import Grow from '@material-ui/core/Grow'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Stock from '../components/Stock'
import { API_BASE_URL } from '../config/config'
import { Stock as StockType, StockPageProp } from '../types/Stock'
import { Store } from '../types/Store'
import { SuccessResWithData } from '../types/SuccessResWithData'
const stylesPar = {
    "display": "flex",
    "justifyContent": "flex-start",
    "flexWrap" : "wrap"
}

const StockPage = (prop: StockPageProp) => {
    const [stocks, setStocks] = useState<Array<StockType>>([])
    const { id } = useParams<{id: string}>()
    const currStore: Store = stocks[0]?.Store

    useEffect(() => {
        const getStok = async () => {
            try{
                const stokURL = API_BASE_URL + `/v1/stocks?store_id=${id}`
                const newTokoStoks = (await axios.get<SuccessResWithData<Array<StockType>>>(stokURL)).data.data

                setStocks(newTokoStoks)
            } catch(err){
                let errMsg: string = "Error getStok"
                if(err instanceof Error) {
                    errMsg = err.message.toString();
                }
                prop.setNotif({...prop.notif, isOpen: true, type: "error", msg: errMsg})
            }
        }
        getStok()
    }, [])
    
    const syncDataStocks = async () => {
        try{
            const stokURL = API_BASE_URL + `/v1/stocks?store_id=${id}`
            const newTokoStoks = (await axios.get<SuccessResWithData<Array<StockType>>>(stokURL)).data.data

            setStocks(newTokoStoks)
        } catch(err){
            let errMsg: string = "Error syncDataStocks"
            if(err instanceof Error) {
                errMsg = err.message.toString();
            }
            prop.setNotif({...prop.notif, isOpen: true, type: "error", msg: errMsg})
        }
    }

    return (
        (currStore) ? (
            <div style={{minHeight: "100vh"}}>
                <Typography variant="h4" style={{marginLeft: "1rem"}}>
                    <strong>Stok Dorayaki Toko {currStore.name}</strong>
                </Typography>
                <div style={stylesPar as React.CSSProperties}>
                    {
                        stocks.map((stock, idx) => (
                            <div key={idx}>
                                <Grow in={true} key={idx}>
                                    <Paper  elevation={10} key={idx} style={{"margin" : "1rem"}}>
                                        <Stock key={idx} dataStock={stock}
                                            notif={prop.notif} setNotif={prop.setNotif}
                                            syncDataStocks={syncDataStocks}
                                        />
                                    </Paper>
                                </Grow>
                            </div>
                        ))
                    }
                </div>
            </div>) 
        : <></>
    )
}

export default StockPage