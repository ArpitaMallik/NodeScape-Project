import { GraphPrediction, GraphType } from '../types/Graph';

// Mock ML service - In a real implementation, this would call your ML model API
export class MLService {
  private static instance: MLService;

  private constructor() {}

  public static getInstance(): MLService {
    if (!MLService.instance) {
      MLService.instance = new MLService();
    }
    return MLService.instance;
  }


  public async predictGraphType(edgePairs: number[][], nodeCount: number): Promise<GraphPrediction> {
  try {
    const response = await fetch('/api/predict-graph-type', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        edges: edgePairs,
        node_count: nodeCount,
      }),
    });

    if (!response.ok) throw new Error('Prediction failed');

    const result = await response.json();
    const typeMap: { [key: number]: GraphType } = {
      2: 'Tree',
      0: 'Cyclic',
      1: 'DAG',
    };

    return {
      type: typeMap[result.label] || 'Unknown',
      confidence: result.confidence || 0.0,
      label: result.label,
    };
  } catch (err) {
    console.error('Prediction error:', err);
    throw err;
  }
}


  // Method to call actual ML model endpoint
  public async callMLEndpoint(edgePairs: number[][]): Promise<GraphPrediction> {
    try {
      // Replace with your actual ML model endpoint
      const response = await fetch('/api/predict-graph-type', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          edges: edgePairs
        })
      });

      if (!response.ok) {
        throw new Error('ML prediction failed');
      }

      const result = await response.json();
      
      // Map the response to our GraphPrediction interface
      const typeMap: { [key: number]: GraphType } = {
        0: 'Tree',
        1: 'Cyclic',
        2: 'DAG'
      };

      return {
        type: typeMap[result.label] || 'DAG',
        confidence: result.confidence || 0.5,
        label: result.label
      };
    } catch (error) {
      console.error('ML prediction error:', error);
      // Fallback to mock prediction
      return this.predictGraphType(edgePairs, edgePairs.length);
    }
  }
}