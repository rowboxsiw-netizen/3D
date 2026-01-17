
export enum ShapeType {
  BOX = 'BOX',
  SPHERE = 'SPHERE',
  TORUS_KNOT = 'TORUS_KNOT',
  ICOSAHEDRON = 'ICOSAHEDRON',
  OCTAHEDRON = 'OCTAHEDRON'
}

export interface ShapeConfig {
  type: ShapeType;
  color: string;
  wireframe: boolean;
  roughness: number;
  metalness: number;
  rotationSpeed: number;
  distortion: number;
  wobble: number;
}

export interface AIResponse {
  config?: Partial<ShapeConfig>;
  analysis?: {
    title: string;
    description: string;
    mathematicalSignificance: string;
    creativeInsight: string;
  };
}
