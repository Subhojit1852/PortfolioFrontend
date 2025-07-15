import { Box, Typography, Card, CardContent, Button, Stack } from '@mui/material';
import React, { useState, useRef } from 'react';
import Draggable from 'react-draggable';
type NonNullableRef<T> = { current: T };

type Position = { x: number; y: number };
type Project = {
  title: string;
  link?: string;
  desc: string;
};

const projectsData: Project[] = [
    {
    title: 'CryptoBot — Intelligent Crypto Assistant',
    link: 'https://cryptobot-ma7faqhh66xvogqk4uzyaf.streamlit.app/',
    desc: 'Built using Zephyr-7B LLM (HuggingFace), LangChain, CoinGecko API, and Streamlit.',
  },
  {
    title: 'Medical Chatbot (Client Project) ',
    desc: 'Full-stack GenAI chatbot using FastAPI, React, MSAL, Azure Speech SDK.',
  },
  {
    title: 'Quality Writing Tool (Client Project)',
    desc: 'Pub/Sub-based document workflow app with custom calendar and MSAL auth.',
  },

];

export default function Projects() {
  const [projects, setProjects] = useState(projectsData);
  const [positions, setPositions] = useState<Position[]>(
    projectsData.map((_, i) => ({ x: 0, y: i * 10 }))
  );
  const nodeRefs = useRef<React.RefObject<HTMLDivElement>[]>([]);
  const [activeDrag, setActiveDrag] = useState<number | null>(null);
  const [swapAnimation, setSwapAnimation] = useState<{
    active: boolean;
    from: number;
    to: number;
  } | null>(null);

  // Initialize refs
  projects.forEach((_, i) => {
    if (!nodeRefs.current[i]) {
nodeRefs.current[i] = React.createRef() as NonNullableRef<HTMLDivElement>;
    }
  });

  const handleDrag = (index: number, e: any, data: { x: number; y: number }) => {
    const newPositions = [...positions];
    newPositions[index] = { x: data.x, y: data.y };
    setPositions(newPositions);
  };

  const handleStop = (index: number) => {
    setActiveDrag(null);
    
    const draggedRect = nodeRefs.current[index]?.current?.getBoundingClientRect();
    if (!draggedRect) return;

    let closestIndex = -1;
    let minDistance = Infinity;

    projects.forEach((_, i) => {
      if (i === index) return;
      const targetRect = nodeRefs.current[i]?.current?.getBoundingClientRect();
      if (!targetRect) return;

      const distance = Math.sqrt(
        Math.pow(draggedRect.left - targetRect.left, 2) +
        Math.pow(draggedRect.top - targetRect.top, 2)
      );

      if (distance < minDistance) {
        minDistance = distance;
        closestIndex = i;
      }
    });

    if (closestIndex !== -1 && minDistance < 150) {
      setSwapAnimation({ active: true, from: index, to: closestIndex });
      
      setTimeout(() => {
        const newProjects = [...projects];
        [newProjects[index], newProjects[closestIndex]] = 
          [newProjects[closestIndex], newProjects[index]];
        setProjects(newProjects);
        setSwapAnimation(null);
        setPositions(projectsData.map((_, i) => ({ x: 0, y: i * 10 })));
      }, 300);
    } else {
      setPositions(projectsData.map((_, i) => ({ x: 0, y: i * 10 })));
    }
  };

  return (
    <Box sx={{ py: 6 }}>
      <Typography variant="h4" color="primary" gutterBottom>
        Projects Playground
      </Typography>
      <Stack spacing={3} sx={{ minHeight: '500px', position: 'relative' }}>
        {projects.map((proj, index) => (
          <Draggable
            key={proj.title}
            nodeRef={nodeRefs.current[index]}
            position={swapAnimation?.active ? { x: 0, y: 0 } : positions[index]}
            bounds="parent"
            handle=".drag-handle"
            onDrag={(e, data) => handleDrag(index, e, data)}
            onStop={() => handleStop(index)}
            onStart={() => setActiveDrag(index)}
          >
            <div
              ref={nodeRefs.current[index]}
              style={{
                
                transform: swapAnimation?.active && 
                  (index === swapAnimation.from || index === swapAnimation.to)
                  ? `translate(${
                      index === swapAnimation.from 
                        ? positions[swapAnimation.to].x 
                        : positions[swapAnimation.from].x
                    }px, ${
                      index === swapAnimation.from 
                        ? positions[swapAnimation.to].y 
                        : positions[swapAnimation.from].y
                    }px)`
                  : undefined,
                  
                transition: 'transform 0.3s cubic-bezier(0.2, 0.8, 0.4, 1)',
                zIndex: activeDrag === index ? 1000 : 
                  swapAnimation?.active && (index === swapAnimation.from || index === swapAnimation.to) 
                    ? 999 
                    : 1,
                display: 'inline-block',
                position: 'relative'
              } as React.CSSProperties}
            >
              <Card
                variant="outlined"
                sx={{
                  backgroundColor: '#1e1e1e',
                  cursor: 'move',
                  transform: activeDrag === index ? 'scale(1.02)' : 'scale(1)',
                  transition: 'all 0.3s cubic-bezier(0.2, 0.8, 0.4, 1)',
                  boxShadow: activeDrag === index ? '0 0 15px #00ffc3' : 'none',
                }}
              >
               <CardContent>
                  <Box
                    className="drag-handle"
                    sx={{
                      padding: 1,
                      backgroundColor: '#0a0a10',
                      borderBottom: '1px solid #00ffc3',
                      cursor: 'move',
                      userSelect: 'none',
                    }}
                  >
                    <Typography variant="h6" color="primary">
                      {proj.title} (Drag me)
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ my: 1 }}>
                    {proj.desc}
                  </Typography>
                  {proj.link && (
                    <Button
                      variant="outlined"
                      size="small"
                      href={proj.link}
                      target="_blank"
                      sx={{ mt: 1 }}
                    >
                      View Live
                    </Button>
                  )}
                </CardContent>
              </Card>
            </div>
          </Draggable>
        ))}
      </Stack>
    </Box>
  );
}