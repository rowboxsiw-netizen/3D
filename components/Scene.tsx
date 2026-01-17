
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh } from 'three';
import { MeshDistortMaterial, MeshWobbleMaterial } from '@react-three/drei';
import { ShapeType, ShapeConfig } from '../types';

interface SceneProps {
  config: ShapeConfig;
}

const Scene: React.FC<SceneProps> = ({ config }) => {
  const meshRef = useRef<Mesh>(null);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * (config.rotationSpeed * 0.1);
      meshRef.current.rotation.z += delta * (config.rotationSpeed * 0.05);
    }
  });

  const getGeometry = () => {
    switch (config.type) {
      case ShapeType.BOX:
        return <boxGeometry args={[2.5, 2.5, 2.5]} />;
      case ShapeType.SPHERE:
        return <sphereGeometry args={[1.8, 128, 128]} />;
      case ShapeType.TORUS_KNOT:
        return <torusKnotGeometry args={[1.2, 0.45, 256, 64]} />;
      case ShapeType.ICOSAHEDRON:
        return <icosahedronGeometry args={[2, 0]} />;
      case ShapeType.OCTAHEDRON:
        return <octahedronGeometry args={[2, 0]} />;
      default:
        return <torusKnotGeometry args={[1.2, 0.45, 256, 64]} />;
    }
  };

  // Switch between materials based on config
  // Use Distort for more liquid-like feel, Wobble for subtle physics
  const isHighDistortion = config.distortion > 0.5;

  return (
    <mesh ref={meshRef} castShadow receiveShadow>
      {getGeometry()}
      {isHighDistortion ? (
        <MeshDistortMaterial 
          color={config.color} 
          speed={config.wobble * 10} 
          distort={config.distortion} 
          roughness={config.roughness}
          metalness={config.metalness}
          wireframe={config.wireframe}
          emissive={config.color}
          emissiveIntensity={0.2}
        />
      ) : (
        <MeshWobbleMaterial 
          color={config.color} 
          speed={config.wobble * 5} 
          factor={config.distortion * 2} 
          roughness={config.roughness}
          metalness={config.metalness}
          wireframe={config.wireframe}
          emissive={config.color}
          emissiveIntensity={0.1}
        />
      )}
    </mesh>
  );
};

export default Scene;
