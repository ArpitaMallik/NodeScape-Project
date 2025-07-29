import { useState, useCallback } from 'react';
import { GraphData } from '../types/Graph';

export const useGraph = () => {
  const [graph, setGraph] = useState<GraphData>({ nodes: [], edges: [] });
  const [selectedNodes, setSelectedNodes] = useState<string[]>([]);
  const [isDirected, setIsDirected] = useState(false);

  const addNode = useCallback((x: number, y: number) => {
    const id = `node-${Date.now()}`;
    const label = String.fromCharCode(65 + graph.nodes.length); // A, B, C, etc.
    
    setGraph(prev => ({
      ...prev,
      nodes: [...prev.nodes, { id, x, y, label }]
    }));
  }, [graph.nodes.length]);

  const removeNode = useCallback((nodeId: string) => {
    setGraph(prev => ({
      nodes: prev.nodes.filter(node => node.id !== nodeId),
      edges: prev.edges.filter(edge => edge.from !== nodeId && edge.to !== nodeId)
    }));
    setSelectedNodes(prev => prev.filter(id => id !== nodeId));
  }, []);

  const addEdge = useCallback((from: string, to: string) => {
    // Prevent duplicate edges and self-loops
    if (from === to) return;
    
    const edgeExists = graph.edges.some(edge => 
      (edge.from === from && edge.to === to) || 
      (edge.from === to && edge.to === from)
    );
    
    if (!edgeExists) {
      setGraph(prev => ({
        ...prev,
        edges: [...prev.edges, { from, to, directed: isDirected }]
      }));
    }
  }, [graph.edges, isDirected]);

  const selectNode = useCallback((nodeId: string) => {
    setSelectedNodes(prev => {
      if (prev.includes(nodeId)) {
        return prev.filter(id => id !== nodeId);
      } else if (prev.length < 2) {
        const newSelection = [...prev, nodeId];
        if (newSelection.length === 2) {
          addEdge(newSelection[0], newSelection[1]);
          return [];
        }
        return newSelection;
      }
      return prev;
    });
  }, [addEdge]);

  const clearGraph = useCallback(() => {
    setGraph({ nodes: [], edges: [] });
    setSelectedNodes([]);
  }, []);

  const toggleDirected = useCallback(() => {
  setIsDirected(prevIsDirected => {
    const newDirected = !prevIsDirected;
    setGraph(prev => ({
      ...prev,
      edges: prev.edges.map(edge => ({ ...edge, directed: newDirected }))
    }));
    return newDirected;
  });
}, []);


  return {
    graph,
    selectedNodes,
    isDirected,
    addNode,
    removeNode,
    selectNode,
    clearGraph,
    toggleDirected
  };
};