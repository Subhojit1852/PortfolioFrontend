import { Box, Typography } from '@mui/material';

export default function Footer() {
  return (
    <Box sx={{ py: 4, textAlign: 'center', borderTop: '1px solid #333' }}>
      <Typography variant="body2" color="textSecondary">
        © {new Date().getFullYear()} Subhojit Ganguly. Built with React, TypeScript, and GenAI 🚀
      </Typography>
    </Box>
  );
}
