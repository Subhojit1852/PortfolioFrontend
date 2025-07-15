import React, { useCallback, useEffect, useRef } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import SkillDialog from './SkillDialog';
import { useSelector } from 'react-redux';
import { Box } from '@mui/material';
import type { RootState } from '../redux/store';

interface SkillNode {
  id: string;
  name: string;
  val: number;
  color: string;
  group: number;
  value: number;
  proficiency: string;
}

interface SkillLink {
  source: string;
  target: string;
  value: number;
}


const projects = {
  'CryptoBot': ['LangChain', 'LLMs (Zephyr-7B, Mistral)', 'Streamlit', 'CoinGecko API', 'FAISS', 'RAG'],
  'Medical Chatbot': ['FastAPI', 'React', 'MSAL', 'CosmosDB', 'Speech SDK', 'Prompt Engineering'],
  'Quality Writing Tool': ['FastAPI', 'Azure Service Bus', 'React', 'MSAL', 'OpenAPI', 'Debouncing'],
  'Portfolio Site': ['React', 'TypeScript', 'Material UI'],
  'General': ['Docker', 'GitHub Actions', 'Azure WebApps', 'Postman', 'JWT', 'Redux', 'Tailwind CSS']
};

const SkillsGraph = () => {
  const skills = useSelector((state: RootState) => state.skills.skills);
  const [selectedSkill, setSelectedSkill] = React.useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const fgRef = useRef<any>(null);

  // Helper functions
  const getProficiencyColor = (value: number): string => {
    if (value <= 50) return '#ff9800'; // Orange
    if (value <= 70) return '#4caf50'; // Green
    return '#00ffc3'; // Cyan
  };

  const getProficiencyText = (value: number): string => {
    if (value <= 50) return 'Average';
    if (value <= 70) return 'Good';
    return 'Excellent';
  };

  // Create nodes with project-based grouping and proficiency data
  const nodes: SkillNode[] = skills.map(skill => {
    let group = 0;
    Object.entries(projects).forEach(([ projectSkills], index) => {
      if (projectSkills.includes(skill.name)) group = index + 1;
    });

    return {
      id: skill.name,
      name: `${skill.name} (${skill.value}%)`,
      val: skill.value / 10 + 5, // Scale node size based on proficiency
      color: getProficiencyColor(skill.value),
      group,
      value: skill.value,
      proficiency: getProficiencyText(skill.value)
    };
  });

  // Create links between skills in the same project
  const links: SkillLink[] = [];
  Object.values(projects).forEach(projectSkills => {
    for (let i = 0; i < projectSkills.length; i++) {
      for (let j = i + 1; j < projectSkills.length; j++) {
        if (skills.some(s => s.name === projectSkills[i]) && 
            skills.some(s => s.name === projectSkills[j])) {
          links.push({
            source: projectSkills[i],
            target: projectSkills[j],
            value: 0.8
          });
        }
      }
    }
  });

  // Add some cross-project connections
  links.push({ source: 'FastAPI', target: 'React', value: 0.3 });
  links.push({ source: 'MSAL', target: 'React', value: 0.3 });
  links.push({ source: 'Docker', target: 'FastAPI', value: 0.3 });

  const handleNodeClick = useCallback((node: SkillNode) => {
    setSelectedSkill(node.id);
    setDialogOpen(true);
  }, []);

  const handleEngineStop = useCallback(() => {
    if (fgRef.current) {
      fgRef.current.zoomToFit(400);
    }
  }, []);

  // Stabilize graph layout
  useEffect(() => {
    if (fgRef.current) {
      fgRef.current.d3Force('charge').strength(-150);
      fgRef.current.d3Force('link').distance(100);
      fgRef.current.d3Force('center').strength(0.1);
      
      const stabilizeGraph = () => {
        fgRef.current.zoomToFit(200, 50);
        fgRef.current.cooldownTicks(0);
        const currentZoom = fgRef.current.zoom();
        if (currentZoom > 1.5) {
          fgRef.current.zoom(1.5, 1000);
        }
      };

      const timer = setTimeout(stabilizeGraph, 800);
      return () => clearTimeout(timer);
    }
  }, [skills]); // Re-run when skills change

  return (
    <Box sx={{ 
      height: '600px',
      width: '100%',
      overflow: 'hidden',
      borderRadius: '8px',
      border: '1px solid #00ffc3',
      backgroundColor: '#0a0a10'
    }}>
      <ForceGraph2D
        ref={fgRef}
        graphData={{ nodes, links }}
        width={typeof window !== 'undefined' ? Math.min(window.innerWidth * 0.9, 1200) : 800}
        height={600}
        nodeLabel="name"
        linkDirectionalArrowLength={0}
        linkWidth={1.5}
        linkColor={() => 'rgba(255, 255, 255, 0.2)'}
        onNodeClick={handleNodeClick}
        nodeCanvasObject={(node, ctx, globalScale) => {
  ctx.fillStyle = node.color; // Proficiency-based color
  
          const label = node.name;
          
          const fontSize = Math.min(16, 14 / globalScale);
          ctx.font = `${fontSize}px Sans-Serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillStyle = node.color;
          ctx.fillText(label, node.x || 0, node.y || 0);
        }}
        dagMode="radialout"
        dagLevelDistance={150}
        onEngineStop={handleEngineStop}
        nodeVal={node => (node as SkillNode).val}
        enablePointerInteraction={true}
      />
      
      {selectedSkill && (
        <SkillDialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          skillName={selectedSkill}
          skillContext={skills.find(s => s.name === selectedSkill)?.context || ''}
          skillValue={skills.find(s => s.name === selectedSkill)?.value || 0}
        />
      )}
    </Box>
  );
};

export default SkillsGraph;