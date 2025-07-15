// components/SkillMatrix3D.tsx
import { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, OrbitControls, Environment } from '@react-three/drei';
import * as THREE from 'three';
import { useSelector } from 'react-redux';
import type { RootState } from '../redux/store';
import { Box, Typography } from '@mui/material';

const SkillTower = ({ name, value, position, color, hovered, setHovered }: { 
  name: string; 
  value: number; 
  position: [number, number, number]; 
  color: string;
  hovered: boolean;
  setHovered: (val: string | null) => void;
}) => {
  const ref = useRef<THREE.Mesh>(null);
  const height = value / 10; // Scale height based on skill value
  
  useFrame(({ clock }) => {
    if (ref.current) {
      // Subtle pulsing animation when hovered
      ref.current.position.y = hovered 
        ? position[1] + Math.sin(clock.getElapsedTime() * 3) * 0.2 
        : position[1];
    }
  });

  return (
    <group position={position}>
      <mesh 
        ref={ref}
        onPointerOver={() => setHovered(name)}
        onPointerOut={() => setHovered(null)}
      >
        <boxGeometry args={[1, height, 1]} />
        <meshStandardMaterial 
          color={hovered ? '#00ffc3' : color} 
          emissive={hovered ? '#00ffc3' : color}
          emissiveIntensity={hovered ? 0.5 : 0.1}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
      {hovered && (
        <Text
  position={[0, height + 0.5, 0]}
  fontSize={0.4}
  color="#00ffc3"
  anchorX="center"
  anchorY="middle"
  maxWidth={2}
  rotation={[0, 0, 0]} // Explicitly set rotation
  quaternion={undefined} // Disable automatic quaternion updates
  lookAt={[0, 0, 0]} // Make text face forward
 

        >
          {`${name} (${value}%)`}
        </Text>
      )}
    </group>
  );
};

const SkillMatrixScene = () => {
  const skills = useSelector((state: RootState) => state.skills.skills);
  const [hovered, setHovered] = useState<string | null>(null);
  
  // Arrange skills in a grid
  const gridSize = Math.ceil(Math.sqrt(skills.length));
  const spacing = 2.5;
  
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <OrbitControls 
        enableZoom={true}
        enablePan={false}
        minDistance={5}
        maxDistance={20}
        autoRotate
        autoRotateSpeed={0.5}
      />
      <Environment preset="city" />
      
      {skills.map((skill, index) => {
        const row = Math.floor(index / gridSize);
        const col = index % gridSize;
        const x = (col - gridSize/2) * spacing;
        const z = (row - gridSize/2) * spacing;
        const color = skill.value <= 50 
          ? '#ff5252' 
          : skill.value <= 70 
            ? '#ff9800' 
            : '#00ffc3';
            
        return (
          <SkillTower
            key={skill.name}
            name={skill.name}
            value={skill.value}
            position={[x, 0, z]}
            color={color}
            hovered={hovered === skill.name}
            setHovered={setHovered}
          />
        );
      })}
    </>
  );
};

export const SkillMatrix3D = () => {
  return (
    <Box sx={{ 
      width: '100%', 
      height: '60vh',
      position: 'relative',
      border: '1px solid #00ffc3',
      borderRadius: 1,
      overflow: 'hidden',
      background: 'rgba(10, 5, 20, 0.7)'
    }}>
      <Canvas camera={{ position: [0, 10, 15], fov: 50 }}>
        <SkillMatrixScene />
      </Canvas>
      <Typography 
        variant="body2" 
        sx={{
          position: 'absolute',
          bottom: 8,
          left: 8,
          color: '#00ffc3',
          fontFamily: '"Courier New", monospace'
        }}
      >
        Hover towers to view skills • Drag to rotate • Scroll to zoom
      </Typography>
    </Box>
  );
};