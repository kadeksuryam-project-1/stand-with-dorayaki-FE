import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import CircularProgress from '@material-ui/core/CircularProgress';
import { green } from '@material-ui/core/colors';
import Dialog from '@material-ui/core/Dialog';
import Fab from '@material-ui/core/Fab';
import IconButton from '@material-ui/core/IconButton';
import Slide, { SlideProps } from '@material-ui/core/Slide';
import { makeStyles, StyleRules, Theme } from '@material-ui/core/styles';
import TextField from "@material-ui/core/TextField";
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import EditIcon from '@material-ui/icons/Edit';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import SaveIcon from '@material-ui/icons/Save';
import { FontWeightProperty } from '@material-ui/styles/node_modules/csstype';
import React, { useEffect, useState } from 'react';
import { API_BASE_URL } from '../config/config';
import { SuccessResWithData } from '../types/SuccessResWithData';

import axios from 'axios';
import { Stock, StockProp } from '../types/Stock';
const useStyles = makeStyles({
    root: {
        width: "25vh"
    },
    media: {
        height: 0,
        paddingTop: '100%'
    },
    fabProgress: {
        color: green[500],
        position: 'absolute',
        top: -6,
        left: -6,
        zIndex: 1,
    }
});

const useStyleFullScreen = makeStyles((theme: Theme): StyleRules<string> => ({
    appBar: {
      position: 'relative',
    },
    title: {
      marginLeft: theme.spacing(2),
      flex: 1,
    },
    root: {
      width: '100%',
    },
    heading: {
      fontSize: theme.typography.pxToRem(15),
      fontWeight: theme.typography.fontWeightRegular as FontWeightProperty,
    },
    details: {
      flexDirection: "column",
    },
  }));

