import * as React from 'react'
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
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
import axios from 'axios';
import clsx from 'clsx';
import { useState } from 'react';
import { API_BASE_URL } from '../config/config';
import { DorayakiEditDialogField, DorayakiProp } from '../types/Dorayaki';

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

const EditDialog = (prop: DorayakiProp) => {
    const [open, setOpen] = useState<boolean>(false)
    const [editField, setEditField] = useState<DorayakiEditDialogField>({...prop.dataDorayaki, imageBlob: null})
    const [updateOps, setUpdateOps] = useState<boolean>(false)

    const handleClickOpen = () => {
      setOpen(true)
    }
  
    const handleClose = () => {
      setOpen(false)
    }

    const handleEdit = async () => {
        setUpdateOps(true)
        try{
            const updateURL = API_BASE_URL + `/v1/dorayakis/${prop.dataDorayaki.id}`
            const {flavor, description, imageBlob} = editField
            let formData = new FormData()
            if(flavor) formData.append("flavor", flavor)
            if(description) formData.append("description", description)
            if(imageBlob) formData.append("image", imageBlob)
            
            await axios.put(updateURL, formData)
            await prop.syncDataDorayakis()

            prop.setNotif({...prop.notif, isOpen: true, type: "success", msg: "dorayaki successfully updated"})
            handleClose()
        }catch(err){
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
            prop.dataDorayaki.flavor !== "" &&
            prop.dataDorayaki.description !== ""
        )
    }

    
    return (
      <div>
        <Button size="small" variant="contained" color="primary"
            startIcon={<EditIcon />} onClick={handleClickOpen}>
          Edit
        </Button>
        <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
          <DialogTitle id="form-dialog-title">Edit Dorayaki</DialogTitle>
          <DialogContent>
            <DialogContentText>
                Please edit the dorayaki data with the correct data.
            </DialogContentText>
            <form></form>
            <TextField autoFocus 
                value={editField.flavor}
                style={{ maxWidth: 400 }} margin="dense" label="flavor" type="text" 
                fullWidth  variant="outlined"
                onChange={(e) => setEditField({...editField, flavor : e.target.value})}
            />
            <TextField
                label="description"
                style={{ maxWidth: 400 }}
                type="text" margin="dense" multiline
                fullWidth  variant="outlined"
                aria-label="empty textarea"
                value={editField.description}
                onChange={(e) => setEditField({...editField, description : e.target.value})}
                placeholder="dorayaki description" />
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

const DeleteDialog = (prop: DorayakiProp) => {
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
            const deleteURL = API_BASE_URL + `/v1/dorayakis/${prop.dataDorayaki.id}`
            await axios.delete(deleteURL)
            handleClose()
            prop.setNotif({...prop.notif, isOpen: true, type: "success", msg: "dorayaki berhasil dihapus"})
            setTimeout(async () => {
                await prop.syncDataDorayakis();
            }, 500);
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
                <DialogTitle id="alert-dialog-title">{`Delete Dorayaki ${prop.dataDorayaki.flavor}?`}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Penghapusan dorayaki akan berdampak dihapusnya semua stok dorayaki tersebut.
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

const Dorayaki = (prop: DorayakiProp) => {
    const classes = useStyles()

    const [showDetails, setShowDetails] = useState(false)

    const handleShowDetails = () => setShowDetails(!showDetails)

    return(
        <Card className={classes.root}>
            <div style={{height: "30vh"}}>
                <CardMedia
                    className={classes.media}
                    image={prop.dataDorayaki.image}
                    title={prop.dataDorayaki.flavor}
                />
                <CardContent>
                    <Typography gutterBottom variant="h6" component="h2">
                        Dorayaki {prop.dataDorayaki.flavor}
                    </Typography>
                </CardContent>
            </div>
            <CardActions style={{display: "flex", justifyContent: "space-between"}}>
                <EditDialog dataDorayaki={prop.dataDorayaki}  syncDataDorayakis={prop.syncDataDorayakis}
                    notif={prop.notif} setNotif={prop.setNotif}/>
                <DeleteDialog dataDorayaki={prop.dataDorayaki} syncDataDorayakis={prop.syncDataDorayakis}
                    notif={prop.notif} setNotif={prop.setNotif}/>
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
                    <Typography><strong>Details</strong></Typography>
                    <br/>
                    <Typography><strong>Rasa: </strong> <br/>{prop.dataDorayaki.flavor}</Typography>
                    <Typography><strong>Deskripsi: </strong><br/>{prop.dataDorayaki.description}</Typography>
                </CardContent>
            </Collapse>
        </Card>
    )
}

export default Dorayaki

