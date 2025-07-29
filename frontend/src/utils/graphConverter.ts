import { GraphData } from '../types/Graph';

export const convertGraphToMLFormat = (graph: GraphData): number[][] => {
  // Create a mapping from node IDs to indices
  const nodeIdToIndex = new Map<string, number>();
  graph.nodes.forEach((node, index) => {
    nodeIdToIndex.set(node.id, index);
  });

  // Convert edges to index pairs
  const edgePairs: number[][] = [];
  graph.edges.forEach(edge => {
    const fromIndex = nodeIdToIndex.get(edge.from);
    const toIndex = nodeIdToIndex.get(edge.to);
    
    if (fromIndex !== undefined && toIndex !== undefined) {
      edgePairs.push([fromIndex, toIndex]);
      // Add reverse direction only for undirected graphs
      if (!edge.directed) {
        edgePairs.push([toIndex, fromIndex]);
      }
    }
  });

  return edgePairs;
};

export const formatEdgesForDisplay = (edgePairs: number[][]): string => {
  // Remove duplicates and sort for consistent display
  const uniqueEdges = new Set<string>();
  edgePairs.forEach(([from, to]) => {
    const edge = from < to ? `(${from}, ${to})` : `(${to}, ${from})`;
    uniqueEdges.add(edge);
  });
  
  return `[${Array.from(uniqueEdges).sort().join(', ')}]`;
};