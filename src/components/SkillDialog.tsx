// components/SkillDialog.tsx
import React from 'react';
import { Dialog, DialogTitle, DialogContent, IconButton, Typography, Box, Chip } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface SkillDialogProps {
 open: boolean;
  onClose: () => void;
  skillName: string;
  skillContext: string;
  skillValue: number;
}

const SkillDialog: React.FC<SkillDialogProps> = ({ open, 
  onClose, 
  skillName, 
  skillContext,
  skillValue  }) => {

     const getProficiencyColor = (value: number) => {
    if (value <= 50) return '#ff9800';
    if (value <= 70) return '#4caf50';
    return '#00ffc3';
  };

  const getProficiencyText = (value: number): string => {
  if (value <= 50) return 'Average';
  if (value <= 70) return 'Good';
  return 'Excellent';
};
  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          background: '#0f1117',
          border: '1px solid #00ffc3',
          color: '#ffffff',
          borderRadius: 2,
          padding: 2,
        },
      }}
    >
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography fontWeight="bold" color="#00ffc3">{skillName}</Typography>
        <Box>
          {/* <Typography fontWeight="bold" color="#00ffc3">{skillName}</Typography> */}
          <Chip 
            label={`${skillValue}% - ${getProficiencyText(skillValue)}`}
            sx={{
              bgcolor: getProficiencyColor(skillValue),
              color: '#0a0a10',
              fontWeight: 'bold',
              ml: 1
            }}
          />
        </Box>
        <IconButton onClick={onClose} sx={{ color: '#00ffc3' }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Typography>{skillContext}</Typography>
      </DialogContent>
    </Dialog>
  );
};

export default SkillDialog;
