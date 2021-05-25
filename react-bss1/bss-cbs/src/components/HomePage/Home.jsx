import React from 'react';
import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import MenuOpenIcon from '@material-ui/icons/MenuOpen';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';
import Avatar from '@material-ui/core/Avatar';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import config from 'config';
import Grid from '@material-ui/core/Grid';
import PowerSettingsNewIcon from '@material-ui/icons/PowerSettingsNew';
import PersonOutlineIcon from '@material-ui/icons/PersonOutline';
import LeftNav from '../LeftNav/LeftNav';
const defaultThemeName = _.get(config, 'dev.uiConfig.defaultThemecolor', 'azureBlue');

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  appBar: {
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    background: '#fff',
    color: theme.palette.primary.active,
    justifyContent: 'space-between'
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  logo: {
    width: '80%',
    height: 'auto',
    marginBottom: '10px'
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'center',
    minHeight: '75%'
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: -drawerWidth,
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  },
  customMenu: {
    padding: '3px',
    borderRadius: '3px'
  },
}));

export default function Home() {
  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = React.useState(true);
  const [userOptions, setUserOptions] = React.useState(null);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleUserOptions = (event) => {
    setUserOptions(event.currentTarget);
  };

  const handleCloseUserOptions = () => {
    setUserOptions(null);
  };

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open,
        })}
      >
        <Toolbar>
            <Grid container spacing={1}>
                <Grid item xs={1}>
                    {(
                        open ?
                        <IconButton
                            color="inherit"
                            onClick={handleDrawerClose}
                            className={clsx(classes.menuButton)}>
                            <MenuOpenIcon />
                        </IconButton>:
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            onClick={handleDrawerOpen}
                            edge="start"
                            className={clsx(classes.menuButton, open && classes.hide)}
                        >
                            <MenuIcon />
                        </IconButton>
                    )}
                </Grid>
                <Grid item xs>
                    <Typography variant="h6" noWrap>
                        BMobile BSS Switch CBS 4.2 - Development Environment
                    </Typography>
                </Grid>
                <Grid item xs={1}>
                    <div>
                    <IconButton
                        aria-label="account of current user"
                        aria-controls="menu-appbar"
                        aria-haspopup="true"
                        onClick={handleUserOptions}
                        color="inherit"
                    >
                        <AccountCircle />
                    </IconButton>
                    <Menu
                        id="menu-appbar"
                        anchorEl={userOptions}
                        keepMounted
                        getContentAnchorEl={null}
                        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                        transformOrigin={{ vertical: "top", horizontal: "left" }}
                        classes={{ paper: classes.customMenu, list: classes.customMenuList}}
                        open={Boolean(userOptions)}
                        onClose={handleCloseUserOptions}
                    >
                        <MenuItem onClick={handleCloseUserOptions}>
                            <ListItemIcon>
                                <PersonOutlineIcon fontSize="small" />
                            </ListItemIcon>
                            <Typography variant="inherit">Profile</Typography>
                        </MenuItem>
                        <MenuItem onClick={handleCloseUserOptions}>
                            <ListItemIcon>
                                <PowerSettingsNewIcon fontSize="small" />
                            </ListItemIcon>
                            <ListItemText >Logout</ListItemText>
                        </MenuItem>
                    </Menu>
                    </div>
                </Grid>
            </Grid>
        </Toolbar>
      </AppBar>
      <Drawer
        className={classes.drawer}
        variant="persistent"
        anchor="left"
        open={open}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div className={classes.drawerHeader}>
        <Avatar
            className={classes.logo}
            variant="square"
            alt="Logo"
            src={`./assets/images/${defaultThemeName === 'azureBlue' ? 'logo-bmobile.png' : 'ttlogo.png'}`}
        />
        </div>
        <Divider />
        <LeftNav />
      </Drawer>
      <main
        className={clsx(classes.content, {
          [classes.contentShift]: open,
        })}
      >
        <div className={classes.drawerHeader} />
        
      </main>
    </div>
  );
}
