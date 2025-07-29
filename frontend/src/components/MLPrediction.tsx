import React, { useState } from 'react';
import { Brain, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { GraphData, GraphPrediction } from '../types/Graph';
import { convertGraphToMLFormat, formatEdgesForDisplay } from '../utils/graphConverter';
import { MLService } from '../services/mlService';

interface MLPredictionProps {
  graph: GraphData;
}

export const MLPrediction: React.FC<MLPredictionProps> = ({ graph }) => {
  const [prediction, setPrediction] = useState<GraphPrediction | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePredict = async () => {
    if (graph.nodes.length === 0) {
      setError('Please create a graph first');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const mlService = MLService.getInstance();
      const edgePairs = convertGraphToMLFormat(graph);
      const result = await mlService.predictGraphType(edgePairs, graph.nodes.length);
      setPrediction(result);
    } catch (err) {
      setError('Failed to predict graph type');
      console.error('Prediction error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Tree': return 'text-green-400 bg-green-500/20 border-green-500/30';
      case 'Cyclic': return 'text-red-400 bg-red-500/20 border-red-500/30';
      case 'DAG': return 'text-blue-400 bg-blue-500/20 border-blue-500/30';
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Tree': return <CheckCircle size={16} className="text-green-400" />;
      case 'Cyclic': return <AlertCircle size={16} className="text-red-400" />;
      case 'DAG': return <CheckCircle size={16} className="text-blue-400" />;
      default: return null;
    }
  };

  const edgePairs = convertGraphToMLFormat(graph);
  const formattedEdges = formatEdgesForDisplay(edgePairs);

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-2xl border border-white/20">
      <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <Brain className="text-purple-400" size={24} />
        ML Graph Classification
      </h3>

      {/* Graph Data Display */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-white/80 mb-2">
          Graph Data (ML Format)
        </label>
        <div className="px-3 py-2 bg-gray-500/20 border border-gray-500/30 rounded-lg text-gray-200 font-mono text-xs max-h-20 overflow-y-auto">
          {graph.nodes.length > 0 ? formattedEdges : 'No graph data'}
        </div>
        <div className="text-xs text-white/60 mt-1">
          Nodes: {graph.nodes.length}, Edges: {graph.edges.length}
        </div>
      </div>

      {/* Predict Button */}
      <button
        onClick={handlePredict}
        disabled={isLoading || graph.nodes.length === 0}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-purple-500 hover:bg-purple-600 disabled:bg-gray-500 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-all duration-200 mb-4"
      >
        {isLoading ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            Analyzing...
          </>
        ) : (
          <>
            <Brain size={16} />
            Predict Graph Type
          </>
        )}
      </button>

      {/* Error Display */}
      {error && (
        <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
          <p className="text-red-200 text-sm">{error}</p>
        </div>
      )}

      {/* Prediction Results */}
      {prediction && (
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Predicted Type
            </label>
            <div className={`px-3 py-2 border rounded-lg font-medium flex items-center gap-2 ${getTypeColor(prediction.type)}`}>
              {getTypeIcon(prediction.type)}
              {prediction.type}
              <span className="text-xs opacity-75">(Label: {prediction.label})</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Confidence
            </label>
            <div className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg">
              <div className="flex items-center justify-between text-white">
                <span>{(prediction.confidence * 100).toFixed(1)}%</span>
                <div className="w-24 h-2 bg-white/20 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
                    style={{ width: `${prediction.confidence * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Graph Type Descriptions */}
          <div className="mt-4 p-3 bg-white/5 rounded-lg">
            <h4 className="text-sm font-medium text-white/80 mb-2">Graph Types:</h4>
            <div className="space-y-1 text-xs text-white/60">
              <div>• <span className="text-green-400">Tree</span>: Connected acyclic graph</div>
              <div>• <span className="text-red-400">Cyclic</span>: Contains at least one cycle</div>
              <div>• <span className="text-blue-400">DAG</span>: Directed Acyclic Graph</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};