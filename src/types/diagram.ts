export type ElementType = 
  | 'architecture'  // Tech node with icon, label, subtitle
  | 'shape'         // Rectangle, ellipse, diamond, cylinder, pill, cloud
  | 'group'         // Subnet / VPC / container boundary
  | 'text';         // Standalone text block

export type NodeShape = 
  | 'rectangle' 
  | 'ellipse' 
  | 'diamond' 
  | 'cylinder' 
  | 'capsule' 
  | 'cloud';

export type LineRouting = 'smoothstep' | 'orthogonal' | 'straight' | 'curved';
export type StrokeStyle = 'solid' | 'dashed' | 'dotted';

export interface DiagramElementData {
  label: string;
  subtitle?: string;
  icon?: string;
  shape?: NodeShape;
  fillColor?: string;
  strokeColor?: string;
  strokeWidth?: number;
  strokeStyle?: StrokeStyle;
  textColor?: string;
  fontSize?: number;
  textAlign?: 'left' | 'center' | 'right';
  badge?: string;
  [key: string]: unknown;
}

export interface DiagramElement {
  id: string;
  type: ElementType;
  position: { x: number; y: number };
  dimensions: { width: number; height: number };
  parentId?: string;
  data: DiagramElementData;
}

export interface DiagramConnection {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string;
  targetHandle?: string;
  label?: string;
  routing?: LineRouting;
  strokeColor?: string;
  strokeWidth?: number;
  strokeStyle?: StrokeStyle;
  animated?: boolean;
  arrowHead?: 'arrow' | 'arrowclosed' | 'bidirectional' | 'none';
}

export interface DiagramGroup {
  id: string;
  label: string;
  bounds: { x: number; y: number; width: number; height: number };
  colorTheme?: string;
  childrenIds: string[];
}

export interface DiagramDocument {
  schemaVersion: 1;
  id: string;
  title: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  revision: number;
  elements: DiagramElement[];
  connections: DiagramConnection[];
  groups: DiagramGroup[];
  viewport: {
    x: number;
    y: number;
    zoom: number;
  };
  metadata: {
    theme?: 'light' | 'dark' | 'system';
    gridType?: 'dots' | 'lines' | 'none';
  };
}

