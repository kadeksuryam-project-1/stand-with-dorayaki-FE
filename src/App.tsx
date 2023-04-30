import * as React from 'react'
import { Paper } from "@material-ui/core";
import {
  deepOrange, deepPurple, lightBlue, orange
} from "@material-ui/core/colors";
import { createTheme, ThemeProvider } from "@material-ui/core/styles";
import axios, { AxiosError } from 'axios';
import { useEffect, useState } from 'react';
import { BrowserRouter, Redirect, Route, RouteComponentProps, RouteProps, Switch, useHistory } from 'react-router-dom';
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
import LoginPage from './pages/LoginPage';
import { useCookies } from 'react-cookie';
import Footer from './components/Footer';

interface PrivateRouteProps extends RouteProps {
  component: React.ComponentType<any>;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ component: Component, ...rest }) => {
  const [cookies] = useCookies(['logged_in']);

  return (
    <Route
      {...rest}
      render={(props: RouteComponentProps) =>
        cookies.logged_in ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: '/login',
              state: { from: props.location },
            }}
          />
        )
      }
    />
  );
};

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

  const [cookies] = useCookies(['access_token', 'logged_in']);
  
  useEffect(() => {
    const getDataStore = async () => {
      try {
        const resDataStores = (
          await axios.get<SuccessResWithData<Array<Store>>>(
            API_BASE_URL + '/v1/stores',
            { withCredentials: true }
          )
        ).data.data;
        const resDataDorayakis = (
          await axios.get<SuccessResWithData<Array<Dorayaki>>>(
            API_BASE_URL + '/v1/dorayakis',
            { withCredentials: true }
          )
        ).data.data;

        setDataStores(resDataStores);
        setDataDorayakis(resDataDorayakis);
      } catch (err) {}
    };
    getDataStore();
    if (localStorage.getItem('currTheme') === 'dark') setDarkState(true);
    else setDarkState(false);
  }, []);

  const syncDataStores = async () => {
    const resDataStores = (await axios.get<SuccessResWithData<Array<Store>>>(API_BASE_URL + '/v1/stores', { withCredentials: true })).data.data
    setDataStores(resDataStores)
  }
  
  const syncDataDorayakis = async () => {
    const resDataDorayakis = (await axios.get<SuccessResWithData<Array<Dorayaki>>>(API_BASE_URL + '/v1/dorayakis', { withCredentials: true })).data.data
    setDataDorayakis(resDataDorayakis)
  }

  return (
    <BrowserRouter>
      <Notification notif={notif} setNotif={setNotif} />
      <ThemeProvider theme={darkTheme}>
        <Navbarc darkState={darkState} handleThemeChange={handleThemeChange}/>
        <Paper style={{minHeight: "87.8vh"}}>
          <Switch>
            <Route path="/login">
              <LoginPage />
            </Route>
            <Route path="/dorayaki">
              {cookies.logged_in ? (
                <DorayakiPage
                  dataDorayakis={dataDorayakis}
                  syncDataDorayakis={syncDataDorayakis}
                  notif={notif}
                  setNotif={setNotif}
                />
              ) : (
                <Redirect to="/login" />
              )}
            </Route>
            <Route path="/stock/:id">
              {cookies.logged_in ? (
                <StockPage notif={notif} setNotif={setNotif} />
              ) : (
                <Redirect to="/login" />
              )}
            </Route>
            <Route path="/store">
              {cookies.logged_in ? (
                <StorePage
                  dataStores={dataStores}
                  syncDataStores={syncDataStores}
                  notif={notif}
                  setNotif={setNotif}
                />
              ) : (
                <Redirect to="/login" />
              )}
            </Route>
            <Route path="/">
              <Redirect to="/store" />
            </Route>
          </Switch>
        </Paper>
        <Footer />
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App
