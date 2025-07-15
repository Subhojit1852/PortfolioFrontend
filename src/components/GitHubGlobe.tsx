// components/GitHubGlobe.tsx
import { useEffect, useRef, useState, useMemo } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, Text } from '@react-three/drei';
import * as THREE from 'three';
import Globe from 'three-globe';
import { Box, Button, Typography } from '@mui/material';

interface CommitData {
  lat: number;
  lng: number;
  intensity: number;
  date: string;
  message: string;
  repo: string;
  count: number;
  id: string;
}

const GITHUB_USERNAME = 'Subhojit1852';
// Add this at the top of your GitHubGlobe component
const GitHubGlobeComponent = ({
  setHoveredCommit,
  commitData,
  setCommitData,
  
  setLoading
}: {
  setHoveredCommit: (commit: CommitData | null) => void;
  commitData: CommitData[];
  setCommitData: (data: CommitData[]) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const customPointsRef = useRef<THREE.Points | null>(null);
  const geometryRef = useRef<THREE.BufferGeometry | null>(null);
  const hoverTimeout = useRef<number | null>(null);
  const { raycaster, mouse, camera } = useThree();
  const [filteredCommits, setFilteredCommits] = useState<CommitData[]>([]);

  const globe = useMemo(() => {
    const g = new Globe();

    g.globeMaterial(new THREE.MeshPhongMaterial({
      color: new THREE.Color(0x1a1a2e),
      specular: new THREE.Color(0x1a1a2e),
      shininess: 5
    }));

    g.pointColor(() => '#00ffc3')
     .pointAltitude((d: any) => d.intensity * 0.2)
     .pointRadius(0.1);

    g.arcColor(() => '#00ffc3')
     .arcStroke(0.5)
     .arcDashLength(0.3)
     .arcDashGap(0.1)
     .arcDashAnimateTime(2000);

    return g;
  }, []);

  useEffect(() => {
    if (groupRef.current) {
      groupRef.current.clear();
      groupRef.current.add(globe);
      console.log("✅ Globe added to groupRef");
    }
  }, [globe]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/events`);
        const events = await res.json();

        const processedData = events
          .filter((event: any) => event.type === 'PushEvent')
          .flatMap((event: any, i: number) => {
            if (!event.payload.commits) return [];
            return event.payload.commits.map((commit: any, j: number) => ({
              lat: (Math.random() * 180) - 90,
              lng: (Math.random() * 360) - 180,
              intensity: 0.5 + Math.random() * 0.5,
              date: new Date(event.created_at).toLocaleDateString(),
              message: commit.message,
              repo: event.repo?.name,
              count: event.payload.size || 1,
              id: `${i}-${j}-${Date.now()}`
            }));
          });

        console.log("✅ Fetched commit events:", processedData);
      const validData = processedData.filter(
        (  d: { repo: string; message: string; date: string; }) => d.repo?.trim() || d.message?.trim() || d.date?.trim()
);

console.log(`✅ Filtered ${validData.length} of ${processedData.length} commits`);
setCommitData(validData); // now both are the same

setFilteredCommits(validData);

      } catch (err) {
        console.error("❌ Error fetching GitHub events:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [setCommitData, setLoading]);

  useEffect(() => {
    if (!globe || commitData.length === 0) return;

    const arcs = commitData.map(d => ({
      startLat: d.lat,
      startLng: d.lng,
      endLat: d.lat + 0.1,
      endLng: d.lng + 0.1,
      color: '#00ffc3',
      id: d.id
    }));

    globe.arcsData(arcs).pointsData(commitData);
    console.log("✅ Globe data updated");
  }, [commitData, globe]);

  // Custom selectable points for raycasting
  useEffect(() => {
   if (!groupRef.current || filteredCommits.length === 0) return;

const positions = new Float32Array(filteredCommits.length * 3);
filteredCommits.forEach((commit, i) => {
  const phi = (90 - commit.lat) * (Math.PI / 180);
  const theta = (commit.lng + 180) * (Math.PI / 180);
  const r = 100;

  positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
  positions[i * 3 + 1] = r * Math.cos(phi);
  positions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
});


    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometryRef.current = geometry;

    const material = new THREE.PointsMaterial({
      color: '#00ffc3',
      size: 3,
      sizeAttenuation: true,
      depthTest: false,
      transparent: true
    });

    const pointsMesh = new THREE.Points(geometry, material);
    pointsMesh.name = 'manualCommitPoints';

    groupRef.current.add(pointsMesh);
    customPointsRef.current = pointsMesh;

    console.log("✅ Custom commit point mesh added to group");
  }, [commitData]);

  useFrame(() => {
    if (!customPointsRef.current) return;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObject(customPointsRef.current, true);

    if (intersects.length > 0) {
      const intersect = intersects[0];
      const index = intersect.index;

      if (index !== undefined && filteredCommits[index]) {
        console.log("🟢 Hovered commit:", filteredCommits[index]);
        if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
          setHoveredCommit(filteredCommits[index]);

        return;
      }
    }

    hoverTimeout.current = window.setTimeout(() => {
      setHoveredCommit(null);
    }, 100);
  });

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      <group ref={groupRef} />
    </>
  );
};

export const GitHubGlobe = () => {
    const [autoRotate, setAutoRotate] = useState(true);

  const [commitData, setCommitData] = useState<CommitData[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoveredCommit, setHoveredCommit] = useState<CommitData | null>(null);

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
      <Canvas camera={{ position: [0, 0, 300], fov: 45 }}>
        <GitHubGlobeComponent
          setHoveredCommit={setHoveredCommit}
          commitData={commitData}
          setCommitData={setCommitData}
          loading={loading}
          setLoading={setLoading}
        />
        <OrbitControls
          enableZoom={true}
          enablePan={false}
          minDistance={150}
          maxDistance={500}
          autoRotate={autoRotate}
          autoRotateSpeed={0.5}
        />
        {hoveredCommit && (
          <Text
            position={new THREE.Vector3().setFromSphericalCoords(
              110,
              THREE.MathUtils.degToRad(90 - hoveredCommit.lat),
              THREE.MathUtils.degToRad(hoveredCommit.lng)
            )}
            fontSize={0.15}
            color="#00ffc3"
            anchorX="center"
            anchorY="middle"
            maxWidth={2}
          >
            {`${hoveredCommit.repo.split('/')[1]}\n${hoveredCommit.date}`}
          </Text>
        )}
      </Canvas>

      {hoveredCommit && (
        <Box sx={{
          position: 'absolute',
          bottom: 8,
          right: 8,
          bgcolor: 'rgba(10, 5, 20, 0.8)',
          border: '1px solid #00ffc3',
          borderRadius: 1,
          p: 1.5,
          maxWidth: '40%'
        }}>
          <Typography variant="caption" sx={{ color: '#00ffc3', display: 'block', fontFamily: 'monospace' }}>
            <strong>Repo:</strong> {hoveredCommit.repo}
          </Typography>
          <Typography variant="caption" sx={{ color: '#00ffc3', display: 'block', fontFamily: 'monospace' }}>
            <strong>Date:</strong> {hoveredCommit.date}
          </Typography>
          <Typography variant="caption" sx={{ color: '#00ffc3', display: 'block', fontFamily: 'monospace' }}>
            <strong>Message:</strong> {hoveredCommit.message.substring(0, 50)}{hoveredCommit.message.length > 50 ? '...' : ''}
          </Typography>
        </Box>
      )}

      <Typography variant="body2" sx={{
        position: 'absolute',
        bottom: 8,
        left: 8,
        color: '#00ffc3',
        fontFamily: 'monospace'
      }}>
        GitHub Contribution Globe • Drag to rotate • Scroll to zoom
      </Typography>
// Add this inside your Box component, just before the closing tag
<Button
  variant="contained"
  onClick={() => setAutoRotate(!autoRotate)}
  sx={{
    position: 'absolute',
    top: 8,
    right: 8,
    bgcolor: autoRotate ? '#00ffc3' : '#1a1a2e',
    color: autoRotate ? '#1a1a2e' : '#00ffc3',
    '&:hover': {
      bgcolor: autoRotate ? '#00cc99' : '#252538'
    },
    border: '1px solid #00ffc3',
    fontFamily: 'monospace',
    textTransform: 'none'
  }}
>
  {autoRotate ? 'Pause Rotation' : 'Resume Rotation'}
</Button>
      
    </Box>
  );
};
