import {useState, useEffect, useContext} from 'react';
import jwt_decode from "jwt-decode";
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import { UserContext } from '../context/UserContext';
import { useNavigate, useLocation } from 'react-router-dom';
// define login url to use with axios

const Login = () => {
  const userContext = useContext(UserContext);
  const { isLoggedIn } = userContext;
  const navigate = useNavigate()

  const [anchorElUser, setAnchorElUser] = useState(null);

  const location = useLocation();

  const settings = [
    {
      key: "Dashboard",
      text: "My bookings",
      callback: async () => {
        userContext.updateBookings()
        navigate("/profile");
      }
    },
    {
      key: "Sign out",
      text: "Sign out",
      callback: () => {
        userContext.logOut();
        handleCloseUserMenu();
        if(location.pathname === "/profile"){
          navigate("/");
        }
      }
    },
    {
      key:"Delete Account",
      text:'Delete Account',
      callback:()=>{
        if (window.confirm("Are you sure you want to permanently delete all account information?")===true) {
          userContext.deleteUser();
          handleCloseUserMenu();
          navigate("/");  
        }
        else {
          return
        }
      }
    }
  ]

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  function handleCallbackResponse(response){
    // console.log("Encoded JWT ID token:" + response.credential);
    const userObject = jwt_decode(response.credential);
    userContext.logIn(userObject);
  }
  useEffect(()=>{
    /* global google */
    google.accounts.id.initialize({
      client_id:"226463831330-hep69di2j789od2tfbu06o1epfbbrtti.apps.googleusercontent.com",
      callback: handleCallbackResponse
    });
    google.accounts.id.renderButton(
      document.getElementById("signInDiv"),
      {theme: "outline", size:"large"}
    );
    // google.accounts.id.prompt();
  });
  //If we have no user: sign In button
  //If we have a user: show the logout button

    return (
        <>
          <Box id='signInDiv' hidden={isLoggedIn} name="google"/>
          <Box hidden={!isLoggedIn}>
            <Tooltip title={userContext.user.info.username || "User"}>
              <IconButton sx={{ p: 0 }} onClick={handleOpenUserMenu}>
                <Avatar alt={userContext.user.info.username} src={userContext.user.image} /> 
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
              disableScrollLock
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem key={setting.key} onClick={setting.callback}>
                  <Typography textAlign="center">{setting.text}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </>
    );
  }

  export default Login