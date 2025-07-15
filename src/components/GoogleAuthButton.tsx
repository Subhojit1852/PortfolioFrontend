import { useGoogleAuth } from '../context/GoogleAuthContext';
import { IconButton, Menu, MenuItem, Avatar, Typography } from '@mui/material';
import { Google } from '@mui/icons-material';
import { useState } from 'react';
import { motion } from 'framer-motion';

const GoogleAuthButton = () => {
  const { user, isAdmin, login, logout } = useGoogleAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  console.log("GoogleAuthButton is rendering", user, isAdmin);
  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  function getInitials(name: string) {
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
}

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      {user ? (
        <>
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <IconButton onClick={handleMenu} sx={{ p: 0 }}>
  <Avatar 
    alt={user.name} 
    sx={{ 
      width: 40, 
      height: 40,
      border: `2px solid ${isAdmin ? '#00ffc3' : ' #00ffc3'}`,
      boxShadow: `0 0 10px ${isAdmin ? '#00ffc3' : ' #00ffc3'}`,
      background: 'rgba(0, 15, 20, 0.8)',
      color: `${isAdmin ? '#00ffc3' : ' #00ffc3'}`,
      fontFamily: '"Courier New", monospace',
      fontWeight: 'bold',
      textShadow: `0 0 5px ${isAdmin ? '#00ffc3' : ' #00ffc3'}`,
      fontSize: '1.2rem'
    }} 
  >
    {getInitials(user.name)}
  </Avatar>
</IconButton>
          </motion.div>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            PaperProps={{
              sx: {
                bgcolor: 'rgba(10, 5, 20, 0.95)',
                border: '1px solid #00ffc3',
                boxShadow: '0 0 15px #00ffc3',
                color: '#00ffc3'
              }
            }}
          >
            <MenuItem disabled>
              <Typography variant="body2" sx={{ fontFamily: '"Courier New", monospace' }}>
                {user.name} ({isAdmin ? 'Admin' : 'User'})
              </Typography>
            </MenuItem>
            <MenuItem 
              onClick={() => {
                logout();
                handleClose();
              }}
              sx={{
                '&:hover': {
                  bgcolor: 'rgba(255, 82, 82, 0.2)'
                }
              }}
            >
              <Typography sx={{ fontFamily: '"Courier New", monospace' }}>
                LOGOUT
              </Typography>
            </MenuItem>
          </Menu>
        </>
      ) : (
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <IconButton 
            onClick={() => login()} 
            sx={{ 
              background: 'rgba(0, 15, 20, 0.8)',
              border: '1px solid #00ffc3',
              borderRadius: '50%',
              width: 50,
              height: 50,
              boxShadow: '0 0 10px #00ffc3',
              '&:hover': {
                background: 'rgba(0, 255, 195, 0.2)'
              }
            }}
          >
            <Google sx={{ 
              color: '#00ffc3', 
              fontSize: 28,
              textShadow: '0 0 5px #00ffc3'
            }} />
          </IconButton>
        </motion.div>
      )}
    </>
  );
};

export default GoogleAuthButton;