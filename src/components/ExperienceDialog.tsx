// components/ExperienceDialog.tsx
import React from 'react';
import { Dialog, DialogTitle, DialogContent, IconButton, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface Props {
  open: boolean;
  onClose: () => void;
  title: string;
  description: string[];
}
const ExperienceDialog: React.FC<Props> = ({ open, onClose, title, description }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          background: '#0f1117',
          color: '#fff',
          border: '1px solid #00ffc3',
          borderRadius: 2,
        },
      }}
    >
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography fontWeight="bold" color="#00ffc3">{title}</Typography>
       <IconButton
  onClick={() => {
    console.log("Close button clicked");
    onClose();
  }}
  sx={{ color: '#00ffc3' }}
>
  <CloseIcon />
</IconButton>

      </DialogTitle>
      <DialogContent>
        {description.map((line, idx) => (
          <Typography key={idx} variant="body2" sx={{ mb: 1 }}>
            • {line}
          </Typography>
        ))}
      </DialogContent>
    </Dialog>
  );
};

export default ExperienceDialog;
