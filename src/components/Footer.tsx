import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Container, Typography, Link } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  footer: {
    backgroundColor: 'black',
    padding: theme.spacing(2),
    bottom: 0,
  },
  text: {
    color: 'white',
  },
}));

const Footer: React.FC = () => {
  const classes = useStyles();

  return (
    <footer className={classes.footer}>
      <Container maxWidth="sm">
        <Typography variant="body1" align="center" className={classes.text}>
          Made with{' '}
          <span role="img" aria-label="heart">
            ❤️
          </span>{' '}
          by{' '}
          <Link
            href="https://github.com/kadeksuryam"
            target="_blank"
            rel="noopener noreferrer"
            className={classes.text}
          >
            kadeksuryam
          </Link>
        </Typography>
      </Container>
    </footer>
  );
};

export default Footer;
