import React from 'react';
import { Node } from '../types/Graph';

interface GraphNodeProps {
  node: Node;
  isSelected: boolean;
  isVisited: boolean;
  isCurrent: boolean;
  isInQueue: boolean;
  onClick: () => void;
  onDoubleClick: () => void;
}

export const GraphNode: React.FC<GraphNodeProps> = ({
  node,
  isSelected,
  isVisited,
  isCurrent,
  isInQueue,
  onClick,
  onDoubleClick
}) => {
  const getNodeColor = () => {
    if (isCurrent) return '#ef4444'; // red
    if (isVisited) return '#22c55e'; // green
    if (isInQueue) return '#f59e0b'; // yellow
    if (isSelected) return '#3b82f6'; // blue
    return '#6b7280'; // gray
  };

  const getNodeBorder = () => {
    if (isSelected) return '#1d4ed8';
    return getNodeColor();
  };

  return (
    <g 
      className="cursor-pointer transition-all duration-200 hover:scale-110"
      onClick={onClick}
      onDoubleClick={onDoubleClick}
    >
      <circle
        cx={node.x}
        cy={node.y}
        r="25"
        fill={getNodeColor()}
        stroke={getNodeBorder()}
        strokeWidth={isSelected ? "3" : "2"}
        className="transition-all duration-300"
      />
      <text
        x={node.x}
        y={node.y}
        textAnchor="middle"
        dominantBaseline="central"
        className="fill-white font-bold text-lg pointer-events-none select-none"
      >
        {node.label}
      </text>
    </g>
  );
};