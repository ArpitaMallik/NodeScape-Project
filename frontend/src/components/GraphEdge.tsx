import React from 'react';
import { Node } from '../types/Graph';

interface GraphEdgeProps {
  from: Node;
  to: Node;
  isActive: boolean;
  isDirected?: boolean;
}

export const GraphEdge: React.FC<GraphEdgeProps> = ({ from, to, isActive, isDirected = false }) => {
  // Calculate arrow position and angle for directed edges
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const length = Math.sqrt(dx * dx + dy * dy);
  const unitX = dx / length;
  const unitY = dy / length;
  
  // Position arrow at edge of target node (radius 25)
  const arrowX = to.x - unitX * 25;
  const arrowY = to.y - unitY * 25;
  
  // Calculate perpendicular vectors for arrowhead
  const perpX = -unitY;
  const perpY = unitX;
  
  const arrowSize = 12;
  const arrowHead1X = arrowX - unitX * arrowSize + perpX * (arrowSize / 2);
  const arrowHead1Y = arrowY - unitY * arrowSize + perpY * (arrowSize / 2);
  const arrowHead2X = arrowX - unitX * arrowSize - perpX * (arrowSize / 2);
  const arrowHead2Y = arrowY - unitY * arrowSize - perpY * (arrowSize / 2);

  return (
    <g>
      <line
        x1={from.x}
        y1={from.y}
        x2={isDirected ? arrowX : to.x}
        y2={isDirected ? arrowY : to.y}
        stroke={isActive ? '#3b82f6' : '#9ca3af'}
        strokeWidth={isActive ? "3" : "2"}
        className="transition-all duration-300"
      />
      {isDirected && (
        <polygon
          points={`${arrowX},${arrowY} ${arrowHead1X},${arrowHead1Y} ${arrowHead2X},${arrowHead2Y}`}
          fill={isActive ? '#3b82f6' : '#9ca3af'}
          className="transition-all duration-300"
        />
      )}
    </g>
  );
};