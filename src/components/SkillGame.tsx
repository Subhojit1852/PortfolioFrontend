// components/SkillGame.tsx
import  { useEffect, useState } from 'react';
import { Box, Button, Typography, Grid } from '@mui/material';

const skills = ['React', 'FastAPI', 'LangChain', 'CosmosDB', 'MSAL', 'FAISS'];

export default function SkillGame({ loading }: { loading: boolean }) {
  const [correctIndex, setCorrectIndex] = useState<number | null>(null);
  const [revealed, setRevealed] = useState<number | null>(null);
  const [targetSkill, setTargetSkill] = useState('');

  useEffect(() => {
    if (loading) {
      const randomSkill = skills[Math.floor(Math.random() * skills.length)];
      setTargetSkill(randomSkill);
      setCorrectIndex(Math.floor(Math.random() * 3));
      setRevealed(null);
    }
  }, [loading]);

  if (!loading) return null;

  return (
    <Box sx={{ mt: 2, textAlign: 'center' }}>
      <Typography color="secondary" sx={{ mb: 1 }}>
        🔍 While I fetch the response... try your luck!
      </Typography>
      <Typography variant="subtitle2" sx={{ fontStyle: 'italic' }}>
        Find: {targetSkill}
      </Typography>
      <Grid container spacing={2} justifyContent="center" sx={{ mt: 1 }}>
        {[0, 1, 2].map((index) => (
          <Grid  key={index}>
            <Button
              variant="outlined"
              sx={{
                width: 100,
                height: 60,
                borderColor: '#00ffc3',
                color: '#00ffc3',
                fontWeight: 'bold',
              }}
              onClick={() => setRevealed(index)}
              disabled={revealed !== null}
            >
              {revealed === index
                ? index === correctIndex
                  ? targetSkill
                  : '❌'
                : '🃏'}
            </Button>
          </Grid>
        ))}
      </Grid>
      {revealed !== null && (
        <Typography sx={{ mt: 1 }} color={revealed === correctIndex ? 'success.main' : 'error.main'}>
          {revealed === correctIndex ? '🎉 You found it!' : 'Oops! Try next time.'}
        </Typography>
      )}
    </Box>
  );
}
