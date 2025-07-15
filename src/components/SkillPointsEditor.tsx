import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateSkill, addSkill, removeSkill } from '../redux/skillsSlice';
import {
  Box,
  Typography,
  Slider,
  TextField,
  Button,
  Chip,
  Stack,
  useTheme,
  useMediaQuery
} from '@mui/material';
import type { RootState } from '../redux/store';

const SkillPointsEditor = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const { skills, usedPoints, totalPoints } = useSelector((state: RootState) => state.skills);
  const dispatch = useDispatch();
  const [newSkill, setNewSkill] = useState('');
  const [newSkillValue, setNewSkillValue] = useState(50);

  const getProficiencyColor = (value: number) => {
    if (value <= 50) return '#ff9800'; // Orange for Average
    if (value <= 70) return '#4caf50'; // Green for Good
    return '#00ffc3'; // Neon cyan for Excellent
  };

  const getProficiencyText = (value: number) => {
    if (value <= 50) return 'Average';
    if (value <= 70) return 'Good';
    return 'Excellent';
  };

  const handleAddSkill = () => {
    if (newSkill && !skills.some(s => s.name === newSkill)) {
      dispatch(addSkill({ name: newSkill, value: newSkillValue }));
      setNewSkill('');
    }
  };
  const handleSkillChange = (name: string, value: number) => {
  dispatch(updateSkill({ name, value }));
};

  return (
    <Box sx={{ 
      maxHeight: '70vh', // or whatever percentage you prefer
  overflowY: 'auto',
  padding: 2,
  width: isMobile ? '230px' : '600px' 
    }}>
      {/* Points Allocation Header */}
      <Typography variant="body2" sx={{ 
        mb: isMobile ? 1.5 : 2,
        color: '#00ffc3',
        fontSize: isMobile ? '0.75rem' : '0.875rem',
        textAlign: 'center'
      }}>
        {usedPoints}/{totalPoints} POINTS ALLOCATED
      </Typography>

      {/* Skills List */}
      <Box sx={{ 
        mb: isMobile ? 2 : 3,
        maxHeight: isMobile ? '45vh' : 'none',
        overflowY: 'auto',
        pr: isMobile ? 0 : 1
      }}>
        {skills.map((skill) => (
          <Box key={skill.name} sx={{ 
            mb: isMobile ? 2 : 2.5,
            px: isMobile ? 0.5 : 1
          }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
              <Typography variant="body2" sx={{ 
                color: '#ffffff',
                fontSize: isMobile ? '0.8rem' : '0.875rem',
                fontWeight: 500
              }}>
                {skill.name}
              </Typography>
              <Stack direction="row" spacing={1} alignItems="center">
                <Chip 
                  label={getProficiencyText(skill.value)} 
                  size="small"
                  sx={{ 
                    bgcolor: getProficiencyColor(skill.value),
                    color: '#0a0a10',
                    fontWeight: 'bold',
                    fontSize: isMobile ? '0.65rem' : '0.7rem'
                  }}
                />
                <Button 
                  size="small" 
                  variant="outlined" 
                  onClick={() => dispatch(removeSkill(skill.name))}
                  sx={{ 
                    minWidth: 24,
                    height: 24,
                    color: '#ff5252',
                    borderColor: '#ff5252',
                    fontSize: '0.75rem'
                  }}
                >
                  ×
                </Button>
              </Stack>
            </Stack>
            <Slider
              value={skill.value}
               onChange={(_, value) => handleSkillChange(skill.name, value as number)}
               onChangeCommitted={(_, value) => handleSkillChange(skill.name, value as number)}
              min={0}
              max={100}
              sx={{
                color: '#00ffc3',
                '& .MuiSlider-thumb': {
                  width: isMobile ? 14 : 16,
                  height: isMobile ? 14 : 16,
                  '&:hover': {
                    boxShadow: '0 0 0 6px rgba(0, 255, 195, 0.16)',
                  },
                },
                '& .MuiSlider-track': {
                  height: isMobile ? 4 : 6
                },
                '& .MuiSlider-rail': {
                  height: isMobile ? 4 : 6
                }
              }}
            />
            <Typography 
              variant="caption" 
              sx={{ 
                display: 'block', 
                textAlign: 'center', 
                color: '#00ffc3',
                fontSize: isMobile ? '0.7rem' : '0.75rem'
              }}
            >
              {skill.value}%
            </Typography>
          </Box>
        ))}
      </Box>

      {/* Add New Skill Section */}
      <Box sx={{ 
        pt: isMobile ? 1.5 : 2,
        borderTop: '1px dashed #333'
      }}>
        <Typography variant="body2" sx={{ 
          mb: isMobile ? 1.5 : 2,
          color: '#00ffc3',
          fontSize: isMobile ? '0.8rem' : '0.875rem',
          fontWeight: 500
        }}>
          ADD NEW SKILL
        </Typography>
        
        <Stack 
          direction={isMobile ? 'column' : 'row'} 
          spacing={isMobile ? 1.5 : 2} 
          alignItems={isMobile ? 'stretch' : 'center'}
        >
         <TextField
  placeholder="Skill name"
  value={newSkill}
  onChange={(e) => setNewSkill(e.target.value)}
  size="small"
  sx={{
   
  }}
/>
          
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center',
            gap: isMobile ? 1 : 1.5,
            width: isMobile ? '100%' : 'auto'
          }}>
            <Slider
              value={newSkillValue}
              onChange={(_, value) => setNewSkillValue(value as number)}
              min={0}
              max={100}
              sx={{ 
                width: isMobile ? '60%' : 120,
                color: '#00ffc3',
                '& .MuiSlider-thumb': {
                  width: isMobile ? 14 : 16,
                  height: isMobile ? 14 : 16,
                },
              }}
            />
            <Chip 
              label={`${newSkillValue}%`} 
              sx={{ 
                bgcolor: '#00ffc3',
                color: '#0a0a10',
                fontWeight: 'bold',
                fontSize: isMobile ? '0.7rem' : '0.75rem',
                minWidth: 50
              }}
            />
          </Box>
          
          <Button 
            variant="outlined" 
            onClick={handleAddSkill}
            disabled={!newSkill || skills.some(s => s.name === newSkill) || (usedPoints + newSkillValue > totalPoints)}
            sx={{ 
              color: '#00ffc3', 
              borderColor: '#00ffc3',
              height: isMobile ? 36 : 40,
              fontSize: isMobile ? '0.75rem' : '0.8rem',
              '&:hover': {
                bgcolor: 'rgba(0, 255, 195, 0.1)'
              },
              flexShrink: 0
            }}
          >
            {isMobile ? 'ADD' : 'ADD SKILL'}
          </Button>
        </Stack>
      </Box>
    </Box>
  );
};

export default SkillPointsEditor;