import React, { useEffect } from 'react';
import { Box, Container, Typography, Link as MuiLink } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory, useLocation } from 'react-router-dom';
import googleLogo from '../assets/google.svg';
import { getGoogleUrl } from '../utils/getGoogleUrl';
import { useCookies } from 'react-cookie';

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '90vh',
    backgroundColor: '#2363eb',
  },
  typography: {
    marginBottom: theme.spacing(3),
    marginTop: theme.spacing(3),
    textAlign: 'center',
    color: 'white',
  },
  typography2: {
    marginBottom: theme.spacing(3),
    marginTop: theme.spacing(1),
    textAlign: 'center',
    color: 'black',
  },
  box: {
    backgroundColor: '#e5e7eb',
    padding: theme.spacing(2),
    borderRadius: theme.shape.borderRadius,
  },
  link: {
    backgroundColor: '#f5f6f7',
    borderRadius: theme.shape.borderRadius,
    padding: theme.spacing(0.75),
    textDecoration: 'none',
    color: '#393e45',
    cursor: 'pointer',
    fontWeight: 500,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    '&:hover': {
      backgroundColor: '#fff',
      boxShadow: '0 1px 13px 0 rgba(0, 0, 0, 0.15)',
    },
  },
  logo: {
    height: '2rem',
    marginRight: theme.spacing(1),
  },
}));

const LoginPage = () => {
  const classes = useStyles();
  const location = useLocation();
  let from = ((location.state as any)?.from?.pathname as string) || '/';

  const [cookie] = useCookies(['logged_in']);
  const history = useHistory();

  useEffect(() => {
    if (cookie.logged_in) {
      history.push('/');
    }
  }, [cookie.logged_in, history]);

  return (
    <Container maxWidth={false} className={classes.container}>
      <Box width="27rem">
      <Typography variant="h3" component="p" className={classes.typography}><strong>WELCOME TO STAND WITH DORAYAKI APP</strong></Typography>
        <Box width="100%" className={classes.box}>
          <Typography variant="h6" component="p" className={classes.typography2}>
            <strong>Login with:</strong>
          </Typography>
          <MuiLink href={getGoogleUrl(from)} className={classes.link}>
            <img src={googleLogo} alt="Google Logo" className={classes.logo} />
            Google
          </MuiLink>
        </Box>
      </Box>
    </Container>
  );
};

export default LoginPage;
