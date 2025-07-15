import { motion, AnimatePresence } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { toggleTracker } from '../redux/skillsSlice';
import {  Typography, IconButton, useMediaQuery, useTheme} from '@mui/material';
import TerminalIcon from '@mui/icons-material/Terminal';
import CloseIcon from '@mui/icons-material/Close';
import SkillPointsEditor from './SkillPointsEditor';
import type { RootState } from '../redux/store';
import { useGoogleAuth } from '../context/GoogleAuthContext';

const SkillTracker = () => {
  const { isTrackerVisible } = useSelector((state: RootState) => state.skills);
  const dispatch = useDispatch();
   const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
   const { isAdmin } = useGoogleAuth();
      // const { isAdmin } = "false";

   console.log("admin is" +isAdmin);
   
  return (
    <>
  
      {!isAdmin ? (
       <></>
      ) : (
       <div style={{ position: 'fixed', 
      top: isMobile ? 90 : 100, 
      right: isMobile ? 10 : 20, 
      zIndex: 9999  }}>
      {/* Closed State (Terminal Icon) */}
      {!isTrackerVisible && (
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => dispatch(toggleTracker())}
          style={{
            cursor: 'pointer',
            background: 'rgba(0, 15, 20, 0.8)',
            border: '1px solid #00ffc3',
            borderRadius: '50%',
            width: 50,
            height: 50,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 10px #00ffc3'
          }}
        >
          <TerminalIcon sx={{ color: '#00ffc3', fontSize: 28 }} />
        </motion.div>
      )}

      {/* Expanded State */}
      <AnimatePresence>
        {isTrackerVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: 'spring', damping: 20 }}
            style={{
              background: 'rgba(10, 5, 20, 0.95)',
              border: '1px solid #00ffc3',
               width: isMobile ? '230px' : '600px' ,
              borderRadius: 5,
              overflow: 'hidden',
              fontFamily: '"Courier New", monospace',
              boxShadow: '0 0 15px #00ffc3'
            }}
          >
            {/* Header */}
            <div style={{
              background: 'linear-gradient(90deg, #0a0a20, #003330)',
              padding: '8px 12px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottom: '1px solid #00ffc3'
            }}>
              <Typography 
                variant="h6" 
                style={{ 
                  textShadow: '0 0 5px #00ffc3',
                  fontFamily: '"Courier New", monospace',
                  textTransform: 'uppercase',
                  letterSpacing: '1px'
                }}
              >
                {'>'} SKILL_TRACKER.EXE
              </Typography>
              <IconButton 
                size="small" 
                onClick={() => dispatch(toggleTracker())}
                style={{ color: '#00ffc3' }}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </div>

            {/* Content */}
            <SkillPointsEditor />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
      )}
    </>
  );
};

export default SkillTracker;