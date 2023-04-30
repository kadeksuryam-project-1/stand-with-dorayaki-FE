import * as React from 'react'
import { AppBar, Button, IconButton, Toolbar, Tooltip } from "@material-ui/core";
import Brightness4Icon from '@material-ui/icons/Brightness4';
import Brightness7Icon from '@material-ui/icons/Brightness7';
import { Link, useHistory } from 'react-router-dom';
import { NavbarcProp } from '../types/NavbarcProp';
import { useCookies } from 'react-cookie';
import axios from 'axios';
import { API_BASE_URL } from '../config/config';


const Navbarc = (prop: NavbarcProp) => {
    const [cookie, , removeCookie] = useCookies();
    const history = useHistory();
  
    const handleLogout = async () => {
      await axios.get(API_BASE_URL + `/clear-cookies`, { withCredentials: true })
      Object.keys(cookie).forEach((key) => {
        removeCookie(key, { path: '/' });
      });
    };

    return(
        <AppBar color="secondary" position="sticky">
            <Toolbar>
                <div style={{flexGrow: 1}}>
                    <Button component={Link} to="/store">
                        Stand with Dorayaki
                    </Button>
                </div>
                <Button component={Link} to="/dorayaki">Dorayaki</Button>
                <Tooltip title="Toggle dark/light mode">
                    <IconButton aria-label="light/dark mode" onClick={prop.handleThemeChange} component="span">
                        {
                            prop.darkState ?
                            <Brightness7Icon /> :
                            <Brightness4Icon />
                        }
                    </IconButton>
                </Tooltip> 
                {cookie.logged_in ? <Button onClick={handleLogout}>Logout</Button>  : <></>}
            </Toolbar>
        </AppBar>
    )
}

export default Navbarc
