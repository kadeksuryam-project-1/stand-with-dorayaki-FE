import {useEffect, useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import clsx from 'clsx';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import CircularProgress from '@material-ui/core/CircularProgress';
import Collapse from '@material-ui/core/Collapse';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import EditIcon from '@material-ui/icons/Edit';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import DeleteIcon from '@material-ui/icons/Delete';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { getProvinsi, getKabupaten, getKecamatan } from '../utils/fetchDataDaerah'
import { API_BASE_URL } from '../utils/config'
import axios from 'axios'
import { StoreEditDialogField, StoreProp } from '../types/Store';

const useStyles = makeStyles((theme) => ({
  root: {
     width: "25vh"
  },
  media: {
    height: 0,
    paddingTop: '100%'
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  }
}));

const EditDialog = (prop: StoreProp) => {
    const [open, setOpen] = useState<boolean>(false)
    const [dataDaerah, setDataDaerah] = useState({"provinsi" : [], "kabupaten" : [], "kecamatan" : []})
    const [editField, setEditField] = useState<StoreEditDialogField>({...prop.dataStore, imageBlob: null})
    const [updateOps, setUpdateOps] = useState<boolean>(false)

    useEffect(() => {
        const getAllDataBeg = async () => {
            try{
                const resProvinsi = await getProvinsi()
                const provId = 
                    resProvinsi.filter(prov => (prov.nama) === (dataToko.provinsi))[0].id
                const resKabupaten = await getKabupaten(provId)
                const kabId = 
                    resKabupaten.filter(kab => (kab.nama) === (dataToko.kabupaten))[0].id
                const resKecamatan = await getKecamatan(kabId)
                setDataDaerah({...dataDaerah, "provinsi": resProvinsi, "kabupaten": resKabupaten, "kecamatan" : resKecamatan})
                setEditField({...dataToko, provinsi: dataToko.provinsi, 
                    kabupaten: dataToko.kabupaten, kecamatan: dataToko.kecamatan})
            } catch(err){
                let errMsg = err.message.toString()
                if(err.response)
                    if(err.response.data.error)
                         errMsg = err.response.data.error
                setNotif({...notif, open: true, type: "error", msg: errMsg})
            }

        } 
        getAllDataBeg()
    },[open])

    const handleClickOpen = () => {
      setOpen(true)
    }
  
    const handleClose = () => {
      setOpen(false)
    }

    const handleOnProvinsiChange = async (event, val, reason) => {
        if(reason === "clear"){
            setEditField({...editField, provinsi: "", kabupaten: "", kecamatan: ""})
        }
        else if(val){
            try{
                const res = await getKabupaten(val.id)
                setEditField({...editField, provinsi: val.nama, kabupaten : "", kecamatan : ""})
                setDataDaerah({...dataDaerah, "kabupaten": res})
            }catch(err){
                let errMsg = err.message.toString()
                if(err.response)
                    if(err.response.data.error)
                         errMsg = err.response.data.error
                setNotif({...notif, open: true, type: "error", msg: errMsg})
            }
        }
    }

    const handleOnKabupatenChange = async (event, val, reason) => {
        if(reason === "clear"){
            setEditField({...editField, kabupaten: "", kecamatan: ""})
        }
        else if(val){
            try{
                const res = await getKecamatan(val.id)
                setEditField({...editField, kabupaten : val.nama, kecamatan : ""})
                setDataDaerah({...dataDaerah, "kecamatan": res})
            }catch(err){
                let errMsg = err.message.toString()
                if(err.response)
                    if(err.response.data.error)
                         errMsg = err.response.data.error
                setNotif({...notif, open: true, type: "error", msg: errMsg})
            }
        }
    }

    const handleOnKecamatanChange = (event, val, reason) => {
        if(reason === "clear"){
            setEditField({...editField, kecamatan: ""})
        }
        else if(val){
            setEditField({...editField, kecamatan: val.nama})
        }
    }

    const handleEdit = async () => {
        setUpdateOps(true)
        try{
            const updateURL = API_BASE_URL + `/toko-dorayakis/${dataToko._id}`
            const {nama, jalan, kabupaten, kecamatan, provinsi, pngFile} = editField

            let formData = new FormData()
            if(nama) formData.append("nama", nama)
            if(jalan) formData.append("jalan", jalan)
            if(kabupaten) formData.append("kabupaten", kabupaten)
            if(kecamatan) formData.append("kecamatan", kecamatan)
            if(provinsi) formData.append("provinsi", provinsi)
            if(pngFile) formData.append("gambar", pngFile)

            await axios.put(updateURL, formData )
            await syncDataTokos()
            setNotif({...notif, open: true, type: "success", msg: "toko berhasil diupdate"})
            setOpen(false)
        }catch(err){
            let errMsg = err.message.toString()
            if(err.response)
                if(err.response.data.error)
                     errMsg = err.response.data.error
            setNotif({...notif, open: true, type: "error", msg: errMsg})
        }
        finally{
            setUpdateOps(false)
        }
    }

    const checkEditFieldChanged = () => {
        return !(
            dataToko.nama === editField.nama &&
            dataToko.provinsi === editField.provinsi &&
            dataToko.kabupaten === editField.kabupaten &&
            dataToko.kecamatan === editField.kecamatan &&
            dataToko.jalan === editField.jalan &&
            !(editField.pngFile)
        )
    }

    return (
      <div>
        <Button size="small" variant="contained" color="primary"
            startIcon={<EditIcon />} onClick={handleClickOpen}>
          Edit
        </Button>
        <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
          <DialogTitle id="form-dialog-title">Edit Toko</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Silahkan edit data toko dengan data yang benar.
            </DialogContentText>
            <form></form>
            <TextField autoFocus 
                value={editField.nama}
                style={{ maxWidth: 400 }} margin="dense" label="Nama" type="text" 
                fullWidth  variant="outlined"
                onChange={(e) => setEditField({...editField, "nama" : e.target.value})}
            />
            <Autocomplete
                value={{nama: editField.provinsi}}
                options={dataDaerah["provinsi"]}
                getOptionSelected={(option, value) => value.nama ? (option.nama === value.nama) : true}
                getOptionLabel={(option) => option.nama ? option.nama : ''}
                style={{ maxWidth: 400 }}
                onChange={handleOnProvinsiChange}
                renderInput={(params) => <TextField {...params}  margin="dense" fullWidth label="Provinsi" variant="outlined" />}
            />
            <Autocomplete
                value={{nama: editField.kabupaten}}
                options={dataDaerah["kabupaten"]}
                getOptionSelected={(option, value) => value.nama ? (option.nama === value.nama) : true}
                getOptionLabel={(option) => option.nama ? option.nama : ''}
                style={{ maxWidth: 400 }}
                onChange={handleOnKabupatenChange}
                renderInput={(params) => <TextField {...params}  margin="dense" fullWidth label="Kabupaten" variant="outlined" />}
            />
            <Autocomplete
                value={{nama: editField.kecamatan}}
                options={dataDaerah["kecamatan"]}
                getOptionSelected={(option, value) => value.nama ? (option.nama === value.nama) : true}
                getOptionLabel={(option) => option.nama ? option.nama : ''}
                style={{ maxWidth: 400 }}
                onChange={handleOnKecamatanChange}
                renderInput={(params) => <TextField {...params} margin="dense" fullWidth label="Kecamatan" variant="outlined" />}
            />
            <TextField  
                value={editField.jalan}
                style={{ maxWidth: 400 }} margin="dense" label="Jalan" type="text" 
                fullWidth  variant="outlined"
                onChange={(e) => setEditField({...editField, "jalan" : e.target.value})}
            />
            <div>
                Gambar
                <div style={{display: "grid"}}> 
                    <input
                        accept="image/png"
                        type="file"
                        onChange={(e) => setEditField({...editField, pngFile: e.target.files[0]})}
                    />
                </div>
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
                Cancel
            </Button>
            {
                !updateOps
                    ?
                    checkEditFieldChanged()
                        ?
                            <Button onClick={handleEdit} variant="contained" color="primary" autoFocus>
                                Update
                            </Button> 
                        :
                            <Button onClick={handleEdit} disabled variant="contained" color="primary" autoFocus>
                                Update
                            </Button> 
                    : 
                        <Button onClick={handleEdit} disabled variant="contained" color="primary" autoFocus>
                            <CircularProgress size={20}/> Updating...
                        </Button>
            }
          </DialogActions>
        </Dialog>
      </div>
    )
}

const DeleteDialog = ({dataToko, syncDataTokos, notif, setNotif}) => {
    const [open, setOpen] = useState(false)
    const [deleteOps, setDeleteOps] = useState(false)


    const handleClickOpen = () => {
        setOpen(true)
    }

    const handleClose = () => {
        setOpen(false)
    }

    const handleDelete = async () => {
        setDeleteOps(true)
        try{
            const deleteURL = API_BASE_URL + `/toko-dorayakis/${dataToko._id}`
            await axios.delete(deleteURL)
            setNotif({...notif, open: true, type: "success", msg: "toko berhasil dihapus"})
            setOpen(false)
            await syncDataTokos()
        }catch(err){
            let errMsg = err.message.toString()
            if(err.response)
                if(err.response.data.error)
                     errMsg = err.response.data.error
            setNotif({...notif, open: true, type: "error", msg: errMsg})
        }
    }
    return (
        <div>
            <Button size="small" variant="contained" style={{backgroundColor: "#bf360c", color: 'inherit'}}
                startIcon={<DeleteIcon />} onClick={handleClickOpen}>
                    Delete
            </Button>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{`Delete Toko ${dataToko.nama}?`}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Penghapusan toko akan berdampak dihapusnya semua stok dorayaki toko tersebut.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} variant="contained" color="primary">
                        Cancel
                    </Button>
                    {
                        !deleteOps
                        ?
                            <Button onClick={handleDelete} variant="contained" style={{backgroundColor: "#bf360c"}} autoFocus>
                                Delete
                            </Button>
                        : 
                            <Button onClick={handleDelete} disabled variant="contained" style={{color: "#bf360c"}} autoFocus>
                                <CircularProgress size={20}/> Deleting...
                            </Button>
                    }
                </DialogActions>
            </Dialog>
      </div>
    )
}

