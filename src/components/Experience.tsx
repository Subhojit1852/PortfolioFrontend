import { useState } from 'react';
import {
  Box,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const experiences = [
  {
    title: 'Software Developer, EY (Feb 2024 – Present)',
    points: [
      'Built a GenAI chatbot (FastAPI + React + Azure Speech SDK), reducing effort by 40%.',
      'Delivered Pub/Sub based writing tool with calendars, sync, progress tracker.',
      'Integrated CosmosDB APIs with MSAL auth, reducing latency by 35%.',
      'Awarded GDS User Recognition for business excellence.',
    ],
  },
  {
    title: 'Freelance LLM Developer (2023)',
    points: [
      'Built multiple RAG-based tools using LangChain, HuggingFace, and FAISS.',
      'Deployed Streamlit dashboards with animated dark themes and prompt chaining.',
    ],
  },
  {
    title: 'Open Source Contributor (Ongoing)',
    points: [
      'Contributed to LangChain prompt templates and docs.',
      'Improved FastAPI + CosmosDB sample repo for GenAI bootstrapping.',
    ],
  },
];




export default function Experience() {
  const [open, setOpen] = useState(false);
  const handleClose = () => {
  console.log("Closing dialog");
  setOpen(false);
};
  return (
    <div>
        <div  onClick={() => setOpen(true)}>
<Typography
        variant="h4"
        color="#00ffc3"
        fontWeight="bold"
        sx={{
          position: 'relative',
          zIndex: 2,
          mb: 2,
          cursor: 'pointer',
                marginTop:5

        }}
      >
        Experience
      </Typography>
        </div>
    <Box
      id="experience"
      sx={{
        px: { xs: 2, sm: 4, md: 10 },
        py: 6,
        backgroundColor: '#0a0a10',
        borderRadius: 2,
        overflow: 'hidden',
        position: 'relative',
        height: '250px',
        cursor: 'pointer',
      }}
     onClick={() => setOpen(true)}
    >
      {/* Static Header */}
      

      {/* Scroll container */}
      <Box
        sx={{
          position: 'relative',
          height: '180px',
          overflow: 'hidden',
          '&:hover .scrollContent': {
            animationDuration: '30s', // slower on hover
          },
        }}
      >
        <Box
          className="scrollContent"
          sx={{
            display: 'inline-block',
            whiteSpace: 'nowrap',
            animation: 'scrollUp 15s linear infinite',
            '@keyframes scrollUp': {
              from: { transform: 'translateY(0)' },
              to: { transform: 'translateY(-50%)' }, // seamless loop
            },
          }}
        >
          {/* Repeat list twice for smooth loop */}
          {[...experiences, ...experiences].map((exp, idx) => (
            <Typography
              key={idx}
              variant="h6"
              color="#fff"
              sx={{ my: 2, textAlign: 'left' }}
            >
              {exp.points}
            </Typography>
          ))}
        </Box>
      </Box>

      {/* Modal with full details */}
      <Dialog
  open={open}
  onClose={handleClose}
  onClick={(e) => e.stopPropagation()} // 🔥 this prevents re-triggering parent click
  PaperProps={{
    sx: {
      background: '#0f1117',
      color: '#fff',
      border: '1px solid #00ffc3',
      borderRadius: 2,
      maxWidth: '600px',
      width: '90%',
    },
  }}
>
        <DialogTitle
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            fontWeight: 'bold',
            color: '#00ffc3',
          }}
        >
          Full Experience
          <IconButton onClick={handleClose} sx={{ color: '#00ffc3' }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {experiences.map((exp, idx) => (
            <Box key={idx} sx={{ mb: 3 }}>
              <Typography variant="h6" color="#00ffc3" gutterBottom>
                {exp.title}
              </Typography>
              <ul style={{ paddingLeft: '1.2rem' }}>
                {exp.points.map((point, pIdx) => (
                  <li key={pIdx}>
                    <Typography variant="body2">{point}</Typography>
                  </li>
                ))}
              </ul>
            </Box>
          ))}
        </DialogContent>
      </Dialog>
    </Box>
    </div>
  );
}
