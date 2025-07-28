import React from 'react';
import { Play, Pause, Square, RotateCcw, Plus } from 'lucide-react';
import { Algorithm } from '../types/Graph';

interface ControlPanelProps {
  algorithm: Algorithm;
  setAlgorithm: (algorithm: Algorithm) => void;
  isPlaying: boolean;
  onPlay: () => void;
  onPause: () => void;
  onStop: () => void;
  onReset: () => void;
  speed: number;
  setSpeed: (speed: number) => void;
  startNode: string | null;
  setStartNode: (nodeId: string) => void;
  availableNodes: { id: string; label: string }[];
  onClearGraph: () => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  algorithm,
  setAlgorithm,
  isPlaying,
  onPlay,
  onPause,
  onStop,
  onReset,
  speed,
  setSpeed,
  startNode,
  setStartNode,
  availableNodes,
  onClearGraph
}) => {
  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-2xl border border-white/20">
      <h3 className="text-xl font-bold text-white mb-4">Algorithm Controls</h3>
      
      {/* Algorithm Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-white/80 mb-2">
          Algorithm
        </label>
        <div className="flex gap-2">
          <button
            onClick={() => setAlgorithm('bfs')}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              algorithm === 'bfs'
                ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30'
                : 'bg-white/10 text-white/70 hover:bg-white/20'
            }`}
          >
            BFS
          </button>
          <button
            onClick={() => setAlgorithm('dfs')}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              algorithm === 'dfs'
                ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/30'
                : 'bg-white/10 text-white/70 hover:bg-white/20'
            }`}
          >
            DFS
          </button>
        </div>
      </div>

      {/* Start Node Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-white/80 mb-2">
          Start Node
        </label>
        <select
          value={startNode || ''}
          onChange={(e) => setStartNode(e.target.value)}
          className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
        >
          <option value="">Select start node</option>
          {availableNodes.map(node => (
            <option key={node.id} value={node.id} className="text-black">
              {node.label}
            </option>
          ))}
        </select>
      </div>

      {/* Playback Controls */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-white/80 mb-2">
          Playback
        </label>
        <div className="flex gap-2">
          {!isPlaying ? (
            <button
              onClick={onPlay}
              disabled={!startNode}
              className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 disabled:bg-gray-500 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-all duration-200"
            >
              <Play size={16} />
              Play
            </button>
          ) : (
            <button
              onClick={onPause}
              className="flex items-center gap-2 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg font-medium transition-all duration-200"
            >
              <Pause size={16} />
              Pause
            </button>
          )}
          <button
            onClick={onStop}
            className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-all duration-200"
          >
            <Square size={16} />
            Stop
          </button>
          <button
            onClick={onReset}
            className="flex items-center gap-2 px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition-all duration-200"
          >
            <RotateCcw size={16} />
            Reset
          </button>
        </div>
      </div>

      {/* Speed Control */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-white/80 mb-2">
          Speed: {speed}ms
        </label>
        <input
          type="range"
          min="100"
          max="2000"
          step="100"
          value={speed}
          onChange={(e) => setSpeed(Number(e.target.value))}
          className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
        />
      </div>

      {/* Graph Controls */}
      <div>
        <button
          onClick={onClearGraph}
          className="flex items-center gap-2 w-full px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-200 border border-red-500/30 rounded-lg font-medium transition-all duration-200"
        >
          <Plus size={16} className="rotate-45" />
          Clear Graph
        </button>
      </div>
    </div>
  );
};