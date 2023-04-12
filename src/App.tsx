import * as React from 'react'
import { Paper } from "@material-ui/core";
import {
  deepOrange, deepPurple, lightBlue, orange
} from "@material-ui/core/colors";
import { createTheme, ThemeProvider } from "@material-ui/core/styles";
import axios from 'axios';
import { useEffect, useState } from 'react';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';
import './App.css';
import Navbarc from './components/Navbar';
import Notification from './components/Notification';
import { API_BASE_URL } from './config/config';
import DorayakiPage from './pages/DorayakiPage';
import StockPage from './pages/StockPage';
import StorePage from './pages/StorePage';
import { Dorayaki } from './types/Dorayaki';
import { NotificationState } from './types/NotificationState';
import { Store } from './types/Store';
import { SuccessResWithData } from './types/SuccessResWithData';


function App() {
  const [darkState, setDarkState] = useState(false);
  const palletType = darkState ? "dark" : "light";
  const mainPrimaryColor = darkState ? orange[500] : lightBlue[500];
  const mainSecondaryColor = darkState ? deepPurple[500] : deepOrange[900]
  const darkTheme = createTheme({
    palette: {
      type: palletType,
      primary: {
        main: mainPrimaryColor
      },
      secondary: {
        main: mainSecondaryColor
      }
    }
  });
  const handleThemeChange = () => {
    if(darkState)
      localStorage.setItem("currTheme", "light")
    else localStorage.setItem("currTheme", "dark")
    setDarkState(!darkState);
  };

  const [notif, setNotif] = useState<NotificationState>({isOpen: false, type: 'success', msg: ""})
  const [dataStores, setDataStores] = useState<Array<Store>>([])
  const [dataDorayakis, setDataDorayakis] = useState<Array<Dorayaki>>([])
  
  useEffect(() => {
    const getDataStore = async () => {
      try{
        const resDataStores = (await axios.get<SuccessResWithData<Array<Store>>>(API_BASE_URL + '/v1/stores')).data.data
        const resDataDorayakis = (await axios.get<SuccessResWithData<Array<Dorayaki>>>(API_BASE_URL + '/v1/dorayakis')).data.data
        
        setDataStores(resDataStores)
        setDataDorayakis(resDataDorayakis)
      } catch(err){
        
      }
    }
    getDataStore()
    if(localStorage.getItem("currTheme") === "dark") setDarkState(true)
    else setDarkState(false)
  }, [])

  const syncDataStores = async () => {
    const resDataStores = (await axios.get<SuccessResWithData<Array<Store>>>(API_BASE_URL + '/v1/stores')).data.data
    setDataStores(resDataStores)
  }
  
  const syncDataDorayakis = async () => {
    const resDataDorayakis = (await axios.get<SuccessResWithData<Array<Dorayaki>>>(API_BASE_URL + '/v1/dorayakis')).data.data
    setDataDorayakis(resDataDorayakis)
  }


  return (
      <BrowserRouter>
        <Notification notif={notif} setNotif={setNotif} />
        <ThemeProvider theme={darkTheme}>
          <Navbarc darkState={darkState} handleThemeChange={handleThemeChange}/>
          <Paper style={{height: "auto"}}>
            <Switch>
              <Route path="/dorayaki">
                <DorayakiPage dataDorayakis={dataDorayakis} syncDataDorayakis={syncDataDorayakis} 
                  notif={notif} setNotif={setNotif}
                  />
              </Route>
              <Route path="/stock/:id">
                <StockPage 
                  notif={notif} setNotif={setNotif}/>
              </Route>
              <Route path="/store">
                <StorePage dataStores={dataStores} syncDataStores={syncDataStores} 
                  notif={notif} setNotif={setNotif}
                  />
              </Route>
              <Route path="/">
                <Redirect to="/store"/>
              </Route>
            </Switch>
          </Paper>
        </ThemeProvider>
      </BrowserRouter>  
  )
}

export default App
