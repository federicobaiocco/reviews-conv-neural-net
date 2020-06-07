import React from 'react';
import { Link } from 'react-router-dom';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { useLocation } from 'react-router-dom'

const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
    },
  }));

function Header() {
    const classes = useStyles();
    let location = useLocation();
    console.log(location.pathname);

    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" className={classes.title}>
                    {location.pathname === '/admin' ? 'ADMIN' : 'Reviews'   }
                </Typography>
                <Link style={linkStyle} to={location.pathname === '/admin' ? '/' : '/admin'}>
                    {location.pathname === '/admin' ? 'Reviews' : 'Admin'}
                </Link>
            </Toolbar>
        </AppBar>
    )
}

const linkStyle = {
  color: '#fff',
  textDecoration: 'none'
};
export default Header;