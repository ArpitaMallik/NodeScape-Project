import React from 'react';
import { Node } from '../types/Graph';

interface GraphEdgeProps {
  from: Node;
  to: Node;
  isActive: boolean;
}

export const GraphEdge: React.FC<GraphEdgeProps> = ({ from, to, isActive }) => {
  return (
    <line
      x1={from.x}
      y1={from.y}
      x2={to.x}
      y2={to.y}
      stroke={isActive ? '#3b82f6' : '#9ca3af'}
      strokeWidth={isActive ? "3" : "2"}
      className="transition-all duration-300"
    />
  );
};