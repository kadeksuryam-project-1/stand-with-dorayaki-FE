import * as React from 'react'
import { AppBar, Button, IconButton, Toolbar, Tooltip } from "@material-ui/core";
import Brightness4Icon from '@material-ui/icons/Brightness4';
import Brightness7Icon from '@material-ui/icons/Brightness7';
import { Link } from 'react-router-dom';
import { NavbarcProp } from '../types/NavbarcProp';


const Navbarc = (prop: NavbarcProp) => {
    return(
        <AppBar color="secondary" position="sticky">
            <Toolbar>
                <div style={{flexGrow: 1}}>
                    <Button component={Link} to="/toko-dorayaki">
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
            </Toolbar>
        </AppBar>
    )
}

export default Navbarc
