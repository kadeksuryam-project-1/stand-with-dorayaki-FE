import * as React from 'react'
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import CircularProgress from '@material-ui/core/CircularProgress';
import Collapse from '@material-ui/core/Collapse';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Autocomplete, { AutocompleteChangeReason } from '@material-ui/lab/Autocomplete';
import axios from 'axios';
import clsx from 'clsx';
import { useEffect, useState } from 'react';
import { API_BASE_URL } from '../config/config';
import { DataDaerahState, Store, StoreEditDialogField, StoreProp } from '../types/Store';
import { getKabupaten, getKecamatan, getProvinsi } from '../utils/fetchDataDaerah';
import { SuccessResWithData } from '../types/SuccessResWithData';

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
    const [dataDaerah, setDataDaerah] = useState<DataDaerahState>({provinces: [], districts: [], subdistricts: []})
    const [editField, setEditField] = 
        useState<StoreEditDialogField>({
            ...prop.dataStore, 
            imageBlob: null, 
            editProvince: {id: 0, name: ""}, 
            editDistrict: {id: 0, name: ""}, 
            editSubdistrict: {id: 0, name: ""}}
        )

    const [updateOps, setUpdateOps] = useState<boolean>(false)

    useEffect(() => {
        let isMounted = true;
        const getAllDataBeg = async () => {
            try{
                if (isMounted) {
                    const resProvinsi = await getProvinsi()
                    const matchProv = 
                        resProvinsi.filter(prov => (prov.nama) === (prop.dataStore.province))[0]
                    const provId = matchProv.id

                    const resKabupaten = await getKabupaten(provId)
                    const matchKabupaten = 
                        resKabupaten.filter(kab => (kab.nama) === (prop.dataStore.district))[0]
                    const kabId = matchKabupaten.id
                    const resKecamatan = await getKecamatan(kabId)
                    const matchKecamatan = 
                        resKecamatan.filter(kec => (kec.nama) === (prop.dataStore.subdistrict))[0]
                    
                    const newDaerahState: DataDaerahState =  {
                        provinces: resProvinsi.map(provinsi => ({id: provinsi.id,  name: provinsi.nama})),
                        districts: resKabupaten.map(kabupaten => ({id: kabupaten.id,  name: kabupaten.nama})),
                        subdistricts: resKecamatan.map(kecamatan => ({id: kecamatan.id,  name: kecamatan.nama}))
                    }
                    setDataDaerah({...dataDaerah, provinces: newDaerahState.provinces, districts: newDaerahState.districts, 
                        subdistricts: newDaerahState.subdistricts})
                    setEditField({
                        ...editField, 
                        editProvince: {id: matchProv.id, name: matchProv.nama}, 
                        editDistrict: {id: matchKabupaten.id, name: matchKabupaten.nama}, 
                        editSubdistrict: {id: matchKecamatan.id, name: matchKecamatan.nama}
                    })
                }
            } catch(err){
                let errMsg: string = "Error fetching daerah"
                if(err instanceof Error) {
                    let errMsg: string = err.message.toString();
                    throw new Error(errMsg)
                }
                prop.setNotif({...prop.notif, isOpen: true, type: "error", msg: errMsg})
            }

        } 
        if(open) {
            getAllDataBeg();
        }

        return () => {
            isMounted = false;
        };
    },[open])

    const handleClickOpen = () => {
      setOpen(true)
    }

    const handleClose = () => {
      setOpen(false)
    }

    const handleOnProvinsiChange = async (event: React.ChangeEvent<{}>, val: {id: number, name: string} | null, reason: AutocompleteChangeReason) => {
        if(reason === "clear"){
            setEditField({...editField,  province: "", district: "", subdistrict: "",
            editProvince: {id: 0, name: ""}, 
            editDistrict: {id: 0, name: ""}, 
            editSubdistrict: {id: 0, name: ""}
        })
        }
        else if(val){
            try{
                const districts = (await getKabupaten(val.id)).map(district => ({id: district.id, name: district.nama}))
                setEditField({...editField, editProvince: val, province: val.name, district : "", subdistrict : "",
                    editDistrict: {id: 0, name: ""}, 
                    editSubdistrict: {id: 0, name: ""}
                })
                setDataDaerah({...dataDaerah, districts})
            }catch(err){
                let errMsg: string = "Error handleOnProvinsiChange"
                if(err instanceof Error) {
                    let errMsg: string = err.message.toString();
                    throw new Error(errMsg)
                }
                prop.setNotif({...prop.notif, isOpen: true, type: "error", msg: errMsg})
            }
        }
    }

    const handleOnKabupatenChange =  async (event: React.ChangeEvent<{}>, val: {id: number, name: string} | null, reason: AutocompleteChangeReason) => {
        if(reason === "clear"){
            setEditField({...editField, province: "", district: "", subdistrict: "",
            editDistrict: {id: 0, name: ""}, 
            editSubdistrict: {id: 0, name: ""}
        })
        }
        else if(val){
            try{
                const subdistricts = (await getKecamatan(val.id)).map(subdistrict => ({id: subdistrict.id, name: subdistrict.nama}))
                setEditField({...editField, editDistrict: val, district : val.name, subdistrict : "", editSubdistrict: {id: 0, name: ""}})
                setDataDaerah({...dataDaerah, subdistricts})
            }catch(err){
                let errMsg: string = "Error handleOnKabupatenChange"
                if(err instanceof Error) {
                    let errMsg: string = err.message.toString();
                    throw new Error(errMsg)
                }
                prop.setNotif({...prop.notif, isOpen: true, type: "error", msg: errMsg})
            }
        }
    }

    const handleOnKecamatanChange = async (event: React.ChangeEvent<{}>, val: {id: number, name: string} | null, reason: AutocompleteChangeReason) => {
        if(reason === "clear"){
            setEditField({...editField, subdistrict: "",
            editSubdistrict: {id: 0, name: ""}
        })
        }
        else if(val){
            setEditField({...editField, editSubdistrict: val, subdistrict: val.name})
        }
    }

    const handleEdit = async () => {
        setUpdateOps(true)
        try{
            const updateURL = API_BASE_URL + `/v1/stores/${prop.dataStore.id}`
            const {name, street, district, subdistrict, province, imageBlob} = editField

            let formData = new FormData()
            if(name) formData.append("name", name)
            if(street) formData.append("street", street)
            if(district) formData.append("district", district)
            if(subdistrict) formData.append("subdistrict", subdistrict)
            if(province) formData.append("province", province)
            if(imageBlob) formData.append("image", imageBlob)

            await axios.put(updateURL, formData, { withCredentials: true });
            await prop.syncDataStores()
            prop.setNotif({...prop.notif, isOpen: true, type: "success", msg: "toko berhasil diupdate"})
            handleClose()
        } catch(err){
            let errMsg: string = "Error handleEdit"
            if(err instanceof Error) {
                errMsg = err.message.toString();
            }
            prop.setNotif({...prop.notif, isOpen: true, type: "error", msg: errMsg})
        }
        finally{
            setUpdateOps(false)
        }
    }

    const checkEditFieldChanged = () => {
        return (
            editField.name !== "" &&
            editField.province !== "" &&
            editField.district !== "" &&
            editField.subdistrict !== "" &&
            editField.street !== ""
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
                value={editField.name}
                style={{ maxWidth: 400 }} margin="dense" label="Nama" type="text" 
                fullWidth  variant="outlined"
                onChange={(e) => setEditField({...editField, name : e.target.value})}
            />
            <Autocomplete
                value={{id: editField.editProvince.id, name: editField.editProvince.name}}
                options={dataDaerah.provinces}
                getOptionSelected={(option, value) => value.name ? (option.name === value.name) : true}
                getOptionLabel={(option) => option.name ? option.name : ''}
                style={{ maxWidth: 400 }}
                onChange={handleOnProvinsiChange}
                renderInput={(params) => <TextField {...params}  margin="dense" fullWidth label="Provinsi" variant="outlined" />}
            />
            <Autocomplete
                value={{id: editField.editDistrict.id, name: editField.editDistrict.name}}
                options={dataDaerah.districts}
                getOptionSelected={(option, value) => value.name ? (option.name === value.name) : true}
                getOptionLabel={(option) => option.name ? option.name : ''}
                style={{ maxWidth: 400 }}
                onChange={handleOnKabupatenChange}
                renderInput={(params) => <TextField {...params}  margin="dense" fullWidth label="Kabupaten" variant="outlined" />}
            />
            <Autocomplete
                value={{id: editField.editSubdistrict.id, name: editField.editSubdistrict.name}}
                options={dataDaerah.subdistricts}
                getOptionSelected={(option, value) => value.name ? (option.name === value.name) : true}
                getOptionLabel={(option) => option.name ? option.name : ''}
                style={{ maxWidth: 400 }}
                onChange={handleOnKecamatanChange}
                renderInput={(params) => <TextField {...params} margin="dense" fullWidth label="Kecamatan" variant="outlined" />}
            />
            <TextField  
                value={editField.street}
                style={{ maxWidth: 400 }} margin="dense" label="Jalan" type="text" 
                fullWidth  variant="outlined"
                onChange={(e) => setEditField({...editField, street : e.target.value})}
            />
            <div>
                Gambar
                <div style={{display: "grid"}}> 
                    <input
                        accept="image/png"
                        type="file"
                        onChange={(e) => setEditField({...editField, imageBlob: e.target.files?.item(0) || null})}
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

const DeleteDialog = (prop: StoreProp) => {
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
            const deleteURL = API_BASE_URL + `/v1/stores/${prop.dataStore.id}`
            await axios.delete(deleteURL, { withCredentials: true })
            prop.setNotif({...prop.notif, isOpen: true, type: "success", msg: "toko berhasil dihapus"})
            setOpen(false)
            await prop.syncDataStores()
        }catch(err){
            let errMsg: string = "Error handleDelete"
            if(err instanceof Error) {
               errMsg = err.message.toString();
            }
            prop.setNotif({...prop.notif, isOpen: true, type: "error", msg: errMsg})
        } finally {
            setDeleteOps(false)
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
                <DialogTitle id="alert-dialog-title">{`Delete Toko ${prop.dataStore.name}?`}</DialogTitle>
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

const Store = (prop: StoreProp) => {
    const classes = useStyles()

    const [showDetails, setShowDetails] = useState(false)

    const handleShowDetails = () => setShowDetails(!showDetails)

    const handleTokoStok = () => {
        if(prop.changeRoute) {
            prop.changeRoute(`/stock/${prop.dataStore.id}`)
        }
    }

    return(
        <Card className={classes.root}>
            <CardActionArea onClick={handleTokoStok} style={{height: "33vh"}}>
                <CardMedia
                    className={classes.media}
                    image={prop.dataStore.image}
                    title={prop.dataStore.name}
                />
                <CardContent>
                    <Typography gutterBottom variant="h6" component="h2">
                        {prop.dataStore.name}
                    </Typography>
                </CardContent>
            </CardActionArea>
            <CardActions style={{display: "flex", justifyContent: "space-between"}}>
                <EditDialog {...prop}/>
                <DeleteDialog {...prop}/>
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
                    <Typography><strong>Jalan: </strong> {prop.dataStore.street}</Typography>
                    <Typography><strong>Kecamatan: </strong>{prop.dataStore.subdistrict}</Typography>
                    <Typography><strong>Kabupaten: </strong> {prop.dataStore.district}</Typography>
                    <Typography><strong>Province: </strong> {prop.dataStore.province}</Typography>
                </CardContent>
            </Collapse>
        </Card>
    )
}

export default Store