const Toko = ({dataToko, syncDataTokos, notif, setNotif, changeRoute}) => {
    const classes = useStyles()

    const [showDetails, setShowDetails] = useState(false)

    const handleShowDetails = () => setShowDetails(!showDetails)

    const handleTokoStok = () => {
        changeRoute(`/toko-dorayaki/stok/${dataToko._id}`)
    }

    return(
        <Card className={classes.root}>
            <CardActionArea onClick={handleTokoStok} style={{height: "33vh"}}>
                <CardMedia
                    className={classes.media}
                    image={API_BASE_URL + dataToko.gambar}
                    title={dataToko.nama}
                />
                <CardContent>
                    <Typography gutterBottom variant="h6" component="h2">
                        {dataToko.nama}
                    </Typography>
                </CardContent>
            </CardActionArea>
            <CardActions style={{display: "flex", justifyContent: "space-between"}}>
                <EditDialog dataToko={dataToko}  syncDataTokos={syncDataTokos}
                    notif={notif} setNotif={setNotif}/>
                <DeleteDialog dataToko={dataToko} syncDataTokos={syncDataTokos}
                    notif={notif} setNotif={setNotif}/>
                <IconButton
                    className={clsx(classes.expand, {
                        [classes.expandOpen]: showDetails,
                    })}
                    onClick={handleShowDetails}
                    aria-expanded={showDetails}
                    aria-label="show more"
                    >
                    <ExpandMoreIcon />
                </IconButton>
            </CardActions>
            <Collapse in={showDetails} timeout="auto" unmountOnExit>
                <CardContent>
                    <Typography><strong>Alamat Toko</strong></Typography>
                    <br/>
                    <Typography><strong>Jalan: </strong> {dataToko.jalan}</Typography>
                    <Typography><strong>Kecamatan: </strong>{dataToko.kecamatan}</Typography>
                    <Typography><strong>Kabupaten: </strong> {dataToko.kabupaten}</Typography>
                    <Typography><strong>Provinsi: </strong> {dataToko.provinsi}</Typography>
                </CardContent>
            </Collapse>
        </Card>
    )
}

export default Toko

