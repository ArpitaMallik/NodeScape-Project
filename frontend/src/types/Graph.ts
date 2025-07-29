export interface Node {
  id: string;
  x: number;
  y: number;
  label: string;
}

export interface Edge {
  from: string;
  to: string;
  directed?: boolean;
}

export interface GraphData {
  nodes: Node[];
  edges: Edge[];
  isDirected?: boolean;
}

export interface TraversalStep {
  type: 'visit' | 'explore' | 'complete';
  nodeId: string;
  queue?: string[];
  stack?: string[];
  visited: string[];
  path: string[];
}

export type Algorithm = 'bfs' | 'dfs';

export type GraphType = 'Tree' | 'Cyclic' | 'DAG';

export interface GraphPrediction {
  type: GraphType;
  confidence: number;
  label: number;
}