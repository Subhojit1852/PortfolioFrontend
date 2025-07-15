// components/Navbar.tsx
import { Link } from 'react-router-dom';
import { Box,  Button, useMediaQuery } from '@mui/material';
import { useGoogleAuth } from '../context/GoogleAuthContext';
import GoogleAuthButton from './GoogleAuthButton';
import theme from '../theme';

export const Navbar = () => {
  const { user, logout } = useGoogleAuth();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const getInitials = (name: string) =>
    name
      ?.split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        px: isMobile ? 1.5 : 4,
        py: isMobile ? 1 : 2,
        borderBottom: '1px solid #00ffc3',
        background: 'rgba(10, 5, 20, 0.9)',
        flexWrap: isMobile ? 'wrap' : 'nowrap',
      }}
    >
      {/* Left: Logo + Nav Links */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          alignItems: isMobile ? 'flex-start' : 'center',
          gap: isMobile ? 1 : 3,
          flexGrow: 1,
        }}
      >
       

        <Box
          sx={{
            display: 'flex',
            gap: isMobile ? 1 : 2,
            flexWrap: 'wrap',
          }}
        >
           <Button
            component={Link}
            to="/"
            sx={{
              color: '#00ffc3',
              fontSize: isMobile ? '0.75rem' : '1rem',
              minWidth: isMobile ? 64 : 88,
            }}
          >
            Home
          </Button>

          <Button
            component={Link}
            to="/skills"
            sx={{
              color: '#00ffc3',
              fontSize: isMobile ? '0.75rem' : '1rem',
              minWidth: isMobile ? 64 : 88,
            }}
          >
            SKILLS
          </Button>
          <Button
            component={Link}
            to="/github"
            sx={{
              color: '#00ffc3',
              fontSize: isMobile ? '0.75rem' : '1rem',
              minWidth: isMobile ? 64 : 88,
            }}
          >
            GITHUB X-RAY
          </Button>
        </Box>
      </Box>

      {/* Right: Avatar + Logout/Login */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: isMobile ? 1 : 2,
          mt: isMobile ? 1 : 0,
        }}
      >
        {user ? (
          <>
            <Box
              sx={{
                width: isMobile ? 32 : 40,
                height: isMobile ? 32 : 40,
                borderRadius: '50%',
                background:
                  'radial-gradient(circle, rgba(0,255,195,0.2), rgba(0,255,195,0.05))',
                border: '2px solid #00ffc3',
                color: '#00ffc3',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                fontSize: isMobile ? 12 : 16,
                fontFamily: '"Courier New", monospace',
                textShadow: '0 0 6px #00ffc3',
                boxShadow: '0 0 10px #00ffc3',
              }}
            >
              {getInitials(user.name)}
            </Box>

            <Button
              onClick={logout}
              sx={{
                color: '#ff4444',
                border: '1px solid #ff4444',
                background: 'rgba(255, 68, 68, 0.05)',
                fontFamily: '"Courier New", monospace',
                fontSize: isMobile ? '0.7rem' : '0.9rem',
                padding: isMobile ? '4px 8px' : '6px 12px',
                textShadow: '0 0 5px #ff4444',
                boxShadow: '0 0 8px #ff4444',
                transition: '0.3s ease',
                '&:hover': {
                  background: 'rgba(255, 68, 68, 0.15)',
                  boxShadow: '0 0 12px #ff4444, 0 0 20px #ff4444',
                  borderColor: '#ff0000',
                },
              }}
            >
              LOGOUT
            </Button>
          </>
        ) : (
          <GoogleAuthButton />
        )}
      </Box>
    </Box>
  );
};
