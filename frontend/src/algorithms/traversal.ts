import { GraphData, TraversalStep } from '../types/Graph';

export class GraphTraversal {
  private graph: GraphData;
  private adjacencyList: Map<string, string[]>;

  constructor(graph: GraphData) {
    this.graph = graph;
    this.adjacencyList = this.buildAdjacencyList();
  }

  private buildAdjacencyList(): Map<string, string[]> {
    const adj = new Map<string, string[]>();
    
    // Initialize all nodes
    this.graph.nodes.forEach(node => {
      adj.set(node.id, []);
    });

    // Add edges (undirected graph)
    this.graph.edges.forEach(edge => {
      adj.get(edge.from)?.push(edge.to);
      // Only add reverse edge for undirected graphs
      if (!edge.directed) {
        adj.get(edge.to)?.push(edge.from);
      }
    });

    return adj;
  }

  *bfs(startNodeId: string): Generator<TraversalStep> {
    const visited = new Set<string>();
    const queue: string[] = [startNodeId];
    const path: string[] = [];

    while (queue.length > 0) {
      const current = queue.shift()!;
      
      if (visited.has(current)) continue;

      visited.add(current);
      path.push(current);

      yield {
        type: 'visit',
        nodeId: current,
        queue: [...queue],
        visited: Array.from(visited),
        path: [...path]
      };

      // Add neighbors to queue
      const neighbors = this.adjacencyList.get(current) || [];
      for (const neighbor of neighbors) {
        if (!visited.has(neighbor) && !queue.includes(neighbor)) {
          queue.push(neighbor);
          
          yield {
            type: 'explore',
            nodeId: neighbor,
            queue: [...queue],
            visited: Array.from(visited),
            path: [...path]
          };
        }
      }
    }

    yield {
      type: 'complete',
      nodeId: startNodeId,
      queue: [],
      visited: Array.from(visited),
      path
    };
  }

  *dfs(startNodeId: string): Generator<TraversalStep> {
    const visited = new Set<string>();
    const stack: string[] = [startNodeId];
    const path: string[] = [];

    while (stack.length > 0) {
      const current = stack.pop()!;
      
      if (visited.has(current)) continue;

      visited.add(current);
      path.push(current);

      yield {
        type: 'visit',
        nodeId: current,
        stack: [...stack],
        visited: Array.from(visited),
        path: [...path]
      };

      // Add neighbors to stack (in reverse order for consistent traversal)
      const neighbors = this.adjacencyList.get(current) || [];
      for (let i = neighbors.length - 1; i >= 0; i--) {
        const neighbor = neighbors[i];
        if (!visited.has(neighbor) && !stack.includes(neighbor)) {
          stack.push(neighbor);
          
          yield {
            type: 'explore',
            nodeId: neighbor,
            stack: [...stack],
            visited: Array.from(visited),
            path: [...path]
          };
        }
      }
    }

    yield {
      type: 'complete',
      nodeId: startNodeId,
      stack: [],
      visited: Array.from(visited),
      path
    };
  }
}