import { Box, Typography } from '@mui/material';

export default function About() {
  return (
    <Box sx={{ py: 6 }}>
      <Typography variant="h4" color="primary" gutterBottom>
        About Me
      </Typography>
      <Typography variant="body1">
        I’m a Software Developer at EY with hands-on experience delivering production-grade GenAI applications, including a medical chatbot, quality writing automation tools, and a live CryptoBot using LLMs. Awarded the GDS User Recognition Award for innovative delivery.
      </Typography>
    </Box>
  );
}
