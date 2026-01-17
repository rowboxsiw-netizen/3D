
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh } from 'three';
import { ShapeType, ShapeConfig } from '../types';

interface SceneProps {
  config: ShapeConfig;
}

const Scene: React.FC<SceneProps> = ({ config }) => {
  const meshRef = useRef<Mesh>(null);

  useFrame((state, delta) => {
    if (meshRef.current) {
      // Manual small rotation on top of OrbitControls auto-rotate if desired
      meshRef.current.rotation.y += delta * (config.rotationSpeed * 0.2);
    }
  });

  const getGeometry = () => {
    switch (config.type) {
      case ShapeType.BOX:
        return <boxGeometry args={[2, 2, 2]} />;
      case ShapeType.SPHERE:
        return <sphereGeometry args={[1.5, 64, 64]} />;
      case ShapeType.TORUS_KNOT:
        return <torusKnotGeometry args={[1, 0.4, 128, 32]} />;
      case ShapeType.ICOSAHEDRON:
        return <icosahedronGeometry args={[1.8, 0]} />;
      default:
        return <torusKnotGeometry args={[1, 0.4, 128, 32]} />;
    }
  };

  return (
    <mesh ref={meshRef} castShadow receiveShadow>
      {getGeometry()}
      <meshStandardMaterial 
        color={config.color} 
        wireframe={config.wireframe}
        roughness={config.roughness}
        metalness={config.metalness}
        emissive={config.color}
        emissiveIntensity={0.1}
      />
    </mesh>
  );
};

export default Scene;
