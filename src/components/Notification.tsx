import { Snackbar, SnackbarCloseReason } from '@material-ui/core';
import React from 'react';
import { NotificationProp } from '../types/NotificationProp';
import { NotificationState } from '../types/NotificationState';
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';
import { makeStyles } from '@material-ui/core/styles';


function Alert(props: AlertProps) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}
  
const useStyles = makeStyles((theme) => ({
    root: {
      width: '100%',
      '& > * + *': {
        marginTop: theme.spacing(2),
      },
    },
}));

  
const Notification = (prop: NotificationProp) => {
  const classes = useStyles();

  const handleClose = (event: React.SyntheticEvent<any> | Event, reason?: SnackbarCloseReason) => {
    if(reason === 'clickaway'){
      return
    }
    const newNotifState : NotificationState = {
        ...prop.notif,
        isOpen: false
    }
    prop.setNotif(newNotifState)
  }

  return (
    <div className={classes.root}>
      <Snackbar open={prop.notif.isOpen} autoHideDuration={3000} onClose={handleClose}
         anchorOrigin={{vertical: 'top', horizontal: 'center'}}>
        <Alert onClose={handleClose} severity={prop.notif.type}>
          {prop.notif.msg}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default Notification
