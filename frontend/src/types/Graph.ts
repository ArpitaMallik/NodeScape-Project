export interface Node {
  id: string;
  x: number;
  y: number;
  label: string;
}

export interface Edge {
  from: string;
  to: string;
}

export interface GraphData {
  nodes: Node[];
  edges: Edge[];
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