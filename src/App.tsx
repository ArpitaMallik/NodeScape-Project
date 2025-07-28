import React, { useState, useEffect, useRef } from 'react';
import { useGraph } from './hooks/useGraph';
import { GraphTraversal } from './algorithms/traversal';
import { GraphCanvas } from './components/GraphCanvas';
import { ControlPanel } from './components/ControlPanel';
import { TraversalInfo } from './components/TraversalInfo';
import { Algorithm, TraversalStep } from './types/Graph';

function App() {
  const { graph, selectedNodes, addNode, removeNode, selectNode, clearGraph } = useGraph();
  const [algorithm, setAlgorithm] = useState<Algorithm>('bfs');
  const [startNode, setStartNode] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(800);
  const [currentStep, setCurrentStep] = useState<TraversalStep | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  
  const traversalGeneratorRef = useRef<Generator<TraversalStep> | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleCanvasClick = (x: number, y: number) => {
    // Don't add nodes if we're too close to existing ones
    const MIN_DISTANCE = 60;
    const tooClose = graph.nodes.some(node => {
      const distance = Math.sqrt(Math.pow(x - node.x, 2) + Math.pow(y - node.y, 2));
      return distance < MIN_DISTANCE;
    });

    if (!tooClose && x > 25 && x < 775 && y > 25 && y < 475) {
      addNode(x, y);
    }
  };

  const handlePlay = () => {
    if (!startNode) return;

    const traversal = new GraphTraversal(graph);
    traversalGeneratorRef.current = algorithm === 'bfs' 
      ? traversal.bfs(startNode) 
      : traversal.dfs(startNode);
    
    setIsPlaying(true);
    setIsComplete(false);
    nextStep();
  };

  const nextStep = () => {
    if (!traversalGeneratorRef.current) return;

    const result = traversalGeneratorRef.current.next();
    
    if (result.done) {
      setIsPlaying(false);
      setIsComplete(true);
      return;
    }

    setCurrentStep(result.value);

    if (result.value.type === 'complete') {
      setIsPlaying(false);
      setIsComplete(true);
      return;
    }

    timeoutRef.current = setTimeout(nextStep, speed);
  };

  const handlePause = () => {
    setIsPlaying(false);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  const handleStop = () => {
    handlePause();
    setCurrentStep(null);
    setIsComplete(false);
    traversalGeneratorRef.current = null;
  };

  const handleReset = () => {
    handleStop();
    setStartNode(null);
  };

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Reset start node if it's deleted
  useEffect(() => {
    if (startNode && !graph.nodes.find(node => node.id === startNode)) {
      setStartNode(null);
    }
  }, [graph.nodes, startNode]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Algorithm Visualizer
          </h1>
          <p className="text-white/80 text-lg">
            Interactive BFS & DFS Graph Traversal Visualization
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Graph Canvas - Takes up 2 columns */}
          <div className="xl:col-span-2">
            <GraphCanvas
              graph={graph}
              selectedNodes={selectedNodes}
              currentStep={currentStep}
              onNodeClick={selectNode}
              onNodeDoubleClick={removeNode}
              onCanvasClick={handleCanvasClick}
            />
          </div>

          {/* Control Panel */}
          <div>
            <ControlPanel
              algorithm={algorithm}
              setAlgorithm={setAlgorithm}
              isPlaying={isPlaying}
              onPlay={handlePlay}
              onPause={handlePause}
              onStop={handleStop}
              onReset={handleReset}
              speed={speed}
              setSpeed={setSpeed}
              startNode={startNode}
              setStartNode={setStartNode}
              availableNodes={graph.nodes.map(node => ({ id: node.id, label: node.label }))}
              onClearGraph={clearGraph}
            />
          </div>

          {/* Traversal Info */}
          <div>
            <TraversalInfo
              algorithm={algorithm}
              currentStep={currentStep}
              isComplete={isComplete}
            />
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-2xl border border-white/20">
          <h3 className="text-xl font-bold text-white mb-4">How to Use</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-white/80">
            <div>
              <h4 className="font-semibold text-white mb-2">1. Build Your Graph</h4>
              <p className="text-sm">Click on empty space to add nodes. Click two nodes to connect them with an edge. Double-click nodes to remove them.</p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-2">2. Configure Algorithm</h4>
              <p className="text-sm">Choose between BFS (Breadth-First Search) or DFS (Depth-First Search). Select a starting node and adjust the animation speed.</p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-2">3. Visualize Traversal</h4>
              <p className="text-sm">Click Play to start the visualization. Watch as the algorithm explores the graph step by step, with real-time updates.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;