const Transition = React.forwardRef(function Transition(
    props: SlideProps & { children?: React.ReactElement<any, any> },
    ref: React.Ref<unknown>
  ) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const MoveDorayakiDialog = (prop: StockProp) => {
    const classes = useStyleFullScreen();
    const [open, setOpen] = useState<boolean>(false);
    const [moveField, setMoveField] = useState<string>("0");
    const [moveOps, setMoveOps] = useState<boolean>(false);
    const currStore = prop.dataStock.Store
    const [chosenDorayakiStocks, setChosenDorayakiStocks] = useState<Array<Stock>>([])
    
    const handleClickOpen = async () => {
      let stocks = (await axios.get<SuccessResWithData<Array<Stock>>>(API_BASE_URL + `/v1/stocks?op=basic&dorayaki_id=${prop.dataStock.Dorayaki.id}`, { withCredentials: true })).data.data
      stocks = stocks.filter(stock => (stock.Store.id !== currStore.id))
      setChosenDorayakiStocks(stocks)
      setOpen(true);
    };
  
    const handleClose = async () => {
      await prop.syncDataStocks()
      setMoveField("0");
      setChosenDorayakiStocks([])
      setOpen(false);
    };

    const handleMoveStok = async (destStock: Stock) => {
        setMoveOps(true)
        try{
            const srcStock = prop.dataStock
            const amount = moveField
            await axios.patch(API_BASE_URL + `/v1/stocks/${srcStock.id}?op=tf&tf_dest_id=${destStock.id}&tf_amount=${amount}`,null, { withCredentials: true })
            prop.setNotif({...prop.notif, isOpen: true, type: "success", msg: "stok dorayaki berhasil di pindahkan"})
            await handleClose()
        } catch(err){
            let errMsg: string = "Error handleMoveStok"
            if(err instanceof Error) {
                errMsg = err.message.toString();
            }
            prop.setNotif({...prop.notif, isOpen: true, type: "error", msg: errMsg})
        }
        finally{
            setMoveOps(false)
        }
    }

    return (
      <div>
        <Button size="small"
         variant="outlined" color="primary" 
         style={{margin: "0 auto", display: "flex", marginBottom: "0.5rem"}}
         onClick={handleClickOpen}>
          Pindahkan Stok
        </Button>
        <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
          <AppBar className={classes.appBar}>
            <Toolbar>
              <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
                <CloseIcon />
              </IconButton>
              <Typography variant="h6" className={classes.title}>
                Pindahkan Stok Dorayaki
              </Typography>
            </Toolbar>
          </AppBar>
        <div style={{display: "flex", flexDirection:"column", margin: "1rem auto"}}>
                <TextField
                    id="filled-number"
                    label="Jumlah Pemindahan"
                    type="number"
                    InputProps={{
                        value: moveField,
                        inputProps:{
                            min: 0,
                            max: prop.dataStock.stock
                        }
                    }}
                    size="small"
                    variant="outlined"
                    style={{maxWidth: "10rem"}}
                    onChange={(e) => setMoveField(e.target.value)}
                />
                <Typography><strong>Maximum pemindahan: </strong>{prop.dataStock.stock} stok</Typography>
                <Typography><strong>Toko asal: </strong> Toko {currStore.name} </Typography>
                <Typography><strong>Dorayaki dipindah: </strong> Dorayaki {prop.dataStock.Dorayaki.flavor} </Typography>
        </div>
        <div style={{margin: "1rem"}}>
            <strong>Pindahkan ke Toko: </strong>
            {
                chosenDorayakiStocks.map((stock, key) => {
                    return (
                        <Accordion key={key}>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel1a-content"
                                id="panel1a-header"
                                key={key}
                                >
                                <Typography className={classes.heading}>Toko: {stock.Store.name} | Stok: {stock.stock}</Typography>
                            </AccordionSummary>
                            <AccordionDetails className={classes.details}>
                            {
                                moveOps ?
                                    <Button size="small"
                                        disabled
                                        variant="outlined" color="primary" 
                                        style={{margin: "0 auto", display: "flex", marginBottom: "0.5rem"}}
                                        >
                                         <CircularProgress size={20}/>  Memindahkan...
                                    </Button>
                                :
                                    <Button size="small"
                                        variant="outlined" color="primary" 
                                        style={{margin: "0 auto", display: "flex", marginBottom: "0.5rem"}}
                                        onClick={() => handleMoveStok(stock)}>
                                        Pindahkan ke Toko Ini
                                    </Button>
                            }
                                <Typography><strong>Alamat Toko</strong></Typography>
                                <br/>
                                <Typography><strong>Jalan: </strong> {stock.Store.street}</Typography>
                                <Typography><strong>Kecamatan: </strong>{stock.Store.district}</Typography>
                                <Typography><strong>Kabupaten: </strong> {stock.Store.subdistrict}</Typography>
                                <Typography><strong>Provinsi: </strong> {stock.Store.province}</Typography>
                            </AccordionDetails>
                        </Accordion>        
                    )
                })
            }
        </div>
        </Dialog>
      </div>
    );
}

const Stock = (prop: StockProp) => {
    const classes = useStyles()
    const [stokField, setStokField] = useState(false)
    const [editOps, setEditOps] = useState(false)
    const [stokFieldVal, setStokFieldVal] = useState(prop.dataStock.stock.toString())

    useEffect(() => {
        setStokFieldVal(prop.dataStock.stock.toString())
        setStokField(false)
    }, [prop.dataStock])

    const handleEditStok = async () => {
        if(!stokField){
            setStokField(true)
        }
        else{
            try{
                setEditOps(true)
                const stokEditURL = API_BASE_URL + `/v1/stocks/${prop.dataStock.id}?op=basic` 
                await axios.patch(stokEditURL, {stock: parseInt(stokFieldVal) || 0}, { withCredentials: true })
                setEditOps(false)
                setStokField(false)
                prop.setNotif({...prop.notif, isOpen: true, type: "success", msg: "stok dorayaki berhasil diupdate"})
                await prop.syncDataStocks()
            } catch(err){
                let errMsg: string = "Error handleEditStok"
                if(err instanceof Error) {
                    errMsg = err.message.toString();
                }
                prop.setNotif({...prop.notif, isOpen: true, type: "error", msg: errMsg})
            } finally {
                setEditOps(false)
            }
        }
    }

    return(
        <Card className={classes.root}>
            <div style={{height: "33vh"}}>
                <CardMedia
                    className={classes.media}
                    image={prop.dataStock.Dorayaki.image}
                    title={prop.dataStock.Dorayaki.flavor}
                />
                <CardContent>
                    <Typography gutterBottom variant="h6" component="h2">
                        Dorayaki {prop.dataStock.Dorayaki.flavor}
                    </Typography>
                </CardContent>
            </div>
            <div style={{display:"flex", justifyContent: "space-between"}}>
                <TextField
                    id="filled-number"
                    label="Stok Dorayaki"
                    type="number"
                    InputProps={{
                        disabled: !stokField,
                        value: stokFieldVal
                    }}
                    size="small"
                    variant="outlined"
                    style={{maxWidth: "10rem", marginLeft: "1rem"}}
                    onChange={(e) => setStokFieldVal(e.target.value)}
                />
                <Fab
                    style={{marginRight: "1rem", marginBottom: "1rem"}}
                    size="small"
                    aria-label="save"
                    color="primary"
                    onClick={handleEditStok}
                    >
                    {stokField ? <SaveIcon /> : <EditIcon />}
                    {editOps && <CircularProgress size={50} className={classes.fabProgress} />}
                </Fab>
            </div>
            <div>
                <MoveDorayakiDialog 
                    syncDataStocks={prop.syncDataStocks} 
                    dataStock={prop.dataStock}
                    notif={prop.notif}
                    setNotif={prop.setNotif}
                    setStockFieldVal={setStokFieldVal}/>
            </div>
        </Card>
    )
}

export default Stock