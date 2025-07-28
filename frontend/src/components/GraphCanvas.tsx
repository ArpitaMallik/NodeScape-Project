import React from 'react';
import { GraphData, TraversalStep } from '../types/Graph';
import { GraphNode } from './GraphNode';
import { GraphEdge } from './GraphEdge';

interface GraphCanvasProps {
  graph: GraphData;
  selectedNodes: string[];
  currentStep: TraversalStep | null;
  onNodeClick: (nodeId: string) => void;
  onNodeDoubleClick: (nodeId: string) => void;
  onCanvasClick: (x: number, y: number) => void;
}

export const GraphCanvas: React.FC<GraphCanvasProps> = ({
  graph,
  selectedNodes,
  currentStep,
  onNodeClick,
  onNodeDoubleClick,
  onCanvasClick
}) => {
  const handleCanvasClick = (e: React.MouseEvent<SVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    onCanvasClick(x, y);
  };

  const isNodeVisited = (nodeId: string) => {
    return currentStep?.visited.includes(nodeId) || false;
  };

  const isNodeCurrent = (nodeId: string) => {
    return currentStep?.nodeId === nodeId;
  };

  const isNodeInQueue = (nodeId: string) => {
    return currentStep?.queue?.includes(nodeId) || currentStep?.stack?.includes(nodeId) || false;
  };

  const isEdgeActive = (fromId: string, toId: string) => {
    if (!currentStep) return false;
    const visited = currentStep.visited;
    return visited.includes(fromId) && visited.includes(toId);
  };

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-2xl border border-white/20">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-white">Graph Visualization</h3>
        <div className="text-sm text-white/60">
          Click empty space to add nodes • Click nodes to connect • Double-click to remove
        </div>
      </div>
      
      <div className="bg-gray-900/50 rounded-xl border border-white/10 overflow-hidden">
        <svg
          width="800"
          height="500"
          className="cursor-crosshair"
          onClick={handleCanvasClick}
        >
          {/* Grid pattern */}
          <defs>
            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#374151" strokeWidth="0.5" opacity="0.3"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
          
          {/* Edges */}
          {graph.edges.map((edge, index) => {
            const fromNode = graph.nodes.find(n => n.id === edge.from);
            const toNode = graph.nodes.find(n => n.id === edge.to);
            if (!fromNode || !toNode) return null;
            
            return (
              <GraphEdge
                key={index}
                from={fromNode}
                to={toNode}
                isActive={isEdgeActive(edge.from, edge.to)}
              />
            );
          })}
          
          {/* Nodes */}
          {graph.nodes.map(node => (
            <GraphNode
              key={node.id}
              node={node}
              isSelected={selectedNodes.includes(node.id)}
              isVisited={isNodeVisited(node.id)}
              isCurrent={isNodeCurrent(node.id)}
              isInQueue={isNodeInQueue(node.id)}
              onClick={() => onNodeClick(node.id)}
              onDoubleClick={() => onNodeDoubleClick(node.id)}
            />
          ))}
        </svg>
      </div>
      
      {/* Legend */}
      <div className="mt-4 flex flex-wrap gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-gray-500"></div>
          <span className="text-white/80">Unvisited</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
          <span className="text-white/80">In Queue/Stack</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-red-500"></div>
          <span className="text-white/80">Current</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-green-500"></div>
          <span className="text-white/80">Visited</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-blue-500 border-2 border-blue-800"></div>
          <span className="text-white/80">Selected</span>
        </div>
      </div>
    </div>
  );
};