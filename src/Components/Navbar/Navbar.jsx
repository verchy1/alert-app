import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';
import logo from "../../../public/logo/logoOrse.png";
import { Link, Outlet, useNavigate } from "react-router-dom";
import NotificationsIcon from '@mui/icons-material/Notifications';
import Badge from '@mui/material/Badge';
import NotificationsList from '../Dashboard/utils/NotificationsList';
import { handleDeleteNotification } from '../Dashboard/utils/DeleteNotification';
import { useSelector } from 'react-redux';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import PersonIcon from '@mui/icons-material/Person';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LogoutIcon from '@mui/icons-material/Logout';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import { useMediaQuery } from '@mui/material';
import { LogOut } from '../Dashboard/LogOut';
import { auth } from '../../data/firebaseConfig';



function Navbar() {
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [anchorElNotif, setAnchorElNotif] = useState(null)
  const openNotif = Boolean(anchorElNotif)
  const notifications = useSelector(state => state.Notifications.NotificationsCart) || [];
  const [drawerOpen, setDrawerOpen] = useState(false);
  const dispatch = useDispatch();
  const isMobile = useMediaQuery('(max-width:600px)');
  const navigate = useNavigate();

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleNotificationMenuClose = () => {
    setAnchorElNotif(null)
  }

  const handleNotificationMenuOpen = (event) => {
    setAnchorElNotif(event.currentTarget)
  }

  const deleteNotification = (notificationId) => {
    handleDeleteNotification(notificationId, dispatch);
  };

  const handleLogout = () => {
    LogOut(auth, navigate)
  };


  const pages = ['Dashboard'];
  const settings = [
    {
      icon: <PersonIcon />,
      pathName: 'Profile',
      path: 'dashboard/profile',
    },
    {
      icon: <DashboardIcon />,
      pathName: 'Dashboard',
      path: 'dashboard/properties'
    },
    {
      icon: <WorkspacePremiumIcon />,
      pathName: 'Autorisation',
      path: 'dashboard/autorisation'
    },
    {
      icon: <LogoutIcon />,
      pathName: 'Deconnexion',
      action: handleLogout,
      path: '/'
    },
  ];

  return (
    <AppBar
      position="static"
      className='p-2'
      sx={{
        backgroundColor: 'white',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Box shadow ajouté ici
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <div>
            <img src={logo} alt="logo orse" style={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
          </div>

          {/* <Typography
            variant="h6"
            sx={{
              display: { xs: 'none', md: 'block' }, // Afficher uniquement sur écran moyen/grand
              color: 'black',
              fontWeight: 'bold',
              justifyContent: "flex-end"
            }}
          >
            ORSE ALERT
          </Typography> */}
          {
            isMobile ? (
              <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'flex' }, justifyContent: 'flex-end' }}>
                <IconButton
                  size="large"
                  aria-label="show notifications"
                  sx={{
                    marginRight: '8px',
                    color: 'black',
                    '&:hover': {
                      backgroundColor: 'rgba(0, 0, 0, 0.1)', // Effet hover
                    },
                  }}
                  className='mx-3'
                >
                  <Badge badgeContent={notifications.length} color="error" onClick={handleNotificationMenuOpen}>
                    <NotificationsIcon />
                  </Badge>
                  <Menu
                    anchorEl={anchorElNotif}
                    open={openNotif}
                    onClose={handleNotificationMenuClose}
                    PaperProps={{
                      style: {
                        backgroundColor: "white",
                        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
                        width: "500px",
                        height: "100vh",
                        border: "1px solid #dee0de"
                      },
                    }}
                  >
                    <h5 className='border-bottom p-2'>Notifications</h5>
                    <NotificationsList
                      notifications={notifications}
                      setDrawerOpen={setDrawerOpen}
                      deleteNotification={deleteNotification}
                    />
                  </Menu>
                </IconButton>
                <Tooltip title="Ouvrir parametre">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar alt="ORSE" src="/static/images/avatar/2.jpg" />
                  </IconButton>
                </Tooltip>

                <Menu
                  sx={{ mt: '45px' }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  {settings.map((setting) => (
                    <MenuItem key={setting} onClick={() => {
                      handleCloseUserMenu();
                      if (setting.action) setting.action(); // Exécuter une action si définie
                      if (setting.path) navigate(setting.path); // Rediriger si un chemin est défini
                    }} sx={{ textAlign: 'center' }}>
                      {setting.icon}
                      <Link to={setting.path} className='px-2' style={{ listStyle: "none", color: "black", textDecoration: "none" }}>
                        {setting.pathName}
                      </Link>
                    </MenuItem>
                  ))}
                </Menu>
              </Box>
            ) :
              null
          }

        </Toolbar>

      </Container>
    </AppBar>
  );
}

export default Navbar;
