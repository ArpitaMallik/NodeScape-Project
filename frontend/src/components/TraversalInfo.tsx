import React from 'react';
import { TraversalStep, Algorithm } from '../types/Graph';

interface TraversalInfoProps {
  algorithm: Algorithm;
  currentStep: TraversalStep | null;
  isComplete: boolean;
}

export const TraversalInfo: React.FC<TraversalInfoProps> = ({
  algorithm,
  currentStep,
  isComplete
}) => {
  const getQueueStackLabel = () => {
    return algorithm === 'bfs' ? 'Queue' : 'Stack';
  };

  const getQueueStackItems = () => {
    if (!currentStep) return [];
    return algorithm === 'bfs' ? (currentStep.queue || []) : (currentStep.stack || []);
  };

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-2xl border border-white/20">
      <h3 className="text-xl font-bold text-white mb-4">
        {algorithm.toUpperCase()} Traversal Info
      </h3>
      
      {currentStep ? (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white/80 mb-1">
              Current Node
            </label>
            <div className="px-3 py-2 bg-red-500/20 border border-red-500/30 rounded-lg text-red-200 font-mono">
              {currentStep.nodeId || 'None'}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80 mb-1">
              {getQueueStackLabel()}
            </label>
            <div className="px-3 py-2 bg-blue-500/20 border border-blue-500/30 rounded-lg text-blue-200 font-mono min-h-[40px]">
              {getQueueStackItems().length > 0 ? getQueueStackItems().join(', ') : 'Empty'}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80 mb-1">
              Visited Nodes
            </label>
            <div className="px-3 py-2 bg-green-500/20 border border-green-500/30 rounded-lg text-green-200 font-mono min-h-[40px]">
              {currentStep.visited.length > 0 ? currentStep.visited.join(', ') : 'None'}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80 mb-1">
              Traversal Path
            </label>
            <div className="px-3 py-2 bg-purple-500/20 border border-purple-500/30 rounded-lg text-purple-200 font-mono min-h-[40px]">
              {currentStep.path.length > 0 ? currentStep.path.join(' → ') : 'None'}
            </div>
          </div>

          {isComplete && (
            <div className="mt-4 p-3 bg-green-500/20 border border-green-500/30 rounded-lg">
              <p className="text-green-200 font-medium">✅ Traversal Complete!</p>
              <p className="text-green-200/80 text-sm mt-1">
                Visited {currentStep.visited.length} nodes
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="text-white/60 text-center py-8">
          Select a start node and click Play to begin traversal
        </div>
      )}
    </div>
  );
};