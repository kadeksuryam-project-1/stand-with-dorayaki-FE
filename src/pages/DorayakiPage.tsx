// import React, {useEffect, useState} from 'react'
// import Dorayaki from '../components/Dorayaki'
// import { Grow, Paper, IconButton, InputBase, Divider, Collapse, Box, FormGroup, FormControlLabel, Switch } from '@material-ui/core'
// import { makeStyles } from '@material-ui/core/styles'
// import SearchIcon from '@material-ui/icons/Search'
// import SettingsIcon from '@material-ui/icons/Settings'
// import CloseIcon from '@material-ui/icons/Close';
// import CircularProgress from '@material-ui/core/CircularProgress';
// import Button from '@material-ui/core/Button';
// import TextField from '@material-ui/core/TextField';
// import Dialog from '@material-ui/core/Dialog';
// import DialogActions from '@material-ui/core/DialogActions';
// import DialogContent from '@material-ui/core/DialogContent';
// import DialogContentText from '@material-ui/core/DialogContentText';
// import DialogTitle from '@material-ui/core/DialogTitle';
// import Autocomplete from '@material-ui/lab/Autocomplete';
// import { getProvinsi, getKabupaten, getKecamatan } from '../utils/fetchDataDaerah'
// import AddIcon from '@material-ui/icons/Add';
// import useQuery from '../utils/useQuery'
// import { useLocation, useHistory } from 'react-router-dom'
// import { API_BASE_URL } from '../utils/config'
// import axios from 'axios'

      
// const stylesPar = {
//     "display": "flex",
//     "justifyContent": "flex-start",
//     "flexWrap" : "wrap",
//     "minHeight" : "60vh"
// }

// const AddDialog = ({syncDataDorayakis, notif, setNotif}) => {
//     const [open, setOpen] = useState(false)
//     const [addField, setAddField] = useState({rasa: "", deskripsi: ""})
//     const [addOps, setAddOps] = useState(false)
    

//     const handleClickOpen = () => {
//         setOpen(true)
//       }
    
//     const handleClose = () => {
//         setOpen(false)
//         setAddField({rasa: "", deskripsi: ""})
//     }

//     const checkAddFieldChanged = () => {
//         return !(
//             addField.rasa === "" &&
//             addField.deskripsi === "" &&
//             !(addField.pngFile)
//         )
//     }

//     const handleAdd = async () => {
//         setAddOps(true)
//         try{
//             const addURL = API_BASE_URL + `/dorayakis/`
//             const {rasa, deskripsi, pngFile} = addField

//             const formData = new FormData()
//             if(rasa) formData.append("rasa", rasa)
//             if(deskripsi) formData.append("deskripsi", deskripsi)
//             if(pngFile) formData.append("gambar", pngFile)

//             await axios.post(addURL, formData)
//             await syncDataDorayakis()
//             setNotif({...notif, open: true, type: "success", msg: "dorayaki berhasil ditambahkan!"})
//             setOpen(false)
//         }catch(err){
//             let errMsg = err.message.toString()
//             if(err.response)
//                 if(err.response.data.error)
//                      errMsg = err.response.data.error
//             setNotif({...notif, open: true, type: "error", msg: errMsg})
//         }
//         finally{
//             setAddOps(false)
//         }
//     }

//     return(
//         <div style={{display: "grid", "maxWidth" : "9rem",  margin: "0rem auto"}}>
//             <Button size="small" variant="contained" color="primary"
//                 startIcon={<AddIcon />} onClick={handleClickOpen}>
//                 Add Dorayaki
//             </Button>
//             <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
//             <DialogTitle id="form-dialog-title">Add Dorayaki</DialogTitle>
//             <DialogContent>
//                 <DialogContentText>
//                 Silahkan tambahkan dorayaki dengan data yang benar.
//                 </DialogContentText>
//                 <TextField autoFocus 
//                     value={addField.rasa}
//                     style={{ maxWidth: 400 }} margin="dense" label="rasa" type="text" 
//                     fullWidth  variant="outlined"
//                     onChange={(e) => setAddField({...addField, rasa : e.target.value})}
//                 />
//                 <TextField
//                     label="deskripsi"
//                     style={{ maxWidth: 400 }}
//                     type="text" margin="dense" multiline
//                     fullWidth  variant="outlined"
//                     aria-label="empty textarea"
//                     value={addField.deskripsi}
//                     onChange={(e) => setAddField({...addField, deskripsi : e.target.value})}
//                     placeholder="deksripsi dorayaki" 
//                 />
//                 <div>
//                     Gambar
//                     <div style={{display: "grid"}}> 
//                         <input
//                             accept="image/png"
//                             type="file"
//                             onChange={(e) => setAddField({...addField, pngFile: e.target.files[0]})}
//                         />
//                     </div>
//                 </div>
//             </DialogContent>
//             <DialogActions>
//                 <Button onClick={handleClose} color="primary">
//                     Cancel
//                 </Button>
//                 {
//                     !addOps
//                         ?
//                         checkAddFieldChanged()
//                             ?
//                                 <Button onClick={handleAdd} variant="contained" color="primary" autoFocus>
//                                     Add
//                                 </Button> 
//                             :
//                                 <Button onClick={handleAdd} disabled variant="contained" color="primary" autoFocus>
//                                     Add
//                                 </Button> 
//                         : 
//                             <Button onClick={handleAdd} disabled variant="contained" color="primary" autoFocus>
//                                 <CircularProgress size={20}/> Adding...
//                             </Button>
//                 }
//             </DialogActions>
//             </Dialog>
//       </div>
//     )
// }

// interface DorayakiPageProp {

// }
// const DorayakiPage = ({dataDorayakis, syncDataDorayakis, notif, setNotif}) => {
//     return (
//         <div style={{minHeight: "100vh"}}>
//             <AddDialog syncDataDorayakis={syncDataDorayakis} notif={notif} setNotif={setNotif}/>
//             {
//                 <div style={stylesPar}>
//                     {
//                         dataDorayakis.map((dorayaki, idx) => (
//                             <div key={idx}>
//                                 <Grow in={true} key={idx} timeout={500 + 100*idx}>
//                                     <Paper elevation={10} key={idx} style={{"margin" : "1rem"}}>
//                                         <Dorayaki key={idx} dataDorayaki={dorayaki} 
//                                             syncDataDorayakis={syncDataDorayakis}
//                                             notif={notif}
//                                             setNotif={setNotif}
//                                         />
//                                     </Paper>
//                                 </Grow>
//                             </div>
//                         ))
//                     }
//                 </div>
//             } 
//         </div>
//     )
// }

// export default DorayakiPage