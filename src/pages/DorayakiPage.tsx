import * as React from 'react'
import { Grow, Paper } from '@material-ui/core'
import Button from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import TextField from '@material-ui/core/TextField'
import AddIcon from '@material-ui/icons/Add'
import axios from 'axios'
import { CSSProperties, useState } from 'react'
import Dorayaki from '../components/Dorayaki'
import { API_BASE_URL } from '../config/config'
import { DorayakiPageAddDialogField, DorayakiPageAddDialogProp, DorayakiPageProp } from '../types/Dorayaki'

      
const stylesPar: CSSProperties = {
    "display": "flex",
    "justifyContent": "flex-start",
    "flexWrap" : "wrap",
    "minHeight" : "60vh"
}

const AddDialog = (prop: DorayakiPageAddDialogProp) => {
    const [open, setOpen] = useState(false)
    const [addField, setAddField] = useState<DorayakiPageAddDialogField>({flavor: "", description: "", imageBlob: null})
    const [addOps, setAddOps] = useState(false)
    

    const handleClickOpen = () => {
        setOpen(true)
      }
    
    const handleClose = () => {
        setAddField({flavor: "", description: "", imageBlob: null})
        setOpen(false)
    }

    const checkAddFieldChanged = () => {
        return (
            addField.flavor !== "" &&
            addField.description !== ""
        )
    }

    const handleAdd = async () => {
        setAddOps(true)
        try{
            const addURL = API_BASE_URL + `/v1/dorayakis`
            const {flavor, description, imageBlob} = addField

            const formData = new FormData()
            if(flavor) formData.append("flavor", flavor)
            if(description) formData.append("description", description)
            if(imageBlob) formData.append("image", imageBlob)

            await axios.post(addURL, formData, { withCredentials: true })
            await prop.syncDataDorayakis()
            prop.setNotif({...prop.notif, isOpen: true, type: "success", msg: "dorayaki berhasil ditambahkan!"})
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
        <div style={{display: "grid", "maxWidth" : "9rem",  margin: "0rem auto"}}>
            <Button size="small" variant="contained" color="primary"
                startIcon={<AddIcon />} onClick={handleClickOpen}>
                Add Dorayaki
            </Button>
            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">Add Dorayaki</DialogTitle>
            <DialogContent>
                <DialogContentText>
                Silahkan tambahkan dorayaki dengan data yang benar.
                </DialogContentText>
                <TextField autoFocus 
                    value={addField.flavor}
                    style={{ maxWidth: 400 }} margin="dense" label="rasa" type="text" 
                    fullWidth  variant="outlined"
                    onChange={(e) => setAddField({...addField, flavor : e.target.value})}
                />
                <TextField
                    label="deskripsi"
                    style={{ maxWidth: 400 }}
                    type="text" margin="dense" multiline
                    fullWidth  variant="outlined"
                    aria-label="empty textarea"
                    value={addField.description}
                    onChange={(e) => setAddField({...addField, description : e.target.value})}
                    placeholder="deksripsi dorayaki" 
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


const DorayakiPage = (prop: DorayakiPageProp) => {
    return (
        <div style={{minHeight: "100vh"}}>
            <AddDialog syncDataDorayakis={prop.syncDataDorayakis} notif={prop.notif} setNotif={prop.setNotif}/>
            {
                <div style={stylesPar}>
                    {
                        prop.dataDorayakis.map((dorayaki, idx) => (
                            <div key={idx}>
                                <Grow in={true} key={idx} timeout={500 + 100*idx}>
                                    <Paper elevation={10} key={idx} style={{"margin" : "1rem"}}>
                                        <Dorayaki key={idx} dataDorayaki={dorayaki} 
                                            syncDataDorayakis={prop.syncDataDorayakis}
                                            notif={prop.notif}
                                            setNotif={prop.setNotif}
                                        />
                                    </Paper>
                                </Grow>
                            </div>
                        ))
                    }
                </div>
            } 
        </div>
    )
}

export default DorayakiPage
