
export enum ShapeType {
  BOX = 'BOX',
  SPHERE = 'SPHERE',
  TORUS_KNOT = 'TORUS_KNOT',
  ICOSAHEDRON = 'ICOSAHEDRON'
}

export interface ShapeConfig {
  type: ShapeType;
  color: string;
  wireframe: boolean;
  roughness: number;
  metalness: number;
  rotationSpeed: number;
}

export interface AIAnalysis {
  title: string;
  description: string;
  mathematicalSignificance: string;
  creativeInsight: string;
}
