import { Box, Collapse, Divider, FormControlLabel, FormGroup, Grow, IconButton, InputBase, Paper, Switch } from '@material-ui/core'
import Button from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import { makeStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import AddIcon from '@material-ui/icons/Add'
import CloseIcon from '@material-ui/icons/Close'
import SearchIcon from '@material-ui/icons/Search'
import SettingsIcon from '@material-ui/icons/Settings'
import Autocomplete, { AutocompleteChangeReason } from '@material-ui/lab/Autocomplete'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import Store from '../components/Store'
import { API_BASE_URL } from '../config/config'
import { DataDaerahState, Store as StoreType, StoreAddDialogField, StorePageAddDialogProp, StorePageProp } from '../types/Store'
import { getKabupaten, getKecamatan, getProvinsi } from '../utils/fetchDataDaerah'
import useQuery from '../utils/useQuery'

const searchBarStyles = makeStyles((theme) => ({
    root: {
      padding: '2px 4px',
      margin: '0rem auto',
      display: 'flex',
      alignItems: 'center',
      maxWidth: '400px',
    },
    input: {
      marginLeft: theme.spacing(1),
      flex: 1,
    },
    iconButton: {
      padding: 10,
    },
    divider: {
      height: 28,
      margin: 4,
    },
  }));

      
const stylesPar = {
    "display": "flex",
    "justifyContent": "flex-start",
    "flexWrap" : "wrap",
    "minHeight" : "60vh"
}

const AddDialog = (prop: StorePageAddDialogProp) => {
    const [open, setOpen] = useState(false)
    const [addOps, setAddOps] = useState(false)
    const [dataDaerah, setDataDaerah] = useState<DataDaerahState>({provinces: [], districts: [], subdistricts: []})
    const [addField, setAddField] = 
        useState<StoreAddDialogField>({
            name: "",
            province: "",
            district: "",
            subdistrict: "",
            street: "",
            imageBlob: null, 
            addProvince: {id: 0, name: ""}, 
            addDistrict: {id: 0, name: ""}, 
            addSubdistrict: {id: 0, name: ""}})

    const handleClickOpen = () => {
        setOpen(true)
    }
    
    const handleClose = () => {
        setAddField({
            name: "",
            province: "",
            district: "",
            subdistrict: "",
            street: "",
            imageBlob: null, 
            addProvince: {id: 0, name: ""}, 
            addDistrict: {id: 0, name: ""}, 
            addSubdistrict: {id: 0, name: ""}
        })
        setOpen(false)
    }

    useEffect(() => {
        const fetchDataProvinsi = async () => {
            const resProvinsi = await getProvinsi()
            setDataDaerah({...dataDaerah, provinces : resProvinsi.map(provinsi => ({id: provinsi.id,  name: provinsi.nama}))})
            setAddField({...addField, name: "", province: "", district: "", subdistrict: "", street: ""})
        }
        fetchDataProvinsi()
    }, [open])

    const handleOnProvinsiChange = async (event: React.ChangeEvent<{}>, val: {id: number, name: string} | null, reason: AutocompleteChangeReason) => {
        if(reason === "clear"){
            setAddField({...addField, province: "", district: "", subdistrict: "",
                addProvince: {id: 0, name: ""}, 
                addDistrict: {id: 0, name: ""}, 
                addSubdistrict: {id: 0, name: ""}
            })
        }
        else if(val){
            try{
                const districts = (await getKabupaten(val.id)).map(district => ({id: district.id, name: district.nama}))
                setAddField({...addField, addProvince: val, province: val.name, district : "", subdistrict : "",
                    addDistrict: {id: 0, name: ""}, 
                    addSubdistrict: {id: 0, name: ""}
                })
                setDataDaerah({...dataDaerah, districts})
            }catch(err){
                let errMsg: string = "Error handleOnProvinsiChange"
                if(err instanceof Error) {
                    errMsg = err.message.toString();
                }
                prop.setNotif({...prop.notif, isOpen: true, type: "error", msg: errMsg})
            }
        }
    }

    const handleOnKabupatenChange =  async (event: React.ChangeEvent<{}>, val: {id: number, name: string} | null, reason: AutocompleteChangeReason) => {
        if(reason === "clear"){
            setAddField({...addField, province: "", district: "", subdistrict: "",
                addDistrict: {id: 0, name: ""}, 
                addSubdistrict: {id: 0, name: ""}
            })
        }
        else if(val){
            try{
                const subdistricts = (await getKecamatan(val.id)).map(subdistrict => ({id: subdistrict.id, name: subdistrict.nama}))
                setAddField({...addField, addDistrict: val, district : val.name, subdistrict : "",
                    addSubdistrict: {id: 0, name: ""}
                })
                setDataDaerah({...dataDaerah, subdistricts})
            }catch(err){
                let errMsg: string = "Error handleOnKabupatenChange"
                if(err instanceof Error) {
                    errMsg = err.message.toString();
                }
                prop.setNotif({...prop.notif, isOpen: true, type: "error", msg: errMsg})
            }
        }
    }

    const handleOnKecamatanChange = async (event: React.ChangeEvent<{}>, val: {id: number, name: string} | null, reason: AutocompleteChangeReason) => {
        if(reason === "clear"){
            setAddField({...addField, subdistrict: "",
                addSubdistrict: {id: 0, name: ""}
            })
        }
        else if(val){
            setAddField({...addField, addSubdistrict: val, subdistrict: val.name})
        }
    }

    
    const checkAddFieldChanged = () => {
        return (
            addField.name !== "" &&
            addField.province !== "" &&
            addField.district !== "" &&
            addField.subdistrict !== "" &&
            addField.street !== ""
        )
    }
    const handleAdd = async () => {
        setAddOps(true)
        try{
            const addURL = API_BASE_URL + `/v1/stores`
            const {name, street, district, subdistrict, province, imageBlob} = addField

            const formData = new FormData()
            if(name) formData.append("name", name)
            if(street) formData.append("street", street)
            if(district) formData.append("district", district)
            if(subdistrict) formData.append("subdistrict", subdistrict)
            if(province) formData.append("province", province)
            if(imageBlob) formData.append("image", imageBlob)

            await axios.post(addURL, formData)
            await prop.syncDataStores()
            prop.setNotif({...prop.notif, isOpen: true, type: "success", msg: "toko berhasil ditambahkan!"})
            handleClose()
        }catch(err){
            let errMsg: string = "Error handleAdd"
            if(err instanceof Error) {
                errMsg = err.message.toString();
            }
            prop.setNotif({...prop.notif, isOpen: true, type: "error", msg: errMsg})
        }
        finally{
            setAddOps(false)
        }
    }

    return(
        <div style={{display: "grid", "maxWidth" : "7rem",  margin: "1rem auto"}}>
            <Button size="small" variant="contained" color="primary"
                startIcon={<AddIcon />} onClick={handleClickOpen}>
                Add Toko
            </Button>
            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">Add Toko</DialogTitle>
            <DialogContent>
                <DialogContentText>
                Silahkan tambahkan toko dengan data yang benar.
                </DialogContentText>
                <TextField autoFocus 
                    value={addField.name}
                    style={{ maxWidth: 400 }} margin="dense" label="Nama" type="text" 
                    fullWidth  variant="outlined"
                    onChange={(e) => setAddField({...addField, name : e.target.value})}
                />
                <Autocomplete
                    value={{id: addField.addProvince.id, name: addField.addProvince.name}}
                    options={dataDaerah.provinces}
                    getOptionSelected={(option, value) => value.name ? (option.name === value.name) : true}
                    getOptionLabel={(option) => option.name ? option.name : ''}
                    style={{ maxWidth: 400 }}
                    onChange={handleOnProvinsiChange}
                    renderInput={(params) => <TextField {...params}  margin="dense" fullWidth label="Provinsi" variant="outlined" />}
                />
                <Autocomplete
                    value={{id: addField.addDistrict.id, name: addField.addDistrict.name}}
                    options={dataDaerah.districts}
                    getOptionSelected={(option, value) => value.name ? (option.name === value.name) : true}
                    getOptionLabel={(option) => option.name ? option.name : ''}
                    style={{ maxWidth: 400 }}
                    onChange={handleOnKabupatenChange}
                    renderInput={(params) => <TextField {...params}  margin="dense" fullWidth label="Kabupaten" variant="outlined" />}
                />
                <Autocomplete
                    value={{id: addField.addSubdistrict.id, name: addField.addSubdistrict.name}}
                    options={dataDaerah.subdistricts}
                    getOptionSelected={(option, value) => value.name ? (option.name === value.name) : true}
                    getOptionLabel={(option) => option.name ? option.name : ''}
                    style={{ maxWidth: 400 }}
                    onChange={handleOnKecamatanChange}
                    renderInput={(params) => <TextField {...params} margin="dense" fullWidth label="Kecamatan" variant="outlined" />}
                />
                <TextField
                    value={addField.street} 
                    style={{ maxWidth: 400 }} margin="dense" label="Jalan" type="text" 
                    fullWidth  variant="outlined"
                    onChange={(e) => setAddField({...addField, street : e.target.value})}
                />
                <div>
                    Gambar
                    <div style={{display: "grid"}}> 
                        <input
                            accept="image/png"
                            type="file"
                            onChange={(e) => setAddField({...addField, imageBlob: e.target.files?.item(0) || null})}
                        />
                    </div>
                </div>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="primary">
                    Cancel
                </Button>
                {
                    !addOps
                        ?
                        checkAddFieldChanged()
                            ?
                                <Button onClick={handleAdd} variant="contained" color="primary" autoFocus>
                                    Add
                                </Button> 
                            :
                                <Button onClick={handleAdd} disabled variant="contained" color="primary" autoFocus>
                                    Add
                                </Button> 
                        : 
                            <Button onClick={handleAdd} disabled variant="contained" color="primary" autoFocus>
                                <CircularProgress size={20}/> Adding...
                            </Button>
                }
            </DialogActions>
            </Dialog>
      </div>
    )
}



const StorePage = (prop: StorePageProp) => {
    const history = useHistory()
    const location = useLocation()
    const currLocation = location.pathname
    let query = useQuery()

    /* Handle Search Query */
    let filteredToko = [...prop.dataStores]
    let currSearchQuery = (query.get("q") || "").trim()
    let currStateSetting = { name: true, street: false, district: false, subdistrict: false, province: false }
    const settingSearchAttribute = ["name", "street", "district", "subdistrict", "province"]

    if (currSearchQuery.length !== 0) {
        const searchMethods = (query.get("sm") || "").trim().split("|").map(met => met.trim()).filter(q => settingSearchAttribute.includes(q));
        if (searchMethods.length !== 0) {
          currStateSetting.name = false;
          let tmpFilteredToko: StoreType[] = [];
          for (const searchMethod of searchMethods) {
            currStateSetting[searchMethod as keyof typeof currStateSetting] = true;
            tmpFilteredToko = tmpFilteredToko.concat(filteredToko.filter(toko => {
              const propertyValue = toko[searchMethod as keyof StoreType];
              return typeof propertyValue === "string" && propertyValue.toLowerCase().includes(currSearchQuery.toLowerCase());
            }));
          }
          filteredToko = tmpFilteredToko;
        }
    }
    
    type StateSettingType = {
        name: boolean;
        street: boolean;
        district: boolean;
        subdistrict: boolean;
        province: boolean;
    };

    type UpdatedStateSettingType = StateSettingType & {
        [key: string]: boolean;
    };    
      
    const [searchQuery, setSearchQuery] = useState(currSearchQuery)
    const [stateSetting, setStateSetting] = useState<UpdatedStateSettingType>(currStateSetting)
    const handleChangeSetting = (event: React.ChangeEvent<HTMLInputElement>) => {
        setStateSetting({ ...stateSetting, [event.target.name]: event.target.checked });
    }
    const [settingButton, setSettingButton] = useState(true)
    const handleSetting = () => setSettingButton(!settingButton)

    const searchBarClasses = searchBarStyles()

    const handleSearch = () => {
        let searchMethods = []
        for(const setting of settingSearchAttribute){
            if(stateSetting[setting]) searchMethods.push(setting)
        }
        if(searchMethods.length != 0){
            const searchMethodsAgg: string = searchMethods.join('|')
            history.push(currLocation+`?q=${searchQuery}`+`&sm=${searchMethodsAgg}`)            
        }
        else{
            prop.setNotif({...prop.notif, isOpen: true, type: "error", msg: "setting method must be provided"})
        }
    }
    const handleSearchSubmit: React.FormEventHandler<HTMLDivElement> = (e) => {
        e.preventDefault()
        handleSearch()
    }

    const changeRoute = (route: string) => {
        history.push(route)
    }

    return (
        <>
            <Paper component="form" onSubmit={handleSearchSubmit} className={searchBarClasses.root}>
                <InputBase
                    className={searchBarClasses.input}
                    placeholder="Cari Toko Dorayaki"
                    inputProps={{ 'aria-label': 'cari toko dorayaki' }}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    value={searchQuery}
                />
                <IconButton onClick={handleSearch} className={searchBarClasses.iconButton} aria-label="search">
                    <SearchIcon />
                </IconButton>
                <Divider className={searchBarClasses.divider} orientation="vertical" />
                {
                    settingButton ?
                        <IconButton  color="primary" className={searchBarClasses.iconButton} onClick={handleSetting} aria-label="settings">
                            <SettingsIcon />
                        </IconButton> :
                        <IconButton  color="primary" className={searchBarClasses.iconButton} onClick={handleSetting} aria-label="settings">
                            <CloseIcon />
                        </IconButton> 
                }
            </Paper>
            <AddDialog syncDataStores={prop.syncDataStores} notif={prop.notif} setNotif={prop.setNotif}/>
            <Collapse in={!settingButton}>
                    <Paper style={{margin: "1rem"}}>
                        <Box textAlign="center" fontWeight="fontWeightBold" fontSize="h6.fontSize">Pencarian Toko Berdasarkan:</Box>
                        <Divider orientation="horizontal" />
                        <FormGroup row style={{marginLeft: "1rem"}}>
                            {
                                settingSearchAttribute.map((atr, idx) => (
                                    <FormControlLabel key={idx}
                                        control={
                                            <Switch
                                                key={idx}
                                                checked={stateSetting[atr]}
                                                onChange={handleChangeSetting}
                                                name={atr}
                                                color="primary"
                                            />
                                        }
                                        label={atr[0].toUpperCase() + atr.substr(1,)}
                                    />
                                ))
                            }
                            
                        </FormGroup>
                        <Divider orientation="horizontal" />

                    </Paper>
            </Collapse>
            {
                <div style={stylesPar as React.CSSProperties}>
                    {
                        filteredToko.map((store, idx) => (
                            <div key={idx}>
                                <Grow in={true} key={idx} timeout={500 + 100*idx}>
                                    <Paper elevation={10} key={idx} style={{"margin" : "1rem"}}>
                                        <Store key={idx} dataStore={store} 
                                            syncDataStores={prop.syncDataStores}
                                            notif={prop.notif}
                                            setNotif={prop.setNotif}
                                            changeRoute={changeRoute}
                                        />
                                    </Paper>
                                </Grow>
                            </div>
                        ))
                    }
                </div>
            } 
        </>
    )
}

export default StorePage