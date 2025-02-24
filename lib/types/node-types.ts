import { Node } from "@xyflow/react";

export interface BaseNodeData extends Record<string, unknown> {
  label: string;
}

export interface SimulationNodeData extends BaseNodeData {
  type: "simulation";
  simulationType: string;
  parameters: Record<string, number>;
}

export interface GeometryNodeData extends BaseNodeData {
  type: "geometry";
  shape: string;
  dimensions: Record<string, number>;
}

export interface SpecsNodeData extends BaseNodeData {
  type: "specs";
  requirements: string[];
  constraints: Record<string, number>;
}

export interface MaterialNodeData extends BaseNodeData {
  type: "material";
  material: string;
  properties: {
    density: number;
    elasticity: number;
    [key: string]: number;
  };
}

export type CADNodeData =
  | SimulationNodeData
  | GeometryNodeData
  | SpecsNodeData
  | MaterialNodeData;

export type CADNode = Node<CADNodeData>;

// Type for the props received by node components
export interface CADNodeProps {
  id: string;
  type: string;
  data: CADNodeData;
  selected?: boolean;
  isConnectable?: boolean;
  xPos?: number;
  yPos?: number;
  dragHandle?: string;
  sourcePosition?: string;
  targetPosition?: string;
}
