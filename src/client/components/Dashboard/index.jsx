import React, { useState, useEffect } from 'react';
import { withRouter, Switch, Route, NavLink, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import cookie from 'react-cookies';
// components
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
// icons
import StorageIcon from '@material-ui/icons/Storage';
import MenuIcon from '@material-ui/icons/Menu';
import SettingsIcon from '@material-ui/icons/Settings';
// Modules
import DataPostDashboard from '../DataPostDashboard';
// Hocs
import withData from '../../hocs/withData';

import styles from './styles.scss';

const menuItems = [
  { label: 'Data Post Dashboard', link: '/data-post', icon: <StorageIcon /> },
  { label: 'Inventory', link: '/inventory', icon: <StorageIcon /> },
];

const Dashboard = ({ history }) => {
  const [open, setOpen] = useState(false);
  const [userName, setUserName] = useState(null);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const openAccountSettings = Boolean(anchorEl);

  useEffect(() => {
    const isAuthorized = cookie.load('authorized') || false;
    setUserName(cookie.load('username') || null);
    if (!isAuthorized) {
      history.push('/auth/login');
    }
  }, []);

  const signOut = () => {
    cookie.remove('authorized', { path: '/' })
    history.push('/auth/login');
  };

  console.log('Rendering Dashboard');

  return (
    <div className={styles.root}>
      <CssBaseline />
      <AppBar
        position="fixed"
        className={`${styles.appBar} ${open && styles.appBarShift}`}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={() => setOpen(state => !state)}
            edge="start"
            className={styles.menuButton}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="body1" noWrap className={styles.username}>{ userName }</Typography>
          <div>
            <IconButton
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={event => setAnchorEl(event.currentTarget)}
              color="inherit"
            >
              <SettingsIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              getContentAnchorEl={null}
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              elevation={0}
              open={openAccountSettings}
              onClose={() => setAnchorEl(null)}
            >
              <MenuItem onClick={() => signOut()}>
                <ListItemIcon>
                  <div className={styles.signoutIcon} />
                </ListItemIcon>
                <ListItemText primary="Sign Out" />
              </MenuItem>
            </Menu>
          </div>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        className={`${styles.drawer} ${open ? styles.drawerOpen : styles.drawerClose}`}
        classes={{ paper: `${open && styles.drawerOpen} ${!open && styles.drawerClose}` }}
        open={open}
      >
        <div className={styles.logo}></div>
        <List className={styles.menuList}>
          { menuItems.map((item) => (
            <NavLink to={item.link} className={styles.menuItem} activeClassName={styles.active} key={item.label}>
              <ListItem>
                <ListItemIcon>{ item.icon }</ListItemIcon>
                <ListItemText className={styles.menuItem} primary={item.label} />
              </ListItem>
            </NavLink>
          )) }
        </List>
      </Drawer>
      <main className={styles.content}>
        <div className={styles.toolbar} />
        <Switch>
          <Route exact path="/data-post" component={DataPostDashboard} /> 
          <Redirect to="/data-post" />
        </Switch>
      </main>
    </div>
  );
};

Dashboard.propTypes = {
  history: PropTypes.shape({}),
};

Dashboard.defaultProps = {
  history: null,
};

export default withRouter(withData(Dashboard));