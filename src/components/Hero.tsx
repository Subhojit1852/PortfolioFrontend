// components/Hero.tsx
import { Box, Typography, Button, Stack } from '@mui/material';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { TypeAnimation } from 'react-type-animation';
// import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
// import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

export default function Hero() {
  const codeSnippet = `// My Tech Stack
const techStack = {
  backend: 'FastAPI, Node.js',
  frontend: 'React, TypeScript',
  ai: 'LangChain, LLMs',
  cloud: 'Azure, Docker'
};

function buildProjects() {
  return innovativeSolutions.map(solution => 
    createValue(solution)
  );
}`;

  return (
    <Box sx={{ textAlign: 'center', position: 'relative', py: { xs: 6, md: 12 }, px: 2 }}>
      <Typography variant="h3" color="primary"  gutterBottom sx={{
        fontSize: { xs: '1.8rem', sm: '2.5rem', md: '3rem' } // Responsive font size
      }}>
        Subhojit Ganguly
      </Typography>
      
      <TypeAnimation
        sequence={[
          'Software Engineer',
          1000,
          'GenAI Developer',
          1000,
          'LLM & FastAPI Enthusiast',
          1000,
          'Full-Stack Engineer',
          1000
        ]}
        wrapper="span"
        speed={50}
        style={{ 
          fontSize: '1.5em', 
          display: 'inline-block',
          color: '#00ffc3',
          fontWeight: 'bold',
          height: '1.5em'
        }}
        repeat={Infinity}
      />

      <Box sx={{ 
        maxWidth: '800px', 
        margin: '2em auto',
        textAlign: 'left',
        backgroundColor: '#1e1e1e',
        borderRadius: '8px',
        overflow: 'hidden'
      }}>
       <TypeAnimation
  sequence={[codeSnippet]}
  wrapper="div"
  speed={30}
  repeat={2}
  style={{ 
    fontFamily: 'monospace', 
    fontSize: '1rem', 
    whiteSpace: 'pre-wrap', 
    color: '#00ffcc',
    backgroundColor: '#1e1e1e',
    padding: '1em',
    borderRadius: '8px',
    textAlign: 'left',
    maxWidth: '800px',
    margin: '2em auto'
  }}
/>

      </Box>

      <Stack direction={{ xs: 'column', sm: 'row' }}  spacing={2} justifyContent="center"  sx={{ width: { xs: '100%', sm: 'auto' } }}>
        <Button
          variant="contained"
          color="primary"
          href="/Subhojit_Ganguly_Resume.pdf"
          target="_blank"
        >
          View Resume
        </Button>
        <Button
          variant="outlined"
          startIcon={<FaLinkedin />}
          href="https://www.linkedin.com/in/subhojit-ganguly-53025618b"
          target="_blank"
        >
          LinkedIn
        </Button>
        <Button
          variant="outlined"
          startIcon={<FaGithub />}
          href="https://github.com/Subhojit1852"
          target="_blank"
        >
          GitHub
        </Button>
      </Stack>
    </Box>
  );
